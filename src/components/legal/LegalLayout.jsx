import { Link } from 'react-router-dom'
import Footer from '../Footer.jsx'

export default function LegalLayout({ title, effectiveDate, children }) {
  return (
    <div className="grain relative min-h-screen bg-navy">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold text-white">
            <span className="relative flex h-8 w-8 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-primary/40 blur-md" />
              <span className="relative h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_12px_#60a5fa]" />
            </span>
            RippleHub
          </Link>
          <Link to="/" className="text-sm text-white/55 transition hover:text-white">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="section-label">Legal</p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-white/40">
          Effective date: {effectiveDate} · RippleHub Technologies
        </p>

        <div className="mt-14 space-y-12 text-[15px] leading-relaxed text-white/70">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export function Section({ title, children }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-white md:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

export function List({ items }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-primary">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
