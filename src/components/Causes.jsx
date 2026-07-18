import { motion } from 'framer-motion'

const CAUSES = [
  ['📚', 'Education', 'from-blue-500/20 to-blue-500/5'],
  ['🏥', 'Healthcare', 'from-rose-500/20 to-rose-500/5'],
  ['🌸', 'Women', 'from-pink-500/20 to-pink-500/5'],
  ['🧒', 'Children', 'from-amber-500/20 to-amber-500/5'],
  ['🐾', 'Animals', 'from-orange-500/20 to-orange-500/5'],
  ['🌍', 'Climate', 'from-emerald-500/20 to-emerald-500/5'],
  ['🌱', 'Environment', 'from-green-500/20 to-green-500/5'],
  ['🍲', 'Food', 'from-yellow-500/20 to-yellow-500/5'],
  ['🩸', 'Blood Donation', 'from-red-500/20 to-red-500/5'],
  ['👵', 'Senior Citizens', 'from-violet-500/20 to-violet-500/5'],
  ['🧠', 'Mental Health', 'from-purple-500/20 to-purple-500/5'],
  ['💻', 'Technology', 'from-cyan-500/20 to-cyan-500/5'],
  ['⚖️', 'Human Rights', 'from-indigo-500/20 to-indigo-500/5'],
  ['🚨', 'Disaster Relief', 'from-orange-500/20 to-orange-500/5'],
]

export default function Causes() {
  return (
    <section id="causes" className="relative py-36">
      {/* ambient gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="section-label">Causes</p>
          <h2 className="headline">
            Every cause. <span className="text-gradient">Every corner</span> of the world.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {CAUSES.map(([emoji, name, grad], i) => (
            <motion.a
              key={name}
              href="#download"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.6, delay: (i % 7) * 0.06, ease: 'easeOut' }}
              whileHover={{ y: -6, scale: 1.04 }}
              className={`group flex flex-col items-center gap-3 rounded-3xl border border-white/10 bg-gradient-to-b ${grad} px-4 py-8 text-center backdrop-blur-sm transition-shadow hover:shadow-[0_16px_50px_-15px_rgba(37,99,235,0.4)]`}
            >
              <span className="text-3xl transition-transform duration-500 group-hover:scale-125">{emoji}</span>
              <span className="text-xs font-semibold text-white/75 group-hover:text-white">{name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
