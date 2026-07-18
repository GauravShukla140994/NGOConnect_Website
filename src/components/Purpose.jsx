import { useRef } from 'react'
import { motion } from 'framer-motion'

const CARDS = [
  { emoji: '🤝', title: 'Volunteer', desc: 'Turn your hours into someone’s turning point.', glow: 'from-blue-500/30' },
  { emoji: '🏛️', title: 'Organization', desc: 'Register, verify, and reach the world.', glow: 'from-violet-500/30' },
  { emoji: '💙', title: 'Donate', desc: 'Give securely to causes you can trust.', glow: 'from-emerald-500/30' },
  { emoji: '🌐', title: 'Partner', desc: 'CSR teams and institutions, amplified.', glow: 'from-orange-500/30' },
  { emoji: '👥', title: 'Community', desc: 'Belong to people who show up.', glow: 'from-blue-500/30' },
  { emoji: '📣', title: 'Campaign', desc: 'Start movements that travel far.', glow: 'from-violet-500/30' },
  { emoji: '📅', title: 'Events', desc: 'Real gatherings, real ground, real change.', glow: 'from-emerald-500/30' },
  { emoji: '🎓', title: 'Education', desc: 'Teach one child, change one future.', glow: 'from-orange-500/30' },
]

function TiltCard({ card, i }) {
  const ref = useRef(null)

  function onMove(e) {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(10px)`
  }
  function onLeave() {
    ref.current.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, delay: (i % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 800 }}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="tilt-card glass group relative cursor-pointer overflow-hidden rounded-3xl p-7 hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.35)]"
      >
        <div className={`pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-gradient-to-b ${card.glow} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />
        <span className="mb-5 block text-4xl transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">{card.emoji}</span>
        <h3 className="font-display text-lg font-bold">{card.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{card.desc}</p>
        <span className="mt-5 inline-block text-xs font-semibold text-blue-300 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
          Begin here →
        </span>
      </div>
    </motion.div>
  )
}

export default function Purpose() {
  return (
    <section id="purpose" className="relative mx-auto max-w-7xl px-6 py-36">
      <div className="mb-16 text-center">
        <p className="section-label">Discover your purpose</p>
        <h2 className="headline">
          How will <span className="text-gradient-blue">you</span> change the world?
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c, i) => (
          <TiltCard key={c.title} card={c} i={i} />
        ))}
      </div>
    </section>
  )
}
