import React, { useState, useRef, useEffect } from 'react'
import { I, Orb, TaskIcon } from './ui.jsx'
import { taskById, HERO } from './data.js'

// интеграции-источники (как «get better answers from your apps» у Notion)
const INTEGRATIONS = [
  { name: 'Jira', icon: 'SquareKanban', color: '#2563EB' },
  { name: 'Linear', icon: 'GitBranch', color: '#5E6AD2' },
  { name: 'Figma', icon: 'Figma', color: '#A259FF' },
  { name: 'Notion', icon: 'FileText', color: '#1b1c20' },
  { name: 'Slack', icon: 'Slack', color: '#4A154B' },
  { name: 'Google Drive', icon: 'HardDrive', color: '#1A73E8' },
  { name: 'GitHub', icon: 'Github', color: '#1b1c20' },
  { name: 'Amplitude', icon: 'BarChart3', color: '#1E61F0' },
  { name: 'Confluence', icon: 'BookOpen', color: '#2563EB' },
  { name: 'Perplexity', icon: 'Search', color: '#20808D' },
  { name: 'Gemini', icon: 'Sparkles', color: '#4285F4' },
]
const ENGINES = ['Auto', 'Claude', 'Perplexity', 'Gemini', 'Lovable']

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
  const [engine, setEngine] = useState(0)
  const [showApps, setShowApps] = useState(true)
  const [showStarted, setShowStarted] = useState(true)
  const taRef = useRef(null)
  const endRef = useRef(null)
  const armed = armedSkillIds.map((id) => taskById(id)).filter(Boolean)
  const hasMessages = messages.some((m) => m.role !== 'thinking') || messages.length > 0
  const heroTasks = HERO.map((id) => taskById(id)).filter(Boolean).slice(0, 4)

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

  // notion-style input: textarea сверху, ряд управления снизу
  const inputBox = (big) => (
    <div style={{ width: '100%', maxWidth: big ? 720 : 760, margin: '0 auto' }}>
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

      <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: '#fff', boxShadow: '0 6px 24px rgba(20,18,16,0.06)', overflow: 'hidden' }}>
        <textarea
          ref={taRef}
          value={text}
          onChange={(e) => { setText(e.target.value); grow(e.target) }}
          onKeyDown={onKey}
          rows={big ? 2 : 1}
          placeholder={armed.length ? `Опишите задачу для «${armed[0].name}»…` : 'Сформулируйте задачу, идею или вопрос…'}
          style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontSize: 15, lineHeight: 1.5, padding: '15px 16px 4px', maxHeight: 160, fontFamily: 'inherit' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px 10px' }}>
          <button className="btn" style={{ padding: 7 }} onClick={onOpenLibrary} title="Добавить навык или промт">
            <I name="Plus" size={16} strokeWidth={2.1} />
          </button>
          <button className="btn" style={{ padding: 7 }} title="Контекст брифа применяется">
            <I name="SlidersHorizontal" size={15} />
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={() => setEngine((e) => (e + 1) % ENGINES.length)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)', padding: '5px 8px', borderRadius: 8, background: 'none' }}
            title="Движок выбирается под задачу">
            {ENGINES[engine]} <I name="ChevronDown" size={13} color="var(--ink-3)" />
          </button>
          <button className="btn" style={{ padding: 7 }} title="Голос"><I name="Mic" size={15} /></button>
          <button onClick={send} disabled={!text.trim()}
            style={{ width: 32, height: 32, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: text.trim() ? 'var(--ai)' : 'rgba(27,28,32,0.1)', transition: 'background .15s' }}>
            <I name="ArrowUp" size={16} strokeWidth={2.3} color={text.trim() ? '#fff' : 'var(--ink-3)'} />
          </button>
        </div>
      </div>

      {/* интеграции-источники */}
      {big && showApps && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.55)', border: '1px solid var(--border)', borderRadius: 13 }}>
          <span className="muted" style={{ fontSize: 12, fontWeight: 500, flexShrink: 0 }}>Точнее с вашими источниками</span>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, overflowX: 'auto' }}>
            {INTEGRATIONS.map((a) => (
              <span key={a.name} title={a.name} style={{ width: 27, height: 27, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${a.color}14`, border: '1px solid var(--border)' }}>
                <I name={a.icon} size={14} color={a.color} />
              </span>
            ))}
          </div>
          <button className="btn" style={{ padding: 5, flexShrink: 0 }} onClick={() => setShowApps(false)}><I name="X" size={13} /></button>
        </div>
      )}
    </div>
  )

  if (!hasMessages) {
    return (
      <div className="scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 760, padding: '40px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Orb size={46} style={{ marginBottom: 16 }} />
          <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 13 }}>
            {greeting || 'Над чем поработаем?'}
          </div>
          {contextNote && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'rgba(91,120,239,0.08)', border: '1px solid rgba(91,120,239,0.18)', fontSize: 11.5, color: 'var(--ink-2)', marginBottom: 20, maxWidth: '100%' }}>
              <I name="Sparkles" size={12} color="var(--ai)" />
              <span className="ellipsis">Контекст учтён: {contextNote}</span>
            </div>
          )}
          {inputBox(true)}

          {showStarted && (
            <div style={{ width: '100%', maxWidth: 720, marginTop: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>С чего начать</span>
                <button className="btn" style={{ padding: 5 }} onClick={() => setShowStarted(false)}><I name="X" size={13} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {heroTasks.map((t) => (
                  <button key={t.id} onClick={() => onSend(`Запусти: ${t.name}`, [t.id])}
                    style={{ textAlign: 'left', padding: 13, borderRadius: 13, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: 9, minHeight: 84 }}>
                    <TaskIcon name={t.icon} size={26} />
                    <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
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
