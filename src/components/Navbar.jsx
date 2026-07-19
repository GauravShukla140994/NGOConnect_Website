import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const LINKS = [
  ['Discover', '#purpose'],
  ['Causes', '#causes'],
  ['World', '#explore'],
  ['Stories', '#stories'],
  ['Organizations', '#organizations'],
]

export default function Navbar({ visible }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    addEventListener('scroll', fn, { passive: true })
    return () => removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-navy/70 py-3 shadow-lg shadow-black/30 backdrop-blur-xl' : 'py-5'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold">
          <span className="relative flex h-8 w-8 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary/40 blur-md" />
            <span className="relative h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_12px_#60a5fa]" />
          </span>
          RippleHub
        </a>

        <ul className="hidden items-center gap-8 text-sm text-white/70 lg:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="transition hover:text-white">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#download" className="btn-primary !px-6 !py-2.5 text-sm">
          Download App
        </a>
      </nav>
    </motion.header>
  )
}
