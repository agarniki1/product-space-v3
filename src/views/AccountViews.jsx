import React, { useState } from 'react'
import { I, Avatar, TaskIcon, Orb } from '../ui.jsx'
import { taskById } from '../data.js'

// ---- right slide-over: профиль + личный бриф ----
function Field({ label, value, onChange, placeholder, rows = 2 }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 6 }}>{label}</div>
      <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ width: '100%', padding: '9px 11px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, resize: 'vertical', outline: 'none', background: '#fff', fontFamily: 'inherit', lineHeight: 1.45 }} />
    </div>
  )
}

export function ProfilePanel({ profile, onSave, onClose }) {
  const [d, setD] = useState({ ...profile })
  const set = (k) => (v) => setD((p) => ({ ...p, [k]: v }))

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(20,18,16,0.34)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 440, maxWidth: '92vw', height: '100%', background: 'var(--bg)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.16)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Профиль и контекст</div>
          <button className="btn" style={{ padding: 7 }} onClick={onClose}><I name="X" size={15} /></button>
        </div>

        <div className="scroll" style={{ flex: 1, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <Avatar initials={d.initials} color={d.color} size={48} style={{ fontSize: 17 }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{d.name}</div>
                {d.plan && <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.04em', color: '#fff', background: 'linear-gradient(135deg, var(--ai), #8b6cf0)', padding: '2px 7px', borderRadius: 6 }}>{d.plan.toUpperCase()}</span>}
              </div>
              <div className="muted" style={{ fontSize: 12 }}>{d.company}</div>
            </div>
          </div>

          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Мой бриф</div>
          <Field label="Должность" value={d.role} onChange={set('role')} placeholder="Напр.: Product Manager" rows={1} />
          <Field label="Продукт, над которым работаю" value={d.product} onChange={set('product')} placeholder="Напр.: дебетовые карты и онбординг" />
          <Field label="Целевая аудитория" value={d.audience} onChange={set('audience')} placeholder="Кто пользователи, ключевые сегменты" />
          <Field label="Мои задачи / зона ответственности" value={d.responsibilities} onChange={set('responsibilities')} placeholder="За какие метрики и решения отвечаю" />
          <Field label="Рынки / страны" value={d.markets} onChange={set('markets')} placeholder="UK, EEA, US…" rows={1} />
          <Field label="Бизнес-цели" value={d.goals} onChange={set('goals')} placeholder="Рост активации, retention, spend…" rows={1} />

          <div style={{ display: 'flex', gap: 8, marginTop: 6, padding: 11, borderRadius: 10, background: 'rgba(91,120,239,0.07)', border: '1px solid rgba(91,120,239,0.18)' }}>
            <I name="Sparkles" size={14} color="var(--ai)" style={{ flexShrink: 0, marginTop: 1 }} />
            <div className="muted" style={{ fontSize: 11.5, lineHeight: 1.5 }}>
              Этот бриф — устойчивый контекст. Он автоматически подставляется в генерацию задач: PRD, исследования, GTM и другие.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '14px 18px', borderTop: '1px solid var(--border)' }}>
          <button className="btn" onClick={onClose}>Отмена</button>
          <button className="btn btn-ai" onClick={() => onSave(d)}><I name="Check" size={14} /> Сохранить бриф</button>
        </div>
      </div>
    </div>
  )
}


// ---- история чатов / задач ----
export function History({ sessions, onOpenSession, onRenameSession, onDeleteSession }) {
  const [editId, setEditId] = useState(null)
  const [draft, setDraft] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const startEdit = (s) => { setEditId(s.id); setDraft(s.title); setConfirmId(null) }
  const saveEdit = () => { if (draft.trim()) onRenameSession(editId, draft.trim()); setEditId(null) }

  return (
    <div className="scroll">
      <div className="wrap" style={{ maxWidth: 820 }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>История</div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Прошлые чаты и сгенерированные задачи. Можно вернуться, переименовать или удалить.</div>
        </div>

        {sessions.length === 0 ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <Orb size={40} />
            <div style={{ fontSize: 14, fontWeight: 600, marginTop: 12 }}>Пока пусто</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>Создайте задачу — и сессия появится здесь.</div>
          </div>
        ) : (
          <div className="card">
            {sessions.map((s) => {
              const tasks = (s.taskIds || []).map((id) => taskById(id)).filter(Boolean)
              const editing = editId === s.id
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <TaskIcon name={tasks[0] ? tasks[0].icon : 'MessageSquare'} size={30} bg="rgba(91,120,239,0.1)" color="var(--ai)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {editing ? (
                      <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditId(null) }}
                        onBlur={saveEdit}
                        style={{ width: '100%', height: 30, padding: '0 9px', border: '1px solid var(--ai)', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }} />
                    ) : (
                      <button onClick={() => onOpenSession(s.id)} style={{ background: 'none', textAlign: 'left', width: '100%' }}>
                        <div className="ellipsis" style={{ fontSize: 13, fontWeight: 500 }}>{s.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2, flexWrap: 'wrap' }}>
                          <span className="muted" style={{ fontSize: 11 }}>{s.when}</span>
                          {s.projectName && <span className="muted" style={{ fontSize: 11 }}>· {s.projectName}</span>}
                          {tasks.slice(0, 2).map((t) => (
                            <span key={t.id} style={{ fontSize: 10, fontWeight: 600, color: 'var(--ai)', background: 'rgba(91,120,239,0.1)', padding: '1px 7px', borderRadius: 999 }}>{t.name}</span>
                          ))}
                        </div>
                      </button>
                    )}
                  </div>

                  {!editing && confirmId !== s.id && (
                    <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                      <button className="btn" style={{ padding: 6 }} title="Переименовать" onClick={() => startEdit(s)}><I name="Pencil" size={13} /></button>
                      <button className="btn" style={{ padding: 6 }} title="Удалить" onClick={() => setConfirmId(s.id)}><I name="Trash2" size={13} color="var(--red)" /></button>
                    </div>
                  )}
                  {confirmId === s.id && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span className="muted" style={{ fontSize: 11.5 }}>Удалить?</span>
                      <button className="btn" style={{ padding: '5px 9px', fontSize: 11.5 }} onClick={() => { onDeleteSession(s.id); setConfirmId(null) }}>Да</button>
                      <button className="btn" style={{ padding: '5px 9px', fontSize: 11.5 }} onClick={() => setConfirmId(null)}>Нет</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
