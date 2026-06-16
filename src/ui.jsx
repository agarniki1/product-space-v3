import React from 'react'
import * as Lucide from 'lucide-react'
import { stageOf } from './data.js'

// icon by string name with safe fallback (avoids build/runtime errors on missing names)
export function I({ name, size = 18, color = 'currentColor', strokeWidth = 1.9, style }) {
  const Cmp = (name && Lucide[name]) || Lucide.Square
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} style={style} />
}

// gradient "AI" orb
export function Orb({ size = 40, style }) {
  return <div className="orb" style={{ width: size, height: size, ...style }} />
}

// rounded-square icon tile for a task
export function TaskIcon({ name, size = 32, bg = 'var(--ai-lt)', color = 'var(--ai)', style }) {
  return (
    <div
      className="iconbox"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.3), background: bg, ...style }}
    >
      <I name={name} size={Math.round(size * 0.52)} color={color} strokeWidth={1.8} />
    </div>
  )
}

export function Card({ children, style }) {
  return <div className="card" style={style}>{children}</div>
}

export function SectionCard({ title, icon, action, children, style }) {
  return (
    <div className="card" style={style}>
      <div className="section-head">
        {icon}
        <span className="tt">{title}</span>
        {action && (
          <button className="act" onClick={action.onClick}>{action.label}</button>
        )}
      </div>
      {children}
    </div>
  )
}

export function Badge({ children, cls = 'gray', style }) {
  return <span className={`badge ${cls}`} style={style}>{children}</span>
}

export function StageTag({ stage }) {
  const s = stageOf(stage)
  return <span className="tag" style={{ background: s.bg, color: s.color }}>{s.label}</span>
}

export function Progress({ value = 0, color = 'var(--ai)' }) {
  return (
    <div className="progress">
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  )
}

export function Avatar({ initials, color = '#9299a5', size = 30, style }) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.36, ...style }}>
      {initials}
    </div>
  )
}

export function Stat({ value, label }) {
  return (
    <div className="stat">
      <div className="v">{value}</div>
      <div className="l">{label}</div>
    </div>
  )
}

export function Btn({ children, onClick, variant, style }) {
  const cls = variant === 'primary' ? 'btn btn-primary' : variant === 'ai' ? 'btn btn-ai' : 'btn'
  return <button className={cls} onClick={onClick} style={style}>{children}</button>
}
