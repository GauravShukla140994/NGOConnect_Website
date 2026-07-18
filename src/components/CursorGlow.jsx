import { useEffect, useRef } from 'react'

/* The visitor's cursor is "the one glowing particle" from the intro:
   a soft light halo + a delicate trail of sparks that scatter and fade. */

const SPARK_COLORS = ['96,165,250', '134,239,172', '253,186,116', '196,181,253']
const MAX_SPARKS = 110

export default function CursorGlow() {
  const glowRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return // touch device — skip

    const glow = glowRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(devicePixelRatio, 1.5)

    let W, H
    const resize = () => {
      W = canvas.width = innerWidth * DPR
      H = canvas.height = innerHeight * DPR
    }
    resize()
    addEventListener('resize', resize)

    let tx = innerWidth / 2, ty = innerHeight / 2
    let x = tx, y = ty
    let lastX = tx, lastY = ty
    let raf
    const sparks = []

    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
      glow.style.opacity = '1'

      /* spawn sparks based on distance travelled — faster mouse, more sparks */
      const dist = Math.hypot(tx - lastX, ty - lastY)
      if (dist > 9 && sparks.length < MAX_SPARKS) {
        const n = Math.min(3, Math.floor(dist / 14) + 1)
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2
          const sp = 0.2 + Math.random() * 0.9
          sparks.push({
            x: tx * DPR, y: ty * DPR,
            vx: Math.cos(a) * sp + (tx - lastX) * 0.045,
            vy: Math.sin(a) * sp + (ty - lastY) * 0.045 - 0.25,
            life: 1,
            decay: 0.012 + Math.random() * 0.02,
            r: (0.9 + Math.random() * 1.9) * DPR,
            c: SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0],
            tw: 4 + Math.random() * 7, // twinkle speed
          })
        }
        lastX = tx
        lastY = ty
      }
    }
    const leave = () => { glow.style.opacity = '0' }

    let t = 0
    const tick = () => {
      raf = requestAnimationFrame(tick)
      t += 0.016

      /* halo follows with a soft lag */
      x += (tx - x) * 0.09
      y += (ty - y) * 0.09
      glow.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`

      /* sparks */
      if (sparks.length === 0) {
        if (W) ctx.clearRect(0, 0, W, H)
        return
      }
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx * DPR
        s.y += s.vy * DPR
        s.vx *= 0.985
        s.vy *= 0.985
        s.life -= s.decay
        if (s.life <= 0) { sparks.splice(i, 1); continue }

        const twinkle = 0.75 + 0.25 * Math.sin(t * s.tw)
        const alpha = s.life * s.life * twinkle

        /* soft outer glow */
        ctx.globalAlpha = alpha * 0.35
        ctx.fillStyle = `rgb(${s.c})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2)
        ctx.fill()

        /* bright core */
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgb(${s.c})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }
    tick()

    addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', resize)
      removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <>
      {/* soft ambient halo — light, airy */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] h-[600px] w-[600px] rounded-full opacity-0 transition-opacity duration-700 will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(191,219,254,0.10) 0%, rgba(96,165,250,0.07) 30%, rgba(124,58,237,0.04) 55%, transparent 72%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* spark trail */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[81] h-full w-full"
      />
    </>
  )
}
