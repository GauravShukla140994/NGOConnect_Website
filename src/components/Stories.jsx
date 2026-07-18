import { motion } from 'framer-motion'

const STORIES = [
  {
    img: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=70',
    place: 'Bengaluru, India',
    quote: 'I volunteered for one weekend. Now I teach children every Sunday.',
    tint: 'from-blue-600/40',
  },
  {
    img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=70',
    place: 'Nairobi, Kenya',
    quote: 'Twelve friends planted a hundred trees. A city followed with ten thousand.',
    tint: 'from-emerald-600/40',
  },
  {
    img: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=70',
    place: 'Berlin, Germany',
    quote: 'One blood donation. Three strangers woke up the next morning.',
    tint: 'from-violet-600/40',
  },
]

export default function Stories() {
  return (
    <section id="stories" className="relative py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="section-label">Stories</p>
          <h2 className="headline">
            Small acts. <span className="text-gradient">Extraordinary outcomes.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {STORIES.map((s, i) => (
            <motion.article
              key={s.place}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="group relative h-[480px] overflow-hidden rounded-[2rem]"
            >
              <img
                src={s.img}
                alt={s.place}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-110"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${s.tint} via-navy/40 to-transparent`} />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  {s.place}
                </p>
                <p className="font-display text-xl font-semibold leading-snug md:text-2xl">
                  “{s.quote}”
                </p>
                <span className="mt-5 inline-block text-sm font-medium text-blue-300 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                  Read the full story →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
