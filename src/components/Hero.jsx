import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* ------- LIVE WORLD: the planet keeps breathing behind the words ------- */
const LIVE_EVENTS = [
  ['🇧🇷', 'Volunteer joined in Brazil'],
  ['🇮🇳', 'Medical camp started in India'],
  ['🇦🇺', 'Tree plantation in Australia'],
  ['🇨🇦', 'Animal rescue completed in Canada'],
  ['🇳🇵', 'Education campaign launched in Nepal'],
  ['🇰🇪', 'Blood donation completed in Kenya'],
  ['🇩🇪', 'Community kitchen opened in Germany'],
  ['🇵🇭', 'Relief drive completed in Philippines'],
  ['🇳🇬', 'Clean water project funded in Nigeria'],
  ['🇯🇵', 'Coastal cleanup finished in Japan'],
]

function LiveTicker() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % LIVE_EVENTS.length), 2600)
    return () => clearInterval(t)
  }, [])

  const positions = [
    'left-[5%] top-[15%]',
    'right-[5%] top-[19%]',
    'left-[7%] bottom-[13%]',
    'right-[7%] bottom-[8%]',
  ]

  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      {positions.map((pos, slot) => {
        const [flag, text] = LIVE_EVENTS[(idx + slot * 3) % LIVE_EVENTS.length]
        return (
          <AnimatePresence key={slot} mode="wait">
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.95 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`glass absolute ${pos} flex items-center gap-2.5 rounded-full px-4 py-2 text-xs text-white/85`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-secondary/70" />
                <span className="h-2 w-2 rounded-full bg-secondary" />
              </span>
              <span>{flag}</span>
              {text}
            </motion.div>
          </AnimatePresence>
        )
      })}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 36, filter: 'blur(6px)' },
  show: (d) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero({ visible }) {
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* readability scrim — keeps the words crisp over the globe */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 42%, rgba(11,17,32,0.72) 0%, rgba(11,17,32,0.35) 55%, transparent 78%)',
        }}
        aria-hidden="true"
      />
      <LiveTicker />

      <motion.p
        variants={fadeUp} initial="hidden" animate={visible ? 'show' : 'hidden'} custom={0.2}
        className="section-label"
      >
        A movement, not an app
      </motion.p>

      <motion.h1
        variants={fadeUp} initial="hidden" animate={visible ? 'show' : 'hidden'} custom={0.45}
        className="headline relative max-w-5xl [text-shadow:0_2px_24px_rgba(0,0,0,0.65)]"
      >
        Connecting every <span className="text-gradient-blue">helping hand</span>
        <br className="hidden md:block" /> with every <span className="text-gradient">cause</span>.
      </motion.h1>

      <motion.p
        variants={fadeUp} initial="hidden" animate={visible ? 'show' : 'hidden'} custom={0.75}
        className="relative mt-8 max-w-2xl text-base text-white/75 md:text-lg [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]"
      >
        Discover trusted organizations, volunteer opportunities, campaigns, donations,
        communities and meaningful ways to create impact — anywhere in the world.
      </motion.p>

      <motion.div
        variants={fadeUp} initial="hidden" animate={visible ? 'show' : 'hidden'} custom={1.0}
        className="mt-12 flex flex-wrap items-center justify-center gap-4"
      >
        <a href="#download" className="btn-primary">Download App</a>
        <a href="#organizations" className="btn-ghost">Register Organization</a>
        <a href="#purpose" className="group inline-flex items-center gap-2 px-4 py-4 text-sm font-medium text-white/60 transition hover:text-white">
          Explore the Movement
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
      >
        <div className="flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em]">
          Scroll to begin
          <span className="block h-10 w-px overflow-hidden bg-white/10">
            <span className="block h-4 w-px animate-[float_1.6s_ease-in-out_infinite] bg-blue-300" />
          </span>
        </div>
      </motion.div>
    </section>
  )
}
