import { motion } from 'framer-motion'

const WITHOUT = [
  'Hard to reach volunteers',
  'No digital presence',
  'Low visibility',
  'Manual communication',
  'Limited growth',
]

const WITH = [
  'Global visibility',
  'Volunteer matching',
  'Events & campaigns',
  'Communities',
  'Verified profile',
  'Impact analytics',
]

const listStagger = {
  show: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Organizations() {
  return (
    <section id="organizations" className="relative py-36">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[500px] -translate-y-1/2 bg-gradient-to-r from-transparent via-violet/5 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <p className="section-label">For organizations</p>
          <h2 className="headline">
            The difference is <span className="text-gradient-blue">measurable</span>.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* before */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.02] p-10"
          >
            <p className="mb-8 text-sm font-semibold uppercase tracking-[0.25em] text-white/35">
              Without the platform
            </p>
            <motion.ul variants={listStagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-5">
              {WITHOUT.map((t) => (
                <motion.li key={t} variants={item} className="flex items-center gap-4 text-white/45">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-xs text-red-400">✕</span>
                  {t}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* after */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2rem] border border-primary/30 bg-gradient-to-b from-primary/15 to-violet/10 p-10 shadow-[0_30px_80px_-30px_rgba(37,99,235,0.4)]"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <p className="mb-8 text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
              With RippleHub
            </p>
            <motion.ul variants={listStagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="space-y-5">
              {WITH.map((t) => (
                <motion.li key={t} variants={item} className="flex items-center gap-4 text-white/90">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-xs text-secondary">✓</span>
                  {t}
                </motion.li>
              ))}
            </motion.ul>
            <a href="#download" className="btn-primary mt-10 w-full">
              Register Your Organization
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
