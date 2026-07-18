import { motion } from 'framer-motion'

const reveal = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
}

export default function Problem() {
  return (
    <section id="problem" className="relative flex min-h-screen flex-col items-center justify-center px-6 py-40 text-center">
      <motion.h2
        variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-20%' }}
        className="headline max-w-4xl"
      >
        Millions want to <span className="text-gradient-blue">help</span>.
        <br />
        Millions need <span className="text-gradient">help</span>.
      </motion.h2>

      <motion.p
        variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-20%' }}
        className="mt-10 max-w-xl text-lg text-white/55 md:text-xl"
      >
        Finding each other shouldn't be difficult.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-30%' }}
        transition={{ duration: 1.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-28 max-w-3xl"
      >
        <p className="font-display text-2xl font-light leading-relaxed text-blue-100/90 md:text-4xl">
          “What if the whole world could connect
          <br className="hidden md:block" /> through <span className="text-gradient-blue font-medium">one trusted platform</span>?”
        </p>
      </motion.div>
    </section>
  )
}
