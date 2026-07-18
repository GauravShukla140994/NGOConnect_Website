const COLS = [
  ['Discover', ['Organizations', 'Communities', 'Events', 'Causes']],
  ['Company', ['About', 'Careers', 'Press', 'Contact']],
  ['Resources', ['Developers', 'Blog', 'Support', 'Status']],
  ['Legal', ['Privacy', 'Terms', 'Security', 'Cookies']],
]

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#070d1a]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* brand + newsletter */}
          <div className="lg:col-span-2">
            <a href="#top" className="flex items-center gap-2.5 font-display text-lg font-bold">
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-primary/40 blur-md" />
                <span className="relative h-3 w-3 rounded-full bg-blue-300 shadow-[0_0_12px_#60a5fa]" />
              </span>
              Platform Name
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              Connecting every helping hand with every cause — anywhere in the world.
            </p>

            <form className="mt-8 flex max-w-sm gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Email for the movement's letter"
                className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-primary/60"
              />
              <button className="btn-primary !px-6 !py-3 text-sm">Join</button>
            </form>

            <div className="mt-8 flex gap-3">
              {['𝕏', 'in', '◎', '▶'].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="glass flex h-10 w-10 items-center justify-center rounded-full text-sm text-white/60 transition hover:scale-110 hover:text-white"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {COLS.map(([title, links]) => (
            <div key={title}>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-white/35">
                {title}
              </p>
              <ul className="space-y-3.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/55 transition hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/35 md:flex-row">
          <p>© 2026 Platform Name. Built for the world.</p>
          <p>Made with intention · Powered by community</p>
        </div>
      </div>
    </footer>
  )
}
