"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

import { glowTexture, mountStage, seeded, type Input, type Palette, type StageScene } from "./stage"

const BEAM_LENGTH = 70
const LAMP_Y = 10.75

const waves = /* glsl */ `
  uniform float uTime;
  float sea(vec2 p, float detail, out vec2 g) {
    float h = 0.0; g = vec2(0.0); vec2 d; float ph;
    #define W(dx, dy, f, a, s) d = normalize(vec2(dx, dy)); ph = dot(d, p) * f + uTime * s; h += a * sin(ph); g += a * f * cos(ph) * d;
    W(1.0, 0.3, 0.22, 0.16, 0.9)
    W(-0.4, 1.0, 0.31, 0.10, 1.1)
    W(0.7, -0.8, 0.63, 0.05 * detail, 1.7)
    W(-0.9, -0.2, 1.3, 0.025 * detail, 2.4)
    W(0.2, 1.0, 2.4, 0.012 * detail, 3.1)
    return h;
  }
`

const seaVertex = /* glsl */ `
  ${waves}
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vec2 g;
    world.y += sea(world.xz, 0.0, g);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const seaFragment = /* glsl */ `
  ${waves}
  uniform vec3 uSea, uHorizon, uBeam, uMoon, uLamp, uMoonDir;
  uniform vec2 uBeamDir;
  uniform float uFog, uGlint, uMoonAmt;
  varying vec3 vWorld;
  void main() {
    float dist = length(cameraPosition - vWorld);
    vec2 g;
    sea(vWorld.xz, 1.0 - smoothstep(25.0, 140.0, dist), g);
    float calm = smoothstep(60.0, 320.0, dist);
    vec3 n = normalize(vec3(-g.x * (1.0 - calm), 1.0, -g.y * (1.0 - calm)));
    vec3 v = normalize(cameraPosition - vWorld);
    float fr = 0.02 + 0.98 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
    vec3 col = mix(uSea, uHorizon, fr * 0.9);

    vec3 hv = normalize(normalize(uLamp - vWorld) + v);
    float nh = max(dot(n, hv), 0.0);
    float dl = length(vWorld.xz - uLamp.xz);
    col += uBeam * (pow(nh, 120.0) * 2.5 + pow(nh, 18.0) * 0.06) * exp(-dl / 45.0) * uGlint;

    float align = dot(normalize(vWorld.xz - uLamp.xz), uBeamDir);
    float band = smoothstep(0.9, 1.0, align) * (1.0 - exp(-dl / 6.0)) * exp(-dl / 90.0);
    col += uBeam * band * (0.035 + 0.8 * pow(nh, 40.0)) * uGlint;

    col += uMoon * pow(max(dot(n, normalize(uMoonDir + v)), 0.0), 220.0) * uMoonAmt;

    float f = 1.0 - exp(-pow(dist * uFog, 1.6));
    gl_FragColor = vec4(mix(col, uHorizon, clamp(f, 0.0, 1.0)), 1.0);
    #include <colorspace_fragment>
  }
`

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const skyFragment = /* glsl */ `
  uniform vec3 uSky, uHorizon, uBeam;
  uniform float uGlow;
  varying vec3 vDir;
  void main() {
    float h = vDir.y;
    vec3 c = mix(uHorizon, uSky, smoothstep(-0.02, 0.3, h));
    c += uBeam * uGlow * exp(-max(h, 0.0) * 14.0);
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
  }
`

const beamVertex = /* glsl */ `
  uniform float uLen;
  varying float vT;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vT = clamp(-position.x / uLen, 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

const beamFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying float vT;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float facing = abs(dot(normalize(vN), normalize(vV)));
    float along = smoothstep(0.0, 0.03, vT) * pow(1.0 - vT, 1.8);
    float a = uIntensity * pow(facing, 3.0) * along;
    a += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 3.0 / 255.0;
    gl_FragColor = vec4(uColor, clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`

function bandTexture() {
  const rows = 128
  const data = new Uint8Array(rows * 4)
  for (let i = 0; i < rows; i++) {
    const v = i / (rows - 1)
    const band = [0.34, 0.62].some((c) => Math.abs(v - c) < 0.055) ? 0.8 : 1
    const weathering = 0.86 + 0.14 * Math.min(v * 1.6, 1)
    data.set([255 * band * weathering, 255 * band * weathering, 255 * band * weathering, 255], i * 4)
  }
  const texture = new THREE.DataTexture(data, 1, rows)
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

function createLighthouse(): StageScene {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1400)
  const fog = new THREE.Fog(0x000000, 55, 320)
  scene.fog = fog
  const horizon = new THREE.Color()
  const white = new THREE.Color(1, 1, 1)

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(600, 32, 16),
    new THREE.ShaderMaterial({
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uSky: { value: new THREE.Color() }, uHorizon: { value: horizon }, uBeam: { value: new THREE.Color() }, uGlow: { value: 0 } },
    })
  )
  sky.renderOrder = -1
  scene.add(sky)

  const random = seeded(7)
  const starPositions: number[] = []
  while (starPositions.length < 700 * 3) {
    const u = random() * 2 - 1
    const theta = random() * Math.PI * 2
    const r = Math.sqrt(1 - u * u)
    if (u < 0.06) continue
    starPositions.push(r * Math.cos(theta) * 450, u * 450, r * Math.sin(theta) * 450)
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3))
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xdfe8f2, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0.5, fog: false, depthWrite: false })
  )
  scene.add(stars)

  const seaUniforms = {
    uTime: { value: 0 },
    uSea: { value: new THREE.Color() },
    uHorizon: { value: horizon },
    uBeam: { value: new THREE.Color() },
    uMoon: { value: new THREE.Color() },
    uLamp: { value: new THREE.Vector3(0, LAMP_Y, 0) },
    uMoonDir: { value: new THREE.Vector3(0.3, 0.22, -1).normalize() },
    uBeamDir: { value: new THREE.Vector2(-1, 0) },
    uFog: { value: 1 / 170 },
    uGlint: { value: 1 },
    uMoonAmt: { value: 0.5 },
  }
  const seaGeometry = new THREE.PlaneGeometry(900, 900, 220, 220)
  seaGeometry.rotateX(-Math.PI / 2)
  scene.add(
    new THREE.Mesh(seaGeometry, new THREE.ShaderMaterial({ vertexShader: seaVertex, fragmentShader: seaFragment, uniforms: seaUniforms }))
  )

  const hemisphere = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
  const moon = new THREE.DirectionalLight(0xaabbd0, 1)
  moon.position.set(-30, 25, -20)
  const fill = new THREE.DirectionalLight(0xffffff, 1)
  fill.position.set(26, 6, 16)
  const lampLight = new THREE.PointLight(0xffffff, 1, 14, 2)
  lampLight.position.set(0, LAMP_Y, 0)
  scene.add(hemisphere, moon, fill, lampLight)

  const lighthouse = new THREE.Group()
  scene.add(lighthouse)

  const iron = new THREE.MeshStandardMaterial({ color: 0x1c242d, roughness: 0.55, metalness: 0.4 })
  const rockMaterial = new THREE.MeshStandardMaterial({ roughness: 1, flatShading: true })
  const rockGeometry = new THREE.IcosahedronGeometry(1, 1)
  const rocks = new THREE.InstancedMesh(rockGeometry, rockMaterial, 9)
  const matrix = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const euler = new THREE.Euler()
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2 + random() * 0.4
    const dist = i === 0 ? 0 : 1.6 + random() * 1.6
    euler.set(random() * 3, random() * 3, random() * 3)
    matrix.compose(
      new THREE.Vector3(Math.cos(angle) * dist, i === 0 ? 0.1 : -0.15 + random() * 0.3, Math.sin(angle) * dist),
      q.setFromEuler(euler),
      new THREE.Vector3(i === 0 ? 2.6 : 0.9 + random() * 1.1, i === 0 ? 1.1 : 0.5 + random() * 0.6, i === 0 ? 2.4 : 0.9 + random() * 1.1)
    )
    rocks.setMatrixAt(i, matrix)
  }
  lighthouse.add(rocks)

  const towerMaterial = new THREE.MeshStandardMaterial({ roughness: 0.82, map: bandTexture() })
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.95, 1.0, 48), towerMaterial)
  plinth.position.y = 0.9
  const profile: THREE.Vector2[] = []
  for (let i = 0; i <= 24; i++) {
    const s = i / 24
    profile.push(new THREE.Vector2(0.9 + 0.5 * Math.pow(1 - s, 1.35), 1.4 + s * 8.2))
  }
  const towerGeometry = new THREE.LatheGeometry(profile, 72)
  towerGeometry.rotateY(Math.PI)
  const tower = new THREE.Mesh(towerGeometry, towerMaterial)
  lighthouse.add(plinth, tower)

  const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x0b0f14, roughness: 0.4, emissive: new THREE.Color(), emissiveIntensity: 1 })
  const windows = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.34, 0.1), windowMaterial, 3)
  ;[3.2, 5.6, 7.9].forEach((y, i) => {
    const r = 0.9 + 0.5 * Math.pow(1 - (y - 1.4) / 8.2, 1.35)
    const theta = 0.35 + (i % 2) * 0.25
    euler.set(0, theta, 0)
    matrix.compose(new THREE.Vector3(Math.sin(theta) * r, y, Math.cos(theta) * r), q.setFromEuler(euler), new THREE.Vector3(1, 1, 1))
    windows.setMatrixAt(i, matrix)
  })
  lighthouse.add(windows)

  const deck = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.0, 0.3, 48), iron)
  deck.position.y = 9.72
  lighthouse.add(deck)
  for (const y of [10.12, 10.4]) {
    const rail = new THREE.Mesh(new THREE.TorusGeometry(1.34, 0.022, 6, 64), iron)
    rail.rotation.x = Math.PI / 2
    rail.position.y = y
    lighthouse.add(rail)
  }
  const posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.55, 5), iron, 28)
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2
    matrix.makeTranslation(Math.cos(a) * 1.34, 10.14, Math.sin(a) * 1.34)
    posts.setMatrixAt(i, matrix)
  }
  lighthouse.add(posts)

  const lanternBase = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.36, 40), towerMaterial)
  lanternBase.position.y = 10.05
  const glassMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide })
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.76, 1.05, 32, 1, true), glassMaterial)
  glass.position.y = LAMP_Y
  const mullions = new THREE.InstancedMesh(new THREE.BoxGeometry(0.04, 1.05, 0.04), iron, 10)
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2
    matrix.makeTranslation(Math.cos(a) * 0.77, LAMP_Y, Math.sin(a) * 0.77)
    mullions.setMatrixAt(i, matrix)
  }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.98, 0.72, 40), iron)
  roof.position.y = 11.63
  const vent = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), iron)
  vent.position.y = 12.05
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 4), iron)
  rod.position.y = 12.45
  lighthouse.add(lanternBase, glass, mullions, roof, vent, rod)

  const lampMaterial = new THREE.MeshBasicMaterial()
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 16), lampMaterial)
  lamp.position.y = LAMP_Y
  const glowMaterial = new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false, fog: false })
  const glow = new THREE.Sprite(glowMaterial)
  glow.position.y = LAMP_Y
  glow.scale.setScalar(5)
  lighthouse.add(lamp, glow)

  const beamGeometry = new THREE.CylinderGeometry(0.3, 6, BEAM_LENGTH, 128, 1, true)
  beamGeometry.translate(0, -BEAM_LENGTH / 2, 0)
  beamGeometry.rotateZ(-Math.PI / 2)
  const beamMaterial = new THREE.ShaderMaterial({
    vertexShader: beamVertex,
    fragmentShader: beamFragment,
    uniforms: { uColor: { value: new THREE.Color() }, uIntensity: { value: 0.5 }, uLen: { value: BEAM_LENGTH } },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const backMaterial = beamMaterial.clone()
  const yaw = new THREE.Group()
  const pitch = new THREE.Group()
  yaw.position.y = LAMP_Y
  yaw.add(pitch)
  const beam = new THREE.Mesh(beamGeometry, beamMaterial)
  const backBeam = new THREE.Mesh(beamGeometry, backMaterial)
  backBeam.rotation.y = Math.PI
  pitch.add(beam, backBeam)
  scene.add(yaw)

  const cameraBase = new THREE.Vector3()
  const targetBase = new THREE.Vector3()
  const target = new THREE.Vector3()
  let beamGain = 1

  return {
    scene,
    camera,
    resize(width, height) {
      camera.aspect = width / height
      if (width < 768) {
        cameraBase.set(0, 3.4, 40)
        targetBase.set(0, 7.2, 0)
      } else {
        cameraBase.set(0.5, 3.4, 30)
        targetBase.set(-6.5, 6.4, 0)
      }
      camera.updateProjectionMatrix()
    },
    applyPalette(p: Palette) {
      const { dark } = p
      horizon.copy(p.sky).lerp(dark ? p.tower : white, dark ? 0.075 : 0.25)
      scene.background = p.sky
      fog.color.copy(horizon)
      sky.material.uniforms.uSky.value.copy(p.sky)
      sky.material.uniforms.uBeam.value.copy(p.beam)
      sky.material.uniforms.uGlow.value = dark ? 0.018 : 0.012
      stars.visible = dark
      seaUniforms.uSea.value.copy(p.sea)
      seaUniforms.uBeam.value.copy(p.beam)
      seaUniforms.uMoon.value.set(dark ? 0x9fb3c8 : 0xffffff)
      seaUniforms.uGlint.value = dark ? 1.6 : 0.6
      seaUniforms.uMoonAmt.value = dark ? 0.3 : 0.5

      hemisphere.color.copy(p.sky).lerp(white, 0.5)
      hemisphere.groundColor.copy(p.sea)
      hemisphere.intensity = dark ? 0.18 : 1.2
      moon.intensity = dark ? 1.2 : 1.4
      fill.intensity = dark ? 1.3 : 1.8
      lampLight.color.copy(p.beam)
      lampLight.intensity = dark ? 18 : 6

      towerMaterial.color.copy(p.tower)
      rockMaterial.color.copy(p.sea).lerp(p.tower, dark ? 0.12 : 0.55)
      windowMaterial.emissive.copy(p.beam).multiplyScalar(dark ? 0.35 : 0)
      glassMaterial.color.copy(p.beam)
      lampMaterial.color.copy(p.beam).multiplyScalar(1.6)
      glowMaterial.color.copy(p.beam)
      glowMaterial.opacity = dark ? 1 : 0.75

      const blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending
      for (const m of [beamMaterial, backMaterial]) {
        m.uniforms.uColor.value.copy(p.beam)
        m.blending = blending
      }
      glowMaterial.blending = blending
      beamGain = dark ? 1 : 0.6
    },
    update(time: number, _delta: number, input: Input) {
      seaUniforms.uTime.value = time
      const yawAngle = input.still
        ? 0.55
        : 0.35 + Math.sin(time * 0.22) * 0.3 + Math.sin(time * 0.07 + 1.3) * 0.12 + input.px * 0.3
      const pitchAngle = 0.03 + input.scroll * 0.12 - input.py * 0.03
      yaw.rotation.y = yawAngle
      pitch.rotation.z = pitchAngle
      seaUniforms.uBeamDir.value.set(-Math.cos(yawAngle), Math.sin(yawAngle))
      beamMaterial.uniforms.uIntensity.value = 0.46 * beamGain
      backMaterial.uniforms.uIntensity.value = 0.14 * beamGain

      camera.position.set(
        cameraBase.x + input.px * 0.8,
        cameraBase.y + input.py * 0.4 + input.scroll * 3,
        cameraBase.z + input.scroll * 9
      )
      target.copy(targetBase)
      target.y += input.scroll * 1.5
      camera.lookAt(target)
    },
  }
}

/** `mirror` negates pointer x for a container flipped with CSS in RTL layouts. */
export function LighthouseScene({ className, mirror = false }: { className?: string; mirror?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => mountStage(ref.current!, createLighthouse, { mirror }), [mirror])
  return <div ref={ref} role="presentation" className={className} />
}
