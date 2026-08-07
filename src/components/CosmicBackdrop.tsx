'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import styles from './CosmicBackdrop.module.css'

const PARALLAX_RANGE = 16
const STAR_RGB = '238, 235, 226' // matches --color-ink
const DEPTH_FACTORS = [0.04, 0.1, 0.2] as const
const FIELD_HEIGHT_MULTIPLIER = 2.4
const STAR_DENSITY = 1 / 7000
const MAX_STARS = 180

interface Star {
  x: number
  y: number
  r: number
  baseAlpha: number
  twinkleSpeed: number
  phase: number
  depth: 0 | 1 | 2
}

interface ShootingStar {
  startX: number
  startY: number
  dx: number
  dy: number
  startElapsed: number
  duration: number
  travelDistance: number
  length: number
}

// 5–10s between appearances.
function randomSpawnGap() {
  return 5 + Math.random() * 5
}

function buildStars(width: number, fieldHeight: number): Star[] {
  const count = Math.min(MAX_STARS, Math.round(width * fieldHeight * STAR_DENSITY))
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    const depth = (i % 3) as 0 | 1 | 2
    stars.push({
      x: Math.random() * width,
      y: Math.random() * fieldHeight,
      r: 0.5 + Math.random() * 1.3 + depth * 0.3,
      baseAlpha: 0.12 + Math.random() * 0.35 + depth * 0.08,
      twinkleSpeed: 0.15 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      depth,
    })
  }
  return stars
}

export default function CosmicBackdrop() {
  const reduceMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const springX = useSpring(px, { stiffness: 40, damping: 20, mass: 1 })
  const springY = useSpring(py, { stiffness: 40, damping: 20, mass: 1 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    // Reassigned to fresh non-null bindings: TS doesn't retain the narrowing
    // above across the nested function declarations below.
    const canvasEl = canvas
    const context = ctx

    let stars: Star[] = []
    let width = 0
    let height = 0
    let fieldHeight = 0
    let rafId = 0
    let shootingStar: ShootingStar | null = null
    let nextSpawnAt = randomSpawnGap()

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      fieldHeight = height * FIELD_HEIGHT_MULTIPLIER
      canvasEl.width = width * dpr
      canvasEl.height = height * dpr
      canvasEl.style.width = `${width}px`
      canvasEl.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = buildStars(width, fieldHeight)
      shootingStar = null
    }

    // Rare diagonal streak crossing the upper sky, spawned on its own
    // schedule (see randomSpawnGap). Drawn in plain viewport space, not
    // tied to the depth-parallax field, since it's a one-off transient
    // rather than part of the ambient star layer.
    function maybeSpawnShootingStar(elapsed: number) {
      if (shootingStar || elapsed < nextSpawnAt) return
      const angle = (18 + Math.random() * 22) * (Math.PI / 180)
      shootingStar = {
        startX: width * (0.05 + Math.random() * 0.5),
        startY: height * (0.05 + Math.random() * 0.3),
        dx: Math.cos(angle),
        dy: Math.sin(angle),
        startElapsed: elapsed,
        duration: 0.8 + Math.random() * 0.4,
        travelDistance: width * (0.32 + Math.random() * 0.22),
        length: 90 + Math.random() * 70,
      }
    }

    function drawShootingStar(elapsed: number) {
      if (!shootingStar) return
      const s = shootingStar
      const t = (elapsed - s.startElapsed) / s.duration
      if (t >= 1) {
        shootingStar = null
        nextSpawnAt = elapsed + randomSpawnGap()
        return
      }

      // Quick fade in, brief hold, longer fade out, so it reads as a
      // streak rather than an abrupt on/off blink.
      const envelope = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1
      const headX = s.startX + s.dx * s.travelDistance * t
      const headY = s.startY + s.dy * s.travelDistance * t
      const tailX = headX - s.dx * s.length
      const tailY = headY - s.dy * s.length

      const gradient = context.createLinearGradient(tailX, tailY, headX, headY)
      gradient.addColorStop(0, `rgba(${STAR_RGB}, 0)`)
      gradient.addColorStop(1, `rgba(${STAR_RGB}, ${0.85 * envelope})`)

      context.beginPath()
      context.strokeStyle = gradient
      context.lineWidth = 1.6
      context.lineCap = 'round'
      context.moveTo(tailX, tailY)
      context.lineTo(headX, headY)
      context.stroke()

      context.beginPath()
      context.fillStyle = `rgba(${STAR_RGB}, ${envelope})`
      context.arc(headX, headY, 1.4, 0, Math.PI * 2)
      context.fill()
    }

    function drawStatic() {
      context.clearRect(0, 0, width, height)
      for (const star of stars) {
        const y = star.y % height
        context.beginPath()
        context.fillStyle = `rgba(${STAR_RGB}, ${star.baseAlpha})`
        context.arc(star.x, y, star.r, 0, Math.PI * 2)
        context.fill()
      }
    }

    resize()

    if (reduceMotion) {
      drawStatic()
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }

    const start = performance.now()

    function frame(t: number) {
      const elapsed = (t - start) / 1000
      const scrollY = window.scrollY
      context.clearRect(0, 0, width, height)

      for (const star of stars) {
        const offset = scrollY * DEPTH_FACTORS[star.depth]
        const y = (((star.y - offset) % fieldHeight) + fieldHeight) % fieldHeight
        if (y > height + 4) continue
        const twinkle = Math.sin(elapsed * star.twinkleSpeed + star.phase) * 0.15
        const alpha = Math.max(0, Math.min(1, star.baseAlpha + twinkle))
        context.beginPath()
        context.fillStyle = `rgba(${STAR_RGB}, ${alpha})`
        context.arc(star.x, y, star.r, 0, Math.PI * 2)
        context.fill()
      }

      maybeSpawnShootingStar(elapsed)
      drawShootingStar(elapsed)

      rafId = requestAnimationFrame(frame)
    }

    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(rafId)
      } else {
        rafId = requestAnimationFrame(frame)
      }
    }

    rafId = requestAnimationFrame(frame)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [reduceMotion])

  useEffect(() => {
    if (reduceMotion) return

    function onPointerMove(e: PointerEvent) {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      px.set(((e.clientX - cx) / cx) * PARALLAX_RANGE)
      py.set(((e.clientY - cy) / cy) * PARALLAX_RANGE)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [reduceMotion, px, py])

  return (
    <motion.canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
      style={reduceMotion ? undefined : { x: springX, y: springY }}
    />
  )
}
