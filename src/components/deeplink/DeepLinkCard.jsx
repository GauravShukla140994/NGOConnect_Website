// Shared shell for every deep-link landing page (/invite, /ngo, /opportunity).
// Handles the loading / error / ready chrome; the caller supplies the
// ready-state content (logo, title, detail rows) as children.
export default function DeepLinkCard({ status, error, errorTitle = 'Link not available', storeUrl, onOpenApp, children }) {
  return (
    <div className="grain flex min-h-screen items-center justify-center bg-navy px-5">
      <div className="glass w-full max-w-sm rounded-3xl p-8 text-center">
        <a href="/" className="mb-6 inline-flex items-center gap-2.5 font-display text-base font-bold text-white">
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-primary/40 blur-md" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-blue-300 shadow-[0_0_12px_#60a5fa]" />
          </span>
          RippleHub
        </a>

        {status === 'loading' && <p className="text-sm text-white/50">Loading…</p>}

        {status === 'error' && (
          <>
            <div className="mb-4 text-5xl">🔗</div>
            <h1 className="font-display text-xl font-bold text-white">{errorTitle}</h1>
            <p className="mt-2 text-sm text-white/50">{error}</p>
            <a href={storeUrl} className="btn-primary mt-8 block !w-full">
              Download RippleHub
            </a>
          </>
        )}

        {status === 'ready' && (
          <>
            {children}
            <button onClick={onOpenApp} className="btn-primary mt-8 w-full">
              Open in RippleHub
            </button>
            <a
              href={storeUrl}
              className="mt-3 block text-sm text-white/50 underline underline-offset-2 transition hover:text-white"
            >
              Download RippleHub
            </a>
            <p className="mt-6 text-xs text-white/25">Opening the app…</p>
          </>
        )}
      </div>
    </div>
  )
}
