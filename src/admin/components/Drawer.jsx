export default function Drawer({ open, onClose, children }) {
  if (!open) return null
  return (
    <div className="drawer-ov on" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
