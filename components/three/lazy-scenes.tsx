"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const LighthouseScene = dynamic(() => import("./lighthouse-scene").then((m) => m.LighthouseScene), { ssr: false })
const FresnelLens = dynamic(() => import("./fresnel-lens").then((m) => m.FresnelLens), { ssr: false })

/** Poster stills show until the live scene has drawn its first frame over them. */
export function LazyLighthouse({ className, mirror = false }: { className?: string; mirror?: boolean }) {
  const poster = cn("object-cover object-[70%_50%] md:object-center", mirror && "-scale-x-100")
  return (
    <div aria-hidden className={cn("relative overflow-hidden", className)}>
      <Image src="/scene/lighthouse-light.webp" alt="" fill sizes="100vw" className={cn(poster, "dark:hidden")} />
      <Image
        src="/scene/lighthouse-dark.webp"
        alt=""
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className={cn(poster, "hidden dark:block")}
      />
      <LighthouseScene mirror={mirror} className={cn("absolute inset-0", mirror && "-scale-x-100")} />
    </div>
  )
}

/** Mounts the lens only near the viewport so its WebGL context never competes with the hero. */
export function LazyLens({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} aria-hidden className={cn("relative", className)}>
      <div
        className="absolute inset-[22%] rounded-full opacity-50 blur-2xl"
        style={{ background: "radial-gradient(closest-side, var(--scene-beam, #f2b441), transparent)" }}
      />
      {near ? <FresnelLens className="absolute inset-0" /> : null}
    </div>
  )
}
