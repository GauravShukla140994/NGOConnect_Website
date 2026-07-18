import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ---------------- shared animation helpers ---------------- */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
}
const pop = {
  hidden: { opacity: 0, y: 14, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

function Row({ children, className = '' }) {
  return <div className={`flex items-center gap-2.5 ${className}`}>{children}</div>
}

/* counts 0 → value when the screen appears */
function CountUp({ value, format, duration = 1200, className = '' }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration)
      setN(Math.floor(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])
  return <span className={className}>{format ? format(n) : n.toLocaleString()}</span>
}

/* endlessly typing search text */
function TypingText({ phrases }) {
  const [txt, setTxt] = useState('')
  useEffect(() => {
    let phrase = 0, i = 0, deleting = false, timer
    const type = () => {
      const cur = phrases[phrase]
      if (!deleting) {
        i++
        if (i === cur.length) { deleting = true; timer = setTimeout(type, 1400); setTxt(cur.slice(0, i)); return }
      } else {
        i--
        if (i === 0) { deleting = false; phrase = (phrase + 1) % phrases.length }
      }
      setTxt(cur.slice(0, i))
      timer = setTimeout(type, deleting ? 35 : 75)
    }
    timer = setTimeout(type, 500)
    return () => clearTimeout(timer)
  }, [phrases])
  return (
    <span>
      {txt}
      <span className="animate-pulse text-blue-300">|</span>
    </span>
  )
}

function TypingDots() {
  return (
    <div className="flex gap-1 px-1 py-0.5">
      {[0, 1, 2].map((d) => (
        <motion.span
          key={d}
          animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.18 }}
          className="h-1 w-1 rounded-full bg-white/70"
        />
      ))}
    </div>
  )
}

/* ---------------- animated in-phone journeys ---------------- */

function OrgCard({ emoji, name, meta, color }) {
  return (
    <motion.div variants={pop} className="glass flex items-center gap-3 rounded-2xl p-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${color}`}>{emoji}</div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-white">{name}</p>
        <p className="truncate text-[9px] text-white/50">{meta}</p>
      </div>
      <motion.span
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className="ml-auto rounded-full bg-primary/20 px-2.5 py-1 text-[8px] font-semibold text-blue-300"
      >
        View
      </motion.span>
    </motion.div>
  )
}

function ScreenDiscover() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
      <motion.p variants={pop} className="text-[13px] font-bold">Discover</motion.p>
      <motion.div variants={pop} className="glass flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[10px] text-white/70">
        🔍 <TypingText phrases={['tree plantation…', 'blood donation…', 'teach children…', 'animal rescue…']} />
      </motion.div>
      <motion.div variants={pop}>
        <Row className="flex-wrap gap-1.5">
          {['Education', 'Health', 'Climate', 'Animals'].map((t, i) => (
            <motion.span
              key={t}
              animate={i === 0 ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`rounded-full px-2.5 py-1 text-[8px] font-medium ${i === 0 ? 'bg-primary text-white' : 'bg-white/10 text-white/60'}`}
            >
              {t}
            </motion.span>
          ))}
        </Row>
      </motion.div>
      <OrgCard emoji="🌱" name="GreenRoots Foundation" meta="Verified · 2.4k volunteers" color="bg-secondary/20" />
      <OrgCard emoji="📚" name="Shiksha For All" meta="Verified · Delhi, India" color="bg-primary/20" />
      <OrgCard emoji="🐾" name="Paws & Care Trust" meta="Verified · 180 rescues" color="bg-accent/20" />
    </motion.div>
  )
}

function ScreenProfile() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
      <motion.div variants={pop} className="relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/50 to-violet/40">
        <motion.div
          animate={{ x: ['-100%', '160%'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />
      </motion.div>
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.35 }}
        className="-mt-8 ml-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/30 text-xl ring-4 ring-navy"
      >
        🌱
      </motion.div>
      <motion.p variants={pop} className="text-[13px] font-bold">
        GreenRoots Foundation{' '}
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[9px] text-blue-300"
        >
          ✔ Verified
        </motion.span>
      </motion.p>
      <motion.p variants={pop} className="text-[9px] leading-relaxed text-white/55">
        Restoring urban forests with 2,400+ volunteers across 12 cities.
      </motion.p>
      <motion.div variants={pop}>
        <Row>
          <motion.span
            animate={{ boxShadow: ['0 0 0px rgba(37,99,235,0)', '0 0 16px rgba(37,99,235,0.6)', '0 0 0px rgba(37,99,235,0)'] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="flex-1 rounded-full bg-primary py-2 text-center text-[9px] font-bold"
          >
            Join Organization
          </motion.span>
          <span className="flex-1 rounded-full border border-white/20 py-2 text-center text-[9px] font-semibold text-white/80">Follow</span>
        </Row>
      </motion.div>
      <motion.div variants={pop} className="grid grid-cols-3 gap-2 text-center">
        {[[2400, 'Volunteers', (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v)], [86, 'Projects', null], [12, 'Cities', null]].map(([v, l, f]) => (
          <div key={l} className="glass rounded-xl py-2">
            <p className="text-[11px] font-bold text-blue-300">
              <CountUp value={v} format={f} />
            </p>
            <p className="text-[7px] uppercase tracking-wider text-white/40">{l}</p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function ScreenCampaign() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
      <motion.p variants={pop} className="text-[13px] font-bold">Tree Plantation Drive</motion.p>
      <motion.div variants={pop} className="flex h-20 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/30 to-primary/20 text-3xl">
        <motion.span animate={{ y: [0, -5, 0], rotate: [0, 4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          🌳
        </motion.span>
      </motion.div>
      <motion.div variants={pop}>
        <Row className="text-[9px] text-white/60">📍 Cubbon Park · 📅 Sunday 7 AM · ⏱ 4 hrs</Row>
      </motion.div>
      <motion.div variants={pop}>
        <Row className="justify-between text-[8px] text-white/50">
          <span><CountUp value={134} duration={1600} /> of 150 volunteers</span>
          <span><CountUp value={89} duration={1600} />%</span>
        </Row>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '89%' }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-secondary to-emerald-300"
          />
        </div>
      </motion.div>
      <motion.span
        variants={pop}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="block rounded-full bg-secondary py-2.5 text-center text-[10px] font-bold text-navy"
      >
        Join Campaign →
      </motion.span>
      <motion.p variants={pop} className="text-center text-[8px] text-white/40">
        You'll earn 4 impact hours + Green badge
      </motion.p>
    </motion.div>
  )
}

function ScreenDonate() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
      <motion.p variants={pop} className="text-[13px] font-bold">Donate</motion.p>
      <motion.p variants={pop} className="text-[9px] text-white/55">Clean Water for 200 Villages</motion.p>
      <motion.div variants={pop} className="grid grid-cols-3 gap-2">
        {['₹500', '₹1,000', '₹2,500'].map((a, i) => (
          <motion.span
            key={a}
            animate={i === 1 ? { boxShadow: ['0 0 0px rgba(147,197,253,0)', '0 0 14px rgba(147,197,253,0.55)', '0 0 0px rgba(147,197,253,0)'] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={`rounded-xl py-2.5 text-center text-[10px] font-bold ${i === 1 ? 'bg-primary text-white ring-2 ring-blue-300/50' : 'glass text-white/70'}`}
          >
            {a}
          </motion.span>
        ))}
      </motion.div>
      <motion.div variants={pop}>
        <Row className="glass justify-between rounded-xl px-3 py-2.5 text-[9px]">
          <span className="text-white/60">UPI · Instant</span>
          <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity }} className="text-blue-300">
            ▸
          </motion.span>
        </Row>
      </motion.div>
      <motion.span variants={pop} className="relative block overflow-hidden rounded-full bg-primary py-2.5 text-center text-[10px] font-bold">
        Donate ₹1,000
        <motion.span
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      </motion.span>
      <motion.div variants={pop}>
        <Row className="justify-center gap-1.5 text-[8px] text-white/40">🔒 Secure · 80G receipt in seconds</Row>
      </motion.div>
    </motion.div>
  )
}

function ScreenCommunity() {
  const bubble = (delay) => ({
    hidden: { opacity: 0, y: 12, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, delay, ease: 'easeOut' } },
  })
  return (
    <motion.div initial="hidden" animate="show" className="space-y-2.5">
      <motion.p variants={bubble(0)} className="text-[13px] font-bold">Community</motion.p>
      <motion.div variants={bubble(0.3)} className="glass max-w-[85%] rounded-2xl rounded-tl-sm p-2.5 text-[9px] text-white/80">
        Sunday's drive was incredible — 500 saplings! 🌱
      </motion.div>
      <motion.div variants={bubble(0.9)} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/80 p-2.5 text-[9px]">
        Count me in for the next one! When is it?
      </motion.div>
      <motion.div variants={bubble(1.5)} className="glass max-w-[85%] rounded-2xl rounded-tl-sm p-2.5 text-[9px] text-white/80">
        📢 Announcement: Next drive — Feb 14, riverside stretch.
      </motion.div>
      <motion.div variants={bubble(2.0)} className="glass w-fit rounded-2xl rounded-tl-sm px-2 py-1.5">
        <TypingDots />
      </motion.div>
      <motion.div variants={bubble(2.4)} className="glass rounded-2xl p-2.5">
        <p className="text-[8px] font-semibold text-white/70">📊 Poll · Which cause next?</p>
        {[['Beach cleanup', 62], ['School kits', 38]].map(([l, p], i) => (
          <div key={l} className="mt-1.5">
            <Row className="justify-between text-[8px] text-white/50">
              <span>{l}</span>
              <span><CountUp value={p} duration={1200} />%</span>
            </Row>
            <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${p}%` }}
                transition={{ duration: 1.1, delay: 2.6 + i * 0.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-violet"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}

function ScreenImpact() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-3">
      <motion.p variants={pop} className="text-[13px] font-bold">My Impact</motion.p>
      <motion.div variants={pop} className="glass rounded-2xl p-3 text-center">
        <p className="font-display text-2xl font-bold text-gradient-blue">
          <CountUp value={128} duration={1600} />
        </p>
        <p className="text-[8px] uppercase tracking-widest text-white/40">Impact hours</p>
      </motion.div>
      <motion.div variants={pop} className="grid grid-cols-2 gap-2">
        {[['🌱', '14 events'], ['💧', '₹8.5k given'], ['🏅', '6 badges'], ['🤝', '3 NGOs']].map(([e, l], i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 240, damping: 15, delay: 0.5 + i * 0.14 }}
          >
            <Row className="glass rounded-xl px-3 py-2 text-[9px] text-white/70">
              <motion.span
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.4 }}
                className="text-sm"
              >
                {e}
              </motion.span>
              {l}
            </Row>
          </motion.div>
        ))}
      </motion.div>
      <motion.div variants={pop} className="flex h-[56px] items-end justify-between gap-1 px-1">
        {[30, 55, 40, 70, 62, 90, 100].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h * 0.5}px` }}
            transition={{ duration: 0.7, delay: 0.9 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-t bg-gradient-to-t from-primary/40 to-blue-300"
          />
        ))}
      </motion.div>
      <motion.p variants={pop} className="text-center text-[8px] text-white/40">
        Your kindness, measured beautifully.
      </motion.p>
    </motion.div>
  )
}

/* ---------------- journeys ---------------- */

const JOURNEYS = [
  { key: 'discover', label: 'Discover', title: 'Find your people.', desc: 'Search verified organizations by cause, city or skill — trust built in from the first tap.', Screen: ScreenDiscover, color: 'text-blue-300' },
  { key: 'profile', label: 'Connect', title: 'Follow what moves you.', desc: 'Every organization has a living profile — join, follow, and stay close to the work.', Screen: ScreenProfile, color: 'text-violet-300' },
  { key: 'campaign', label: 'Act', title: 'Show up in real life.', desc: 'Join campaigns and events near you. One tap turns intention into action.', Screen: ScreenCampaign, color: 'text-emerald-300' },
  { key: 'donate', label: 'Give', title: 'Give with total trust.', desc: 'Secure donations with instant receipts — see exactly where every rupee travels.', Screen: ScreenDonate, color: 'text-blue-300' },
  { key: 'community', label: 'Belong', title: 'Belong to something.', desc: 'Communities, chats, polls and announcements — the movement stays alive between events.', Screen: ScreenCommunity, color: 'text-violet-300' },
  { key: 'impact', label: 'Grow', title: 'Watch your ripple grow.', desc: 'Hours, badges, donations, lives touched — your entire impact story in one place.', Screen: ScreenImpact, color: 'text-orange-300' },
]

export default function AppReveal() {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        /* round, not floor — the screen flips at the midpoint of each band,
           so the first scroll gesture already responds */
        const idx = Math.max(0, Math.min(JOURNEYS.length - 1, Math.round(self.progress * (JOURNEYS.length - 1))))
        setActive(idx)
      },
    })
    return () => st.kill()
  }, [])

  const j = JOURNEYS[active]

  return (
    <section id="app" ref={sectionRef} className="relative" style={{ height: `${JOURNEYS.length * 65}vh` }}>
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        {/* ambient glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-6 lg:grid-cols-2 lg:gap-16">
          {/* narrative side — first on mobile so the story leads */}
          <div>
            <p className="section-label">The app reveal</p>
            <div className="mb-8 flex gap-2">
              {JOURNEYS.map((it, i) => (
                <span key={it.key} className={`h-1 rounded-full transition-all duration-500 ${i === active ? 'w-10 bg-primary' : 'w-4 bg-white/15'}`} />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={j.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={`mb-3 text-xs font-bold uppercase tracking-[0.3em] ${j.color}`}>{j.label}</p>
                <h3 className="font-display text-3xl font-bold leading-tight md:text-5xl">{j.title}</h3>
                <p className="mt-4 max-w-md text-sm text-white/60 md:mt-5 md:text-base">{j.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* the phone rises */}
          <motion.div
            initial={{ opacity: 0, y: 120, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
            style={{ perspective: 1200 }}
          >
            <div className="relative">
              <div className="phone-frame relative h-[440px] w-[220px] overflow-hidden p-4 pt-10 md:h-[560px] md:w-[272px]">
                <div className="phone-notch" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={j.key}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full"
                  >
                    <j.Screen />
                  </motion.div>
                </AnimatePresence>
                {/* glass light sweep */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.1]" />
              </div>
              {/* floating reflection */}
              <div className="absolute -bottom-14 left-1/2 h-10 w-56 -translate-x-1/2 rounded-full bg-primary/25 blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
