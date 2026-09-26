import * as THREE from "three"

export type Palette = {
  dark: boolean
  sky: THREE.Color
  sea: THREE.Color
  tower: THREE.Color
  beam: THREE.Color
}

/** Damped pointer position (-1..1), hero scroll progress (0..1), and whether this is a static frame. */
export type Input = { px: number; py: number; scroll: number; still: boolean }

export type StageScene = {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  resize(width: number, height: number): void
  applyPalette(palette: Palette): void
  update(time: number, delta: number, input: Input): void
}

const fallback = {
  dark: { sky: "#0b1016", sea: "#0e1620", tower: "#d9dee4", beam: "#f2b441" },
  light: { sky: "#dfe5eb", sea: "#b9c6d2", tower: "#1b2632", beam: "#d9961e" },
}

export function readPalette(): Palette {
  const root = document.documentElement
  const dark = root.classList.contains("dark")
  const style = getComputedStyle(root)
  const fb = dark ? fallback.dark : fallback.light
  const color = (name: string, value: string) => new THREE.Color(style.getPropertyValue(name).trim() || value)
  return {
    dark,
    sky: color("--scene-sky", fb.sky),
    sea: color("--scene-sea", fb.sea),
    tower: color("--scene-tower", fb.tower),
    beam: color("--scene-beam", fb.beam),
  }
}

/**
 * Mounts a WebGL canvas into `wrap` and runs `create`'s scene. The loop only runs while the
 * canvas is on screen, the tab is visible, and motion is allowed; otherwise a single frame is
 * drawn. Returns the cleanup. If WebGL is unavailable nothing is mounted.
 */
export function mountStage(wrap: HTMLElement, create: () => StageScene, options: { alpha?: boolean; mirror?: boolean } = {}) {
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !!options.alpha, powerPreference: "high-performance" })
  } catch {
    return () => {}
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
  if (options.alpha) renderer.setClearColor(0x000000, 0)

  const canvas = renderer.domElement
  canvas.setAttribute("aria-hidden", "true")
  Object.assign(canvas.style, {
    display: "block",
    width: "100%",
    height: "100%",
    opacity: "0",
    transition: "opacity 900ms ease",
  })
  wrap.appendChild(canvas)

  const stage = create()
  stage.applyPalette(readPalette())

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
  // On touch screens the scene holds still under the finger: no scroll dolly (it lags the
  // compositor-driven scroll and judders) and no pointer parallax (a scroll drag is a pointer move).
  const coarse = window.matchMedia("(pointer: coarse)")
  const input: Input = { px: 0, py: 0, scroll: 0, still: false }
  let targetX = 0
  let targetY = 0
  let height = 0
  let visible = true
  let running = false
  let shown = false
  let time = 0
  let last = 0

  function render() {
    if (!height) return
    renderer.render(stage.scene, stage.camera)
    if (!shown) {
      shown = true
      canvas.style.opacity = "1"
    }
  }

  function renderStill() {
    input.px = 0
    input.py = 0
    input.scroll = 0
    input.still = true
    stage.update(0, 0, input)
    render()
  }

  function tick(now: number) {
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 0
    last = now
    time += delta
    const k = 1 - Math.exp(-delta * 2.5)
    input.px += (targetX - input.px) * k
    input.py += (targetY - input.py) * k
    input.scroll = height && !coarse.matches ? Math.min(Math.max(window.scrollY / height, 0), 1) : 0
    input.still = false
    stage.update(time, delta, input)
    render()
  }

  function sync() {
    running = visible && !document.hidden && !reduced.matches
    last = 0
    renderer.setAnimationLoop(running ? tick : null)
    if (reduced.matches) renderStill()
  }

  function redraw() {
    if (running) return
    if (reduced.matches) renderStill()
    else render()
  }

  const resizeObserver = new ResizeObserver(([entry]) => {
    const { width, height: h } = entry.contentRect
    if (!width || !h) return
    height = h
    renderer.setSize(width, h, false)
    stage.resize(width, h)
    redraw()
  })
  resizeObserver.observe(wrap)

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    sync()
  })
  intersection.observe(wrap)

  const themeObserver = new MutationObserver(() => {
    stage.applyPalette(readPalette())
    redraw()
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

  function onPointer(event: PointerEvent) {
    if (event.pointerType !== "mouse") return
    targetX = ((event.clientX / window.innerWidth) * 2 - 1) * (options.mirror ? -1 : 1)
    targetY = -((event.clientY / window.innerHeight) * 2 - 1)
  }
  window.addEventListener("pointermove", onPointer, { passive: true })
  document.addEventListener("visibilitychange", sync)
  reduced.addEventListener("change", sync)
  sync()

  return () => {
    renderer.setAnimationLoop(null)
    resizeObserver.disconnect()
    intersection.disconnect()
    themeObserver.disconnect()
    window.removeEventListener("pointermove", onPointer)
    document.removeEventListener("visibilitychange", sync)
    reduced.removeEventListener("change", sync)
    stage.scene.traverse((object) => {
      const mesh = object as THREE.Mesh
      mesh.geometry?.dispose()
      const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []
      for (const material of materials) {
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) value.dispose()
        }
        if (material instanceof THREE.ShaderMaterial) {
          for (const uniform of Object.values(material.uniforms)) {
            if (uniform.value instanceof THREE.Texture) uniform.value.dispose()
          }
        }
        material.dispose()
      }
      if (object instanceof THREE.InstancedMesh) object.dispose()
    })
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}

/** Soft radial sprite texture used for lamp glows. */
export function glowTexture() {
  const size = 128
  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, "rgba(255,255,255,1)")
  gradient.addColorStop(0.18, "rgba(255,255,255,0.55)")
  gradient.addColorStop(0.5, "rgba(255,255,255,0.12)")
  gradient.addColorStop(1, "rgba(255,255,255,0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

/** Deterministic random so posters and live frames match. */
export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
