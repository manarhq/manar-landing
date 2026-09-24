"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

import { glowTexture, mountStage, type Input, type Palette, type StageScene } from "./stage"

// A fresnel-weighted glass shader: cheaper than transmission and readable on either page theme.
const glassVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vW;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

const glassFragment = /* glsl */ `
  uniform vec3 uTint, uBeam, uHighlight;
  uniform float uCore;
  varying vec3 vN;
  varying vec3 vW;
  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    vec3 v = normalize(cameraPosition - vW);
    float fr = pow(1.0 - abs(dot(n, v)), 3.0);
    vec3 r = reflect(-v, n);
    float stripes = smoothstep(0.6, 1.0, sin(r.y * 16.0) * 0.5 + 0.5);
    float spec = pow(max(dot(r, normalize(vec3(0.4, 0.8, 0.6))), 0.0), 40.0);
    float core = uCore * pow(max(dot(n, normalize(vW)), 0.0), 3.0) * exp(-abs(vW.y) * 1.4);
    vec3 col = uTint * (0.3 + fr) + uHighlight * (spec + stripes * fr * 0.3) + uBeam * core;
    col += vec3(0.9, 0.25, -0.3) * sin(fr * 9.0) * fr * 0.05;
    float a = clamp(0.05 + fr * 0.55 + spec * 0.6 + core * 0.8 + stripes * fr * 0.2, 0.0, 1.0);
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`

const HEIGHT = 1.55

function barrel(y: number) {
  return 1.02 * Math.sqrt(Math.max(1 - (y / HEIGHT) ** 2, 0))
}

function createLens(): StageScene {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
  camera.position.set(0, 0.9, 9.4)
  camera.lookAt(0, 0, 0)

  const glass = new THREE.ShaderMaterial({
    vertexShader: glassVertex,
    fragmentShader: glassFragment,
    uniforms: {
      uTint: { value: new THREE.Color() },
      uBeam: { value: new THREE.Color() },
      uHighlight: { value: new THREE.Color() },
      uCore: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const brass = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.35 })

  const lens = new THREE.Group()
  scene.add(lens)

  const belt = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.56, 64, 1, true), glass)
  lens.add(belt)
  for (let i = 0; i < 9; i++) {
    const y0 = 0.3 + i * 0.125
    const y1 = y0 + 0.115
    const r0 = Math.max(barrel(y0), 0.12)
    const r1 = Math.max(barrel(y1), 0.1)
    const points = [
      new THREE.Vector2(r0 * 0.92, y0),
      new THREE.Vector2(Math.max(r0, r1) + 0.09, y0 + 0.02),
      new THREE.Vector2(r1 * 0.92, y1),
      new THREE.Vector2(r0 * 0.92, y0),
    ]
    const geometry = new THREE.LatheGeometry(points, 64)
    lens.add(new THREE.Mesh(geometry, glass))
    const lower = new THREE.Mesh(geometry, glass)
    lower.scale.y = -1
    lens.add(lower)
  }

  for (const y of [-0.3, 0.3]) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.022, 8, 80), brass)
    band.rotation.x = Math.PI / 2
    band.position.y = y
    lens.add(band)
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const points: THREE.Vector3[] = []
    for (let y = -1.4; y <= 1.401; y += 0.1) {
      const r = Math.max(barrel(y), 0.3) + 0.1
      points.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r))
    }
    lens.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 48, 0.016, 5), brass))
  }
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 0.14, 40), brass)
  cap.position.y = 1.5
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.62, 0.22, 40), brass)
  base.position.y = -1.52
  lens.add(cap, base)

  const coreMaterial = new THREE.MeshBasicMaterial()
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 16), coreMaterial)
  const glowMaterial = new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false })
  const glow = new THREE.Sprite(glowMaterial)
  glow.scale.setScalar(3.6)
  lens.add(core, glow)

  const ambient = new THREE.AmbientLight(0xffffff, 1)
  const key = new THREE.DirectionalLight(0xffffff, 2)
  key.position.set(3, 4, 5)
  const coreLight = new THREE.PointLight(0xffffff, 6, 5, 2)
  scene.add(ambient, key, coreLight)

  return {
    scene,
    camera,
    resize(width, height) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    },
    applyPalette(p: Palette) {
      const { dark } = p
      glass.uniforms.uTint.value.copy(p.tower)
      glass.uniforms.uBeam.value.copy(p.beam)
      glass.uniforms.uHighlight.value.set(dark ? 0xffffff : 0xf6f8fa)
      glass.uniforms.uCore.value = dark ? 1 : 0.7
      brass.color.copy(p.tower).lerp(p.beam, 0.45)
      coreMaterial.color.copy(p.beam).lerp(new THREE.Color(1, 1, 1), 0.55)
      glowMaterial.color.copy(p.beam)
      glowMaterial.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
      glowMaterial.opacity = dark ? 1 : 0.9
      coreLight.color.copy(p.beam)
      ambient.intensity = dark ? 0.6 : 1.4
    },
    update(time: number, _delta: number, input: Input) {
      lens.rotation.y = input.still ? 0.4 : time * 0.22
      lens.rotation.x = 0.12 + input.py * 0.18
      lens.rotation.z = input.px * 0.1
    },
  }
}

export function FresnelLens({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => mountStage(ref.current!, createLens, { alpha: true }), [])
  return <div ref={ref} role="presentation" className={className} />
}
