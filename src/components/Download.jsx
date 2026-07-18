import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* deterministic decorative QR pattern (replace with a real QR at launch) */
function QrPattern() {
  const cells = []
  let seed = 7
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) {
      const finder =
        (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)
      const on = finder
        ? (x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && y > 1 && y < 5) ||
           (x > 15 && x < 19 && y > 1 && y < 5) || (x > 1 && x < 5 && y > 15 && y < 19))
        : rand() > 0.52
      if (on) cells.push(<rect key={`${x}-${y}`} x={x * 10} y={y * 10} width="9" height="9" rx="2" />)
    }
  return (
    <svg viewBox="0 0 210 210" className="h-full w-full fill-navy">
      {cells}
    </svg>
  )
}

const PHONE_A = [
  { emoji: '🌍', title: 'Explore NGOs', sub: '62,000+ verified organizations' },
  { emoji: '📅', title: 'Join Events', sub: 'Drives, camps & campaigns near you' },
  { emoji: '💙', title: 'Donate Securely', sub: 'Instant receipts, total transparency' },
]
const PHONE_B = [
  { emoji: '🏅', title: 'My Impact', sub: '128 hours · 6 badges · 3 NGOs' },
  { emoji: '👥', title: 'Community', sub: 'Polls, chats & announcements' },
  { emoji: '📈', title: 'Analytics', sub: 'For organizations that grow' },
]

function AutoScreen({ items, offset = 0 }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 2800 + offset)
    return () => clearInterval(t)
  }, [items.length, offset])
  const s = items[i]
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={s.title}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-3"
        >
          <span className="block text-5xl">{s.emoji}</span>
          <p className="font-display text-base font-bold">{s.title}</p>
          <p className="px-6 text-[10px] text-white/50">{s.sub}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 flex gap-1.5">
        {items.map((_, d) => (
          <span key={d} className={`h-1 rounded-full transition-all ${d === i ? 'w-5 bg-primary' : 'w-1.5 bg-white/20'}`} />
        ))}
      </div>
    </div>
  )
}

function StoreButton({ store }) {
  const apple = store === 'apple'
  return (
    <a
      href="#"
      className="glass flex items-center gap-3 rounded-2xl px-6 py-3.5 transition-all duration-300 hover:scale-[1.04] hover:border-white/40 hover:bg-white/10"
    >
      <span className="flex h-8 w-8 items-center justify-center">
        {apple ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden="true">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.94-.19 1.84-.86 3.19-.72 1.61.13 2.83.77 3.63 1.93-3.32 1.99-2.79 6.36.55 7.71-.61 1.34-1.4 2.67-2.45 3.25zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path fill="#34d399" d="M3.6 1.8 13.7 12 3.6 22.2c-.4-.2-.6-.6-.6-1.2V3c0-.6.2-1 .6-1.2z" />
            <path fill="#60a5fa" d="M17 8.7 5.2 2l8.5 10L17 8.7z" />
            <path fill="#f97316" d="M17 15.3 13.7 12l-8.5 10L17 15.3z" />
            <path fill="#fbbf24" d="M17 8.7 13.7 12l3.3 3.3 3.2-1.8c1-.6 1-1.6 0-2.2L17 8.7z" />
          </svg>
        )}
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] uppercase tracking-wider text-white/50">
          {apple ? 'Download on the' : 'Get it on'}
        </span>
        <span className="font-display text-base font-bold">
          {apple ? 'App Store' : 'Google Play'}
        </span>
      </span>
    </a>
  )
}

export default function Download() {
  return (
    <section id="download" className="relative overflow-hidden py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <p className="section-label">Get the app</p>
          <h2 className="headline">
            Carry the <span className="text-gradient-blue">movement</span>
            <br /> in your pocket.
          </h2>
        </div>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* floating phones */}
          <div className="relative flex justify-center gap-4 sm:gap-6" style={{ perspective: 1200 }}>
            <motion.div
              initial={{ opacity: 0, y: 100, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: -6 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="animate-float"
            >
              <div className="phone-frame relative h-[350px] w-[168px] overflow-hidden p-4 pt-10 sm:h-[440px] sm:w-[212px]">
                <div className="phone-notch" />
                <AutoScreen items={PHONE_A} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.1]" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 100, rotate: 6 }}
              whileInView={{ opacity: 1, y: 24, rotate: 6 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="animate-float [animation-delay:1.2s]"
            >
              <div className="phone-frame relative h-[350px] w-[168px] overflow-hidden p-4 pt-10 sm:h-[440px] sm:w-[212px]">
                <div className="phone-notch" />
                <AutoScreen items={PHONE_B} offset={400} />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.1]" />
              </div>
            </motion.div>

            <div className="absolute -bottom-10 left-1/2 h-12 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          </div>

          {/* stores + QR */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-10 lg:items-start"
          >
            <p className="max-w-md text-center text-lg text-white/60 lg:text-left">
              Free forever for individuals. Available on iOS and Android —
              the movement fits in your hand.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <StoreButton store="apple" />
              <StoreButton store="google" />
            </div>

            <div className="glass flex items-center gap-6 rounded-3xl p-6">
              <div className="h-28 w-28 rounded-2xl bg-white p-2.5">
                <QrPattern />
              </div>
              <div>
                <p className="font-display font-bold">Scan to download</p>
                <p className="mt-1 max-w-[200px] text-sm text-white/50">
                  Point your camera — the app store opens on your device.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
