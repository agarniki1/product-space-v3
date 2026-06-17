import React, { useState, useRef, useEffect } from 'react'
import { I, Orb, TaskIcon } from './ui.jsx'
import { taskById, HERO } from './data.js'

function ThinkingBubble() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 2 }}>
      <Orb size={18} />
      <div className="dots" style={{ display: 'inline-flex', gap: 4, padding: '7px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.74)', border: '1px solid var(--border)' }}>
        <span /><span style={{ animationDelay: '.18s' }} /><span style={{ animationDelay: '.36s' }} />
      </div>
    </div>
  )
}

function ArtifactCard({ msg }) {
  const t = taskById(msg.taskId)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <Orb size={18} style={{ marginTop: 5 }} />
      <div className="card" style={{ flex: 1, maxWidth: 680 }}>
        <div className="section-head">
          <TaskIcon name={t ? t.icon : 'FileText'} size={20} bg="rgba(91,120,239,0.1)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tt ellipsis" style={{ fontSize: 12.5 }}>{msg.title}</div>
            <div className="muted ellipsis" style={{ fontSize: 11, marginTop: 1 }}>{t ? t.name : ''}</div>
          </div>
        </div>
        <div className="doc" style={{ padding: 16 }} dangerouslySetInnerHTML={{ __html: msg.docHtml || '' }} />
        <div style={{ display: 'flex', gap: 6, padding: '9px 12px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.4)' }}>
          <button className="btn" style={{ padding: '6px 11px', fontSize: 11.5 }}><I name="Copy" size={12} /> Копировать</button>
          <button className="btn" style={{ padding: '6px 11px', fontSize: 11.5 }}><I name="FolderInput" size={12} /> В проект</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ai" style={{ padding: '6px 11px', fontSize: 11.5 }}><I name="Share2" size={11} /> Поделиться</button>
        </div>
      </div>
    </div>
  )
}

export default function Chat({ messages, armedSkillIds, onSend, onDisarm, onOpenLibrary, greeting, contextNote }) {
  const [text, setText] = useState('')
  const taRef = useRef(null)
  const endRef = useRef(null)
  const armed = armedSkillIds.map((id) => taskById(id)).filter(Boolean)
  const hasMessages = messages.some((m) => m.role !== 'thinking') || messages.length > 0
  const heroTasks = HERO.map((id) => taskById(id)).filter(Boolean)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  const grow = (el) => { if (el) { el.style.height = 'auto'; el.style.height = `${Math.min(el.scrollHeight, 160)}px` } }
  const send = () => {
    const v = text.trim()
    if (!v) return
    onSend(v, armedSkillIds)
    setText('')
    if (taRef.current) taRef.current.style.height = 'auto'
  }
  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const inputBox = (big) => (
    <div style={{ width: '100%', maxWidth: big ? 700 : 820, margin: '0 auto' }}>
      {armed.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 10, justifyContent: big ? 'center' : 'flex-start' }}>
          {armed.map((t) => (
            <div key={t.id} className="chip">
              <TaskIcon name={t.icon} size={17} />
              {t.name}
              <button className="x" onClick={() => onDisarm(t.id)}><I name="X" size={12} /></button>
            </div>
          ))}
        </div>
      )}
      <div className="chat-input">
        <button className="btn" style={{ padding: 8, flexShrink: 0 }} onClick={onOpenLibrary} title="Добавить навык или промт">
          <I name="Plus" size={16} strokeWidth={2.1} />
        </button>
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => { setText(e.target.value); grow(e.target) }}
          onKeyDown={onKey}
          rows={1}
          placeholder={armed.length ? `Опишите задачу для «${armed[0].name}»…` : 'Сформулируйте задачу, идею или вопрос'}
        />
        <button className="btn btn-ai" style={{ padding: 9, flexShrink: 0, opacity: text.trim() ? 1 : 0.5 }} onClick={send}>
          <I name="ArrowUp" size={15} strokeWidth={2.2} color="#fff" />
        </button>
      </div>
    </div>
  )

  if (!hasMessages) {
    return (
      <div className="scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 760, padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Orb size={44} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 14 }}>
            {greeting || 'Над чем поработаем?'}
          </div>
          {contextNote && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'rgba(91,120,239,0.08)', border: '1px solid rgba(91,120,239,0.18)', fontSize: 11.5, color: 'var(--ink-2)', marginBottom: 20, maxWidth: '100%' }}>
              <I name="Sparkles" size={12} color="var(--ai)" />
              <span className="ellipsis">Контекст учтён: {contextNote}</span>
            </div>
          )}
          {inputBox(true)}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 22, maxWidth: 640 }}>
            {heroTasks.map((t) => (
              <button key={t.id} className="tile" style={{ padding: '8px 12px', flex: '0 0 auto' }} onClick={() => onSend(`Запусти: ${t.name}`, [t.id])}>
                <TaskIcon name={t.icon} size={22} />
                <span style={{ fontSize: 12.5, fontWeight: 500 }}>{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div className="scroll" style={{ padding: '26px 0' }}>
        {messages.map((m) => (
          <div key={m.id} style={{ maxWidth: 760, margin: '0 auto 20px', padding: '0 28px' }}>
            {m.role === 'thinking' && <ThinkingBubble />}
            {m.role === 'user' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid var(--border)', borderRadius: '16px 16px 10px 16px', padding: '11px 14px', fontSize: 14, maxWidth: '70%', lineHeight: 1.6 }}>
                  {m.text}
                </div>
              </div>
            )}
            {m.role === 'assistant' && m.type === 'artifact' && <ArtifactCard msg={m} />}
            {m.role === 'assistant' && m.type !== 'artifact' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Orb size={18} style={{ marginTop: 5 }} />
                <div style={{ fontSize: 14, lineHeight: 1.7, flex: 1, maxWidth: 660 }}>{m.text}</div>
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} style={{ height: 8 }} />
      </div>
      <div style={{ padding: '12px 28px 16px', borderTop: '1px solid var(--border)', background: 'rgba(247,246,243,0.92)' }}>
        {inputBox(false)}
      </div>
    </div>
  )
}
