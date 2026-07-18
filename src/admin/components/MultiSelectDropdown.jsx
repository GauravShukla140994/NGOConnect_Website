import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Searchable multi-select with an "All" master checkbox — ports the prototype's
// toggleOrgMs()/toggleOrgAll()/onOrgItemChange()/updateOrgMsLabel()/filterOrgOptions()
// behavior. The panel is rendered via a portal to document.body rather than as a
// normal absolutely-positioned child, specifically to avoid a repeat of a real bug
// hit while building the prototype: a parent .card's overflow:hidden clipped the
// panel even at a high z-index. Portaling sidesteps ancestor overflow entirely.
export default function MultiSelectDropdown({ options, selected, onChange, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [rect, setRect] = useState(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    function onDocClick(e) {
      if (triggerRef.current?.contains(e.target)) return
      if (panelRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  useEffect(() => {
    if (!open) return
    function reposition() {
      const r = triggerRef.current?.getBoundingClientRect()
      if (r) setRect({ top: r.bottom + 6 + window.scrollY, left: r.left + window.scrollX, width: r.width })
    }
    reposition()
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])

  function toggle() {
    if (!open) {
      const r = triggerRef.current?.getBoundingClientRect()
      if (r) setRect({ top: r.bottom + 6 + window.scrollY, left: r.left + window.scrollX, width: r.width })
      setSearch('')
    }
    setOpen((o) => !o)
  }

  const allChecked = options.length > 0 && selected.length === options.length
  const someChecked = selected.length > 0 && !allChecked

  function toggleAll(checked) {
    onChange(checked ? options.map((o) => o.value) : [])
  }
  function toggleOne(value, checked) {
    onChange(checked ? [...selected, value] : selected.filter((v) => v !== value))
  }

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))

  let label = placeholder
  if (options.length === 0) label = placeholder
  else if (selected.length === 0) label = 'No organisations'
  else if (allChecked) label = 'All organisations'
  else if (selected.length === 1) label = options.find((o) => o.value === selected[0])?.label || '1 selected'
  else label = `${selected.length} organisations`

  return (
    <div className="ms-dropdown">
      <button type="button" ref={triggerRef} className="fs ms-trigger" onClick={toggle}>
        <span>{label}</span>
        <span className="ms-caret">&#9662;</span>
      </button>
      {open && rect &&
        createPortal(
          <div
            ref={panelRef}
            className="ms-panel"
            style={{ position: 'absolute', top: rect.top, left: rect.left, width: Math.max(rect.width, 220) }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              className="ms-search"
              placeholder="Search organisations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label className="ms-option">
              <input
                type="checkbox"
                checked={allChecked}
                ref={(el) => { if (el) el.indeterminate = someChecked }}
                onChange={(e) => toggleAll(e.target.checked)}
              />
              <span>All organisations</span>
            </label>
            <div style={{ height: 1, background: 'var(--bd)', margin: '6px 0' }} />
            {filtered.map((o) => (
              <label className="ms-option" key={o.value}>
                <input type="checkbox" checked={selected.includes(o.value)} onChange={(e) => toggleOne(o.value, e.target.checked)} />
                <span>{o.label}</span>
              </label>
            ))}
            {filtered.length === 0 && (
              <div className="xs" style={{ padding: '10px 8px' }}>No organisations match your search.</div>
            )}
          </div>,
          document.body
        )}
    </div>
  )
}
