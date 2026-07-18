import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* --------------------------------------------------------------- */
/* THE FINAL RIPPLE — the first particle returns and lights the map */
/* --------------------------------------------------------------- */

const COLORS = ['#60a5fa', '#22c55e', '#f97316', '#a78bfa']

export default function FinalRipple() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(devicePixelRatio, 1.5)
    let W, H, dots
    let raf

    function setup() {
      W = canvas.width = canvas.offsetWidth * DPR
      H = canvas.height = canvas.offsetHeight * DPR
      dots = []
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 3400)
      let seed = 42
      const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
      for (let i = 0; i < count; i++) {
        /* clustered like settlements — a few dense bands */
        const band = Math.floor(rand() * 5)
        dots.push({
          x: rand() * W,
          y: (band / 5) * H + rand() * (H / 5),
          r: (0.8 + rand() * 1.6) * DPR,
          c: COLORS[Math.floor(rand() * COLORS.length)],
          d: rand(), // ignition threshold jitter
        })
      }
    }
    setup()

    /* draw only while on screen */
    let onScreen = false
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting })
    io.observe(canvas)

    const origin = () => ({ x: W * 0.18, y: H * 0.55 })
    const maxDist = () => Math.hypot(W, H)

    let lastDrawn = -1
    function draw() {
      raf = requestAnimationFrame(draw)
      if (!onScreen) return
      const p = progressRef.current
      if (Math.abs(p - lastDrawn) < 0.0004) return // nothing changed — skip frame
      lastDrawn = p

      ctx.clearRect(0, 0, W, H)

      const o = origin()
      const radius = p * maxDist() * 1.15

      /* dots — glow faked with a cheap halo circle (shadowBlur is a GPU killer) */
      for (const d of dots) {
        const dist = Math.hypot(d.x - o.x, d.y - o.y)
        const lit = dist < radius - d.d * 90 * DPR
        const edge = lit && Math.abs(dist - radius) < 90 * DPR

        if (lit) {
          if (edge) {
            ctx.globalAlpha = 0.25
            ctx.fillStyle = d.c
            ctx.beginPath()
            ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.globalAlpha = 0.9
          ctx.fillStyle = d.c
        } else {
          ctx.globalAlpha = 0.18
          ctx.fillStyle = '#334155'
        }
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r * (lit ? 1.4 : 1), 0, Math.PI * 2)
        ctx.fill()
      }

      /* the ripple front */
      if (p > 0.01 && p < 0.99) {
        ctx.globalAlpha = 0.35 * (1 - p)
        ctx.strokeStyle = '#60a5fa'
        ctx.lineWidth = 2 * DPR
        ctx.beginPath()
        ctx.arc(o.x, o.y, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      /* the returning particle rides the frontier */
      if (p > 0.01 && p < 0.97) {
        const ang = -0.6 + p * 1.6
        const px = o.x + Math.cos(ang) * radius
        const py = o.y + Math.sin(ang) * radius
        const g = ctx.createRadialGradient(px, py, 0, px, py, 26 * DPR)
        g.addColorStop(0, 'rgba(255,255,255,0.95)')
        g.addColorStop(0.3, 'rgba(147,197,253,0.8)')
        g.addColorStop(1, 'rgba(37,99,235,0)')
        ctx.globalAlpha = 1
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, 26 * DPR, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }
    draw()

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 70%',
      end: 'bottom 90%',
      scrub: 0.6,
      onUpdate: (self) => { progressRef.current = self.progress },
    })

    const onResize = () => { setup(); lastDrawn = -1 }
    addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      removeEventListener('resize', onResize)
      st.kill()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative">
      {/* the world lights up */}
      <div className="relative flex min-h-[130vh] flex-col items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy via-transparent to-navy" />

        <div className="relative z-10 px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-30%' }}
            transition={{ duration: 1.2 }}
            className="section-label"
          >
            Remember the first light?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30%' }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="headline"
          >
            One person.
            <br /> One organization.
            <br /> One connection.
            <br />
            <span className="text-gradient">One better world.</span>
          </motion.h2>
        </div>
      </div>

      {/* final call */}
      <div className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="headline max-w-4xl"
        >
          Join the world's largest
          <br />
          <span className="text-gradient-blue">social impact network</span>.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#download" className="btn-primary">Download App</a>
          <a href="#organizations" className="btn-ghost">Register Organization</a>
          <a href="#purpose" className="btn-ghost !border-secondary/40 hover:!border-secondary">
            Become a Volunteer
          </a>
        </motion.div>
      </div>
    </section>
  )
}
