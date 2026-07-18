import { AnimatePresence, motion } from 'framer-motion'

const LINES = {
  line1: 'Every act of kindness begins with one person.',
  journey: 'One ripple becomes many.',
  forming: 'And many become a world.',
}

export default function IntroOverlay({ phase }) {
  const line = LINES[phase]

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-end justify-center pb-[18vh]">
      <AnimatePresence mode="wait">
        {line && (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl px-6 text-center font-display text-2xl font-light tracking-wide text-blue-100/90 md:text-4xl"
          >
            {line}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
