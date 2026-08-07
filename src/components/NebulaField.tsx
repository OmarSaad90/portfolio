'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import styles from './NebulaField.module.css'

// Full-screen triangle, no buffers: relies on gl_VertexID (WebGL2 only).
const VERTEX_SRC = `#version 300 es
void main() {
  vec2 pos[3] = vec2[3](vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
  gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0);
}
`

// Two soft fbm color fields drifting independently, one turquoise (--color-primary)
// one amber (--color-accent), converted from their OKLCH tokens to linear-ish sRGB
// so the nebula reads as the same brand colors, not a new hue. Kept additive and
// low-alpha throughout: this is ambience behind body text, never allowed to move
// contrast off the measured baselines in DESIGN.md.
const FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uParallax;
uniform float uScrollOffset;
uniform float uAlpha;

out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 aspectUv = vec2(uv.x * (uResolution.x / uResolution.y), uv.y);

  vec2 drift = vec2(uTime * 0.006, uScrollOffset);
  vec2 p1 = aspectUv * 1.6 + drift + uParallax * 0.4;
  vec2 p2 = aspectUv * 1.9 - drift * 1.3 - uParallax * 0.3 + 4.7;

  float n1 = fbm(p1);
  float n2 = fbm(p2);

  vec3 turquoise = vec3(0.087, 0.735, 0.736);
  vec3 amber = vec3(0.865, 0.737, 0.101);

  float m1 = smoothstep(0.55, 0.86, n1);
  float m2 = smoothstep(0.6, 0.88, n2);

  vec3 color = turquoise * m1 + amber * m2;
  float alpha = (m1 * 0.5 + m2 * 0.4) * uAlpha;

  fragColor = vec4(color * alpha, alpha);
}
`

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

/**
 * A faint, slow-drifting nebula wash sitting beneath the star canvas. Pure
 * ambience: on-brand turquoise/amber color fields via fbm noise, nudged by
 * cursor and scroll for a sense of depth. WebGL2 only, additive and capped
 * low-alpha so it never touches text contrast; absent entirely (no canvas
 * mounted, no cost paid) when WebGL2 is unsupported or reduced motion is on
 * — the starfield underneath already stands on its own as the fallback.
 */
export default function NebulaField() {
  const reduceMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reduceMotion) return
    const canvas = canvasRef.current
    if (!canvas) return

    let rafId = 0
    // Always assigned via window.requestIdleCallback/window.setTimeout below (never
    // the ambient Node setTimeout that @types/node would otherwise resolve to), so
    // this is a plain number in both branches.
    let idleId = 0
    let cleanup = () => {}

    function init() {
      if (!canvas) return
      const glCtx = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false })
      if (!glCtx) return
      // Reassigned to a fresh non-null binding: TS doesn't retain the narrowing
      // above across the nested function declarations below.
      const gl = glCtx

      const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
      if (!vs || !fs) return

      const program = gl.createProgram()
      if (!program) return
      gl.attachShader(program, vs)
      gl.attachShader(program, fs)
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

      gl.useProgram(program)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      const uResolution = gl.getUniformLocation(program, 'uResolution')
      const uTime = gl.getUniformLocation(program, 'uTime')
      const uParallax = gl.getUniformLocation(program, 'uParallax')
      const uScrollOffset = gl.getUniformLocation(program, 'uScrollOffset')
      const uAlpha = gl.getUniformLocation(program, 'uAlpha')

      let width = 0
      let height = 0
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

      // Smoothed (lerped) pointer/scroll targets, updated per-frame rather than
      // per-event: cheap, and avoids fighting the star canvas's own spring loop.
      let targetPx = 0
      let targetPy = 0
      let px = 0
      let py = 0
      let targetScroll = 0
      let scroll = 0

      function resize() {
        if (!canvas || !gl) return
        width = window.innerWidth
        height = window.innerHeight
        canvas.width = width * dpr
        canvas.height = height * dpr
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        gl.viewport(0, 0, canvas.width, canvas.height)
      }

      function onPointerMove(e: PointerEvent) {
        targetPx = (e.clientX / window.innerWidth - 0.5) * 2
        targetPy = (e.clientY / window.innerHeight - 0.5) * 2
      }

      function onScroll() {
        targetScroll = window.scrollY * 0.00025
      }

      resize()
      window.addEventListener('resize', resize)
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('scroll', onScroll, { passive: true })

      const start = performance.now()

      function frame(t: number) {
        px += (targetPx - px) * 0.04
        py += (targetPy - py) * 0.04
        scroll += (targetScroll - scroll) * 0.04

        gl.uniform2f(uResolution, canvas!.width, canvas!.height)
        gl.uniform1f(uTime, (t - start) / 1000)
        gl.uniform2f(uParallax, px, -py)
        gl.uniform1f(uScrollOffset, scroll)
        gl.uniform1f(uAlpha, 0.13)

        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        rafId = requestAnimationFrame(frame)
      }

      function handleVisibility() {
        if (document.hidden) {
          cancelAnimationFrame(rafId)
        } else {
          rafId = requestAnimationFrame(frame)
        }
      }

      function onContextLost(e: Event) {
        e.preventDefault()
        cancelAnimationFrame(rafId)
      }

      canvas.addEventListener('webglcontextlost', onContextLost)
      document.addEventListener('visibilitychange', handleVisibility)
      rafId = requestAnimationFrame(frame)

      cleanup = () => {
        cancelAnimationFrame(rafId)
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('visibilitychange', handleVisibility)
        canvas.removeEventListener('webglcontextlost', onContextLost)
      }
    }

    // Defer context creation off the critical path so it never competes with
    // first paint/LCP; the star canvas alone is already a complete backdrop.
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (win.requestIdleCallback) {
      idleId = win.requestIdleCallback(init, { timeout: 2000 })
    } else {
      idleId = window.setTimeout(init, 200)
    }

    return () => {
      if (win.cancelIdleCallback) win.cancelIdleCallback(idleId)
      else window.clearTimeout(idleId)
      cleanup()
    }
  }, [reduceMotion])

  if (reduceMotion) return null

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
