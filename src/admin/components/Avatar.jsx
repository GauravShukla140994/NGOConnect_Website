import { useState } from 'react'

// Ported from renderAvatar()/getInitials()/colorForName() in the prototype.
// photoUrl may be null/undefined (no photo uploaded) — falls back to a colored
// initials circle. Also falls back on img load failure (broken/expired URL).
const AVATAR_COLORS = ['#6B4EFF', '#16A34A', '#FF8C42', '#2563EB', '#D4537E', '#0F766E']

function colorForName(name = '') {
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const initials = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)
  return initials.toUpperCase()
}

export default function Avatar({ name, photoUrl, size = 32, radius = '50%', fontSize = 12 }) {
  const [broken, setBroken] = useState(false)
  const showPhoto = !!photoUrl && !broken

  const style = {
    width: size,
    height: size,
    borderRadius: radius,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize,
    overflow: 'hidden',
    background: showPhoto ? '#E8E8F0' : colorForName(name || ''),
  }

  return (
    <div style={style}>
      {showPhoto ? (
        <img
          src={photoUrl}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setBroken(true)}
        />
      ) : (
        getInitials(name || '')
      )}
    </div>
  )
}
