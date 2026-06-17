import React, { useState, useMemo } from 'react'
import { I, Orb, TaskIcon, SectionCard, Badge, Progress, Avatar, Stat, Btn } from '../ui.jsx'
import { SKILLS, PROMPTS, ALL_TASKS, STAGES, HERO, STATUS, taskById, ARTIFACT_TYPES, artifactTypeOf, PROVENANCE, LINK_TYPES, artifactById, WORKFLOWS, docTemplate, critiqueFor } from '../data.js'

const statusBadge = (s) => {
  const st = STATUS[s] || STATUS.gray
  return <Badge cls={st ? st.cls : 'gray'}>{st ? st.label : s}</Badge>
}

// ============ PM Dashboard ============
export function PMDashboard({ profile, projects, artifacts, onArm, onCreate, onOpenProject, onNav, onOpenArtifact, suggestions }) {
  const hour = new Date().getHours()
  const hi = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер'
  const quick = (suggestions && suggestions.length ? suggestions : HERO).slice(0, 4).map((id) => taskById(id)).filter(Boolean)
  const needsReview = artifacts.filter((a) => a.status === 'in_review')
  const decisions = artifacts.filter((a) => a.type === 'decision')

  return (
    <div className="scroll">
      <div className="wrap">
        <div className="card" style={{ padding: 22, marginBottom: 18, background: 'linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.7))' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
            <Orb size={46} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em' }}>{hi}, {profile.name.split(' ')[0]}</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Продолжите проект или создайте задача — всё остаётся связанным и подкреплённым.</div>
            </div>
            <Btn variant="ai" onClick={onCreate}><I name="Plus" size={14} strokeWidth={2.1} /> Создать задачу</Btn>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            <span className="muted" style={{ fontSize: 12, alignSelf: 'center', display: 'inline-flex', alignItems: 'center', gap: 4 }}><I name="Sparkles" size={12} color="var(--ai)" /> Под вашу роль:</span>
            {quick.map((t) => (
              <button key={t.id} className="chip" onClick={() => onArm(t.id)}>
                <TaskIcon name={t.icon} size={17} /> {t.name}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 }}>
          <Stat value={projects.length} label="Проектов" />
          <Stat value={artifacts.length} label="Задач" />
          <Stat value={needsReview.length} label="На ревью" />
          <Stat value={decisions.length} label="Решений" />
        </div>

        {needsReview.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <SectionCard title="Требует ревью" icon={<I name="ShieldQuestion" size={13} color="var(--amber)" />} action={{ label: 'Все →', onClick: () => onNav('artifacts') }}>
              {needsReview.map((a) => {
                const ty = artifactTypeOf(a.type)
                return (
                  <button key={a.id} className="row" onClick={() => onOpenArtifact ? onOpenArtifact(a.id) : onNav('artifacts')}>
                    <TaskIcon name={ty.icon} size={28} bg={`${ty.color}1a`} color={ty.color} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ellipsis" style={{ fontSize: 12.5, fontWeight: 500 }}>{a.title}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{ty.label} · {a.project}</div>
                    </div>
                    {statusBadge(a.status)}
                  </button>
                )
              })}
            </SectionCard>
          </div>
        )}

        <div style={{ marginBottom: 18 }}>
          <SectionCard title="Мои проекты" icon={<I name="Briefcase" size={13} color="var(--ink-3)" />} action={{ label: 'Все →', onClick: () => onNav('projects') }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              {projects.map((p, i) => (
                <button key={p.id} onClick={() => onOpenProject(p.id)}
                  style={{ textAlign: 'left', padding: 16, borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none', borderBottom: i < projects.length - 2 ? '1px solid var(--border)' : 'none', background: 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{p.product} · {p.updated}</div>
                    </div>
                    {statusBadge(p.status)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 10 }}>{p.goal}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Progress value={p.progress} />
                    <span className="muted" style={{ fontSize: 11, fontWeight: 600 }}>{p.progress}%</span>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Недавние задачи" icon={<I name="Layers" size={13} color="var(--ink-3)" />} action={{ label: 'Все →', onClick: () => onNav('artifacts') }}>
          {artifacts.slice(0, 6).map((a) => {
            const ty = artifactTypeOf(a.type)
            const evN = (a.evidence || []).length
            const lkN = (a.links || []).length
            return (
              <button key={a.id} className="row" onClick={() => onOpenArtifact ? onOpenArtifact(a.id) : onNav('artifacts')}>
                <TaskIcon name={ty.icon} size={28} bg={`${ty.color}1a`} color={ty.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ellipsis" style={{ fontSize: 12.5, fontWeight: 500 }}>{a.title}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{ty.label} · {a.project}</div>
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--ink-3)', marginRight: 10 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><I name="Paperclip" size={11} /> {evN}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}><I name="Link2" size={11} /> {lkN}</span>
                </div>
                {statusBadge(a.status)}
              </button>
            )
          })}
        </SectionCard>
      </div>
    </div>
  )
}

// ============ Library (shared PM + Owner) ============
export function Library({ onArm }) {
  const [entity, setEntity] = useState('all')
  const [stage, setStage] = useState('all')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => ALL_TASKS.filter((t) => {
    const okE = entity === 'all' || t.entity === entity
    const okS = stage === 'all' || t.stage === stage
    const ql = q.trim().toLowerCase()
    const okQ = !ql || t.name.toLowerCase().includes(ql) || t.desc.toLowerCase().includes(ql)
    return okE && okS && okQ
  }), [entity, stage, q])

  const grouped = useMemo(() => {
    const g = {}
    for (const t of filtered) { (g[t.stage] = g[t.stage] || []).push(t) }
    return g
  }, [filtered])

  const counts = { all: ALL_TASKS.length, skill: SKILLS.length, prompt: PROMPTS.length }

  return (
    <div className="scroll">
      <div className="wrap">
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.88)', border: '1px solid var(--border)', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.03em', color: 'var(--ink-2)', marginBottom: 12 }}>
            <I name="Plus" size={11} /> Создать задачу
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 6 }}>Что произвести?</div>
          <div className="muted" style={{ fontSize: 13, marginBottom: 16 }}>
            Выберите навык — многошаговый сценарий с задачей на выходе, или промт — короткую заготовку под быстрый запрос.
          </div>

          <div style={{ position: 'relative', maxWidth: 560, marginBottom: 14 }}>
            <I name="Search" size={16} color="var(--ink-3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по названию или описанию"
              style={{ width: '100%', height: 44, padding: '0 14px 0 40px', border: '1px solid var(--border)', borderRadius: 12, fontSize: 14, background: '#fff', outline: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {[['all', 'Все'], ['skill', 'Навыки'], ['prompt', 'Промты']].map(([id, label]) => (
              <button key={id} className={`pill ${entity === id ? 'on' : ''}`} onClick={() => setEntity(id)}>
                {label} <span className="n">{counts[id]}</span>
              </button>
            ))}
            <div style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
            <button className={`pill ${stage === 'all' ? 'on' : ''}`} onClick={() => setStage('all')}>Все этапы</button>
            {STAGES.map((s) => (
              <button key={s.id} className={`pill ${stage === s.id ? 'on' : ''}`} onClick={() => setStage(s.id)}>{s.label}</button>
            ))}
          </div>
        </div>

        {STAGES.filter((s) => grouped[s.id]).map((s) => (
          <div key={s.id} style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.color }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--ink-3)' }}>{s.label}</span>
              <span className="muted" style={{ fontSize: 10.5 }}>{grouped[s.id].length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {grouped[s.id].map((t) => (
                <button key={t.id} className="tile" style={{ alignItems: 'flex-start', padding: 15 }} onClick={() => onArm(t.id)}>
                  <TaskIcon name={t.icon} size={30} bg={s.bg} color={s.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</span>
                      <span style={{ fontSize: 9.5, fontWeight: 600, padding: '2px 6px', borderRadius: 999, background: 'rgba(24,28,36,0.045)', color: 'var(--ink-2)' }}>
                        {t.entity === 'skill' ? 'навык' : 'промт'}
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>{t.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="muted" style={{ textAlign: 'center', padding: '50px 0', fontSize: 13.5 }}>Ничего не найдено</div>
        )}
      </div>
    </div>
  )
}

// ============ Projects list + detail ============
// ---- editable project-memory field ----
function MemoryField({ label, value, onChange, auto }) {
  const [editing, setEditing] = useState(false)
  if (auto) {
    return (
      <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
          <span style={{ fontSize: 9.5, color: 'var(--ink-3)', display: 'inline-flex', alignItems: 'center', gap: 3 }}><I name="RefreshCw" size={9} /> авто</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>{value}</div>
      </div>
    )
  }
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
        <button onClick={() => setEditing((e) => !e)} style={{ background: 'none', marginLeft: 'auto', color: 'var(--ai)', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
          <I name={editing ? 'Check' : 'Pencil'} size={11} /> {editing ? 'готово' : 'ред.'}
        </button>
      </div>
      {editing ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2}
          style={{ width: '100%', border: '1px solid var(--ai)', borderRadius: 8, padding: '7px 9px', fontSize: 13, resize: 'vertical', outline: 'none', background: '#fff', fontFamily: 'inherit', lineHeight: 1.5 }} />
      ) : (
        <div style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>{value}</div>
      )}
    </div>
  )
}

function ProjectWorkspace({ project: p, artifacts, onBack, onCreateInProject, onArm, onOpenWorkflow, onOpenArtifact }) {
  const pArtifacts = artifacts.filter((a) => a.project === p.name)
  const decisions = pArtifacts.filter((a) => a.type === 'decision')
  const lastDecision = decisions[0]
  const [mem, setMem] = useState({ goal: p.goal, audience: p.audience, constraints: p.constraints, nsm: p.nsm })
  const set = (k) => (v) => setMem((m) => ({ ...m, [k]: v }))

  return (
    <div className="scroll">
      <div className="wrap">
        <button className="btn" style={{ marginBottom: 16 }} onClick={onBack}><I name="ArrowLeft" size={14} /> Все проекты</button>

        <div className="card" style={{ padding: 22, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <h1 style={{ fontSize: 25, fontWeight: 700, letterSpacing: '-0.03em' }}>{p.name}</h1>
                {statusBadge(p.status)}
              </div>
              <div className="muted" style={{ fontSize: 12.5 }}>{p.product} · обновлён {p.updated}</div>
            </div>
            <Btn variant="ai" onClick={() => onCreateInProject(p.id)}><I name="Plus" size={14} strokeWidth={2.1} /> Создать задачу</Btn>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            <Stat value={p.product} label="Направление" />
            <Stat value={`${p.progress}%`} label="Прогресс" />
            <Stat value={pArtifacts.length} label="Задач" />
            <Stat value={decisions.length} label="Решений" />
          </div>
        </div>

        {/* workflow launcher */}
        {WORKFLOWS.map((w) => (
          <button key={w.id} className="card" onClick={() => onOpenWorkflow(w.id)}
            style={{ width: '100%', textAlign: 'left', padding: 14, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(180deg, rgba(91,120,239,0.07), rgba(91,120,239,0.03))', border: '1px solid rgba(91,120,239,0.2)' }}>
            <TaskIcon name={w.icon || 'Workflow'} size={34} bg="rgba(91,120,239,0.14)" color="var(--ai)" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Workflow: {w.name}</div>
              <div className="muted ellipsis" style={{ fontSize: 11.5 }}>{w.desc}</div>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--ai)' }}>Запустить <I name="ArrowRight" size={14} /></span>
          </button>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }}>
          {/* left: artifact map */}
          <SectionCard title="Карта задач" icon={<I name="Workflow" size={13} color="var(--ink-3)" />}>
            {pArtifacts.length === 0 ? (
              <div className="muted" style={{ padding: '28px 16px', textAlign: 'center', fontSize: 12.5 }}>
                Пока пусто. Нажмите «Создать задачу» — он появится здесь со связями и evidence.
              </div>
            ) : pArtifacts.map((a) => {
              const ty = artifactTypeOf(a.type)
              return (
                <div key={a.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <button onClick={() => onOpenArtifact && onOpenArtifact(a.id)} style={{ background: 'none', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <TaskIcon name={ty.icon} size={28} bg={`${ty.color}1a`} color={ty.color} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ellipsis" style={{ fontSize: 12.5, fontWeight: 500, display: 'flex', gap: 7, alignItems: 'center' }}>
                        {a.title}{a.version > 1 && <span className="muted" style={{ fontSize: 10, fontWeight: 500 }}>v{a.version}</span>}
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: ty.color }}>{ty.label}</div>
                    </div>
                    {statusBadge(a.status)}
                  </button>
                  {(a.links || []).length > 0 && (
                    <div style={{ marginLeft: 38, marginTop: 7, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {a.links.map((l, i) => {
                        const src = artifactById(l.artifactId)
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-3)' }}>
                            <I name="CornerDownRight" size={11} />
                            <span style={{ color: 'var(--ai)', fontWeight: 600 }}>{LINK_TYPES[l.type]}</span>
                            <span className="ellipsis">{src ? src.title : '—'}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {(a.evidence || []).length > 0 && (
                    <div style={{ marginLeft: 38, marginTop: 5, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--ink-3)' }}>
                      <I name="Paperclip" size={11} /> {a.evidence.length} источник(а): {a.evidence.map((e) => e.label).slice(0, 2).join(', ')}{a.evidence.length > 2 ? '…' : ''}
                    </div>
                  )}
                </div>
              )
            })}
          </SectionCard>

          {/* right: project memory + decision log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: '6px 16px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 0 4px' }}>
                <I name="Brain" size={14} color="var(--ai)" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Память проекта</span>
              </div>
              <div className="muted" style={{ fontSize: 11, marginBottom: 4 }}>Контекст, который AI подставляет в каждый задача проекта.</div>
              <MemoryField label="Цель" value={mem.goal} onChange={set('goal')} />
              <MemoryField label="Аудитория" value={mem.audience} onChange={set('audience')} />
              <MemoryField label="Ограничения" value={mem.constraints} onChange={set('constraints')} />
              <MemoryField label="North Star" value={mem.nsm} onChange={set('nsm')} />
              <MemoryField label="Последнее решение" auto value={lastDecision ? lastDecision.title : '—'} />
              <MemoryField label="Задач в проекте" auto value={String(pArtifacts.length)} />
            </div>

            <SectionCard title="Лог решений" icon={<I name="Gavel" size={13} color="var(--ink-3)" />}>
              {decisions.length === 0 ? (
                <div className="muted" style={{ padding: '20px 16px', textAlign: 'center', fontSize: 12 }}>Решений пока нет.</div>
              ) : decisions.map((d) => {
                const basis = (d.links || []).map((l) => artifactById(l.artifactId)).filter(Boolean)
                return (
                  <div key={d.id} className="row" style={{ alignItems: 'flex-start' }}>
                    <TaskIcon name="Gavel" size={26} bg="rgba(27,28,32,0.06)" color="var(--ink)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>{d.title}</div>
                      {basis.length > 0 && <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>на основе: {basis.map((b) => b.title).join(', ')}</div>}
                    </div>
                  </div>
                )
              })}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Projects({ projects, artifacts, selectedId, onOpen, onBack, onArm, onCreateInProject, onOpenWorkflow, onOpenArtifact }) {
  if (selectedId) {
    const p = projects.find((x) => x.id === selectedId)
    if (!p) return null
    return <ProjectWorkspace project={p} artifacts={artifacts} onBack={onBack} onCreateInProject={onCreateInProject} onArm={onArm} onOpenWorkflow={onOpenWorkflow} onOpenArtifact={onOpenArtifact} />
  }

  return (
    <div className="scroll">
      <div className="wrap">
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 16 }}>Проекты</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {projects.map((p) => (
            <button key={p.id} className="card" onClick={() => onOpen(p.id)} style={{ padding: 18, textAlign: 'left', background: 'var(--panel)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{p.name}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{p.product} · {p.updated}</div>
                </div>
                {statusBadge(p.status)}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55, marginBottom: 12 }}>{p.goal}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Progress value={p.progress} />
                <span className="muted" style={{ fontSize: 11, fontWeight: 600 }}>{p.progress}%</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ Workflow runner (end-to-end chain) ============
export function WorkflowRunner({ workflow, project, onProduce, onBack }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [produced, setProduced] = useState([])
  const [running, setRunning] = useState(false)
  if (!workflow) return null
  const steps = workflow.steps
  const allDone = stepIndex >= steps.length

  const runStep = () => {
    const step = steps[stepIndex]
    setRunning(true)
    setTimeout(() => {
      const prev = produced[stepIndex - 1]
      const evidence = prev ? [{ kind: 'artifact', label: prev.title, ref: prev.id }] : []
      const links = []
      if (prev) links.push({ type: 'derived_from', artifactId: prev.id })
      if (stepIndex === steps.length - 1 && produced[0]) links.push({ type: 'backed_by', artifactId: produced[0].id })
      const id = onProduce({
        type: step.produces, title: step.title, taskId: step.taskId,
        project: project ? project.name : null, status: step.status, evidence, links,
      })
      setProduced((cur) => [...cur, { id, title: step.title, type: step.produces, status: step.status, prevTitle: prev ? prev.title : null }])
      setStepIndex((i) => i + 1)
      setRunning(false)
    }, 900)
  }

  return (
    <div className="scroll">
      <div className="wrap" style={{ maxWidth: 720 }}>
        <button className="btn" style={{ marginBottom: 16 }} onClick={onBack}><I name="ArrowLeft" size={14} /> Проект</button>

        <div className="card" style={{ padding: 20, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 8 }}>
            <TaskIcon name={workflow.icon || 'Workflow'} size={34} bg="rgba(91,120,239,0.12)" color="var(--ai)" />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>{workflow.name}</div>
              {project && <div className="muted" style={{ fontSize: 12 }}>Проект «{project.name}»</div>}
            </div>
          </div>
          <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>{workflow.desc}</div>
        </div>

        <div style={{ position: 'relative' }}>
          {steps.map((step, i) => {
            const state = i < stepIndex ? 'done' : (i === stepIndex && !allDone ? 'active' : 'locked')
            const ty = artifactTypeOf(step.produces)
            const st = STAGES.find((s) => s.id === step.stage)
            const out = produced[i]
            const last = i === steps.length - 1
            return (
              <div key={step.id} style={{ display: 'flex', gap: 14, opacity: state === 'locked' ? 0.5 : 1 }}>
                {/* rail */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 999, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: state === 'done' ? 'var(--green)' : state === 'active' ? 'var(--ai)' : 'rgba(27,28,32,0.08)',
                    color: state === 'locked' ? 'var(--ink-3)' : '#fff', fontSize: 12, fontWeight: 700,
                  }}>
                    {state === 'done' ? <I name="Check" size={15} /> : state === 'locked' ? <I name="Lock" size={12} /> : i + 1}
                  </div>
                  {!last && <div style={{ width: 2, flex: 1, minHeight: 24, background: i < stepIndex ? 'var(--green)' : 'var(--border)' }} />}
                </div>

                {/* body */}
                <div style={{ flex: 1, paddingBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{step.label}</span>
                    {st && <span style={{ fontSize: 10.5, fontWeight: 600, color: st.color, background: st.bg, padding: '1px 7px', borderRadius: 999 }}>{st.label}</span>}
                    <span className="muted" style={{ fontSize: 11 }}>→ {ty.label}</span>
                  </div>
                  <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 10 }}>{step.desc}</div>

                  {state === 'active' && (
                    <Btn variant="ai" onClick={runStep} style={running ? { opacity: 0.7, pointerEvents: 'none' } : {}}>
                      {running ? <><I name="Loader" size={14} /> Генерирую…</> : <><I name="Play" size={14} /> Запустить шаг</>}
                    </Btn>
                  )}

                  {state === 'done' && out && (
                    <div className="card" style={{ padding: 12, background: 'var(--panel)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <TaskIcon name={ty.icon} size={28} bg={`${ty.color}1a`} color={ty.color} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="ellipsis" style={{ fontSize: 12.5, fontWeight: 600 }}>{out.title}</div>
                          <div style={{ fontSize: 10.5, fontWeight: 600, color: ty.color }}>{ty.label}</div>
                        </div>
                        {statusBadge(out.status)}
                      </div>
                      {out.prevTitle && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-3)' }}>
                          <I name="CornerDownRight" size={11} />
                          <span style={{ color: 'var(--ai)', fontWeight: 600 }}>выведен из</span>
                          <span className="ellipsis">{out.prevTitle}</span>
                          {last && <span className="muted"> · + подкреплён discovery</span>}
                        </div>
                      )}
                    </div>
                  )}

                  {state === 'locked' && (
                    <div className="muted" style={{ fontSize: 11.5 }}>Откроется после предыдущего шага</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {allDone && (
          <div className="card" style={{ padding: 18, marginTop: 4, background: 'rgba(22,163,74,0.06)', border: '1px solid rgba(22,163,74,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <I name="CircleCheck" size={18} color="var(--green)" />
              <span style={{ fontSize: 14, fontWeight: 700 }}>Готово — {steps.length} связанных задач</span>
            </div>
            <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 12 }}>
              Цепочка discovery → synthesis → PRD собрана и лежит в проекте. PRD несёт связи на проблему и discovery — не «из воздуха».
            </div>
            <Btn variant="ai" onClick={onBack}><I name="FolderOpen" size={14} /> Открыть проект — увидеть граф</Btn>
          </div>
        )}
      </div>
    </div>
  )
}

// ============ Artifact detail (trust UX + decision record) ============
const EV_ICON = { url: 'Globe', file: 'FileText', artifact: 'Layers', metric: 'BarChart3' }

export function ArtifactDetail({ artifact: a, allArtifacts, onBack, onApprove, onCritique, onCreateDecision, onOpenArtifact }) {
  const [decTitle, setDecTitle] = useState('')
  const [decOpen, setDecOpen] = useState(false)
  if (!a) return null
  const ty = artifactTypeOf(a.type)
  const body = docTemplate(a.taskId, a.title)
  const linkOf = (id) => allArtifacts.find((x) => x.id === id) || artifactById(id)
  const incoming = allArtifacts.filter((x) => (x.links || []).some((l) => l.artifactId === a.id))
  const isDecision = a.type === 'decision'
  const canDecide = a.status === 'approved' && !isDecision

  return (
    <div className="scroll">
      <div className="wrap" style={{ maxWidth: 1060 }}>
        <button className="btn" style={{ marginBottom: 16 }} onClick={onBack}><I name="ArrowLeft" size={14} /> Назад</button>

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 13 }}>
            <TaskIcon name={ty.icon} size={40} bg={`${ty.color}1a`} color={ty.color} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', marginBottom: 5 }}>
                <h1 style={{ fontSize: 21, fontWeight: 700, letterSpacing: '-0.025em' }}>{a.title}</h1>
                {statusBadge(a.status)}
                {a.version > 1 && <span className="muted" style={{ fontSize: 11.5 }}>v{a.version}</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: ty.color }}>{ty.label}</span>
                {a.project && <span className="muted" style={{ fontSize: 11.5 }}>· {a.project}</span>}
                {(a.source || []).map((s) => PROVENANCE[s] && (
                  <span key={s} style={{ fontSize: 10.5, display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--ink-3)', background: 'rgba(27,28,32,0.05)', padding: '2px 7px', borderRadius: 999 }}>
                    <I name={PROVENANCE[s].icon} size={10} /> {PROVENANCE[s].label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, alignItems: 'start' }}>
          {/* document body */}
          <div className="card">
            <div className="doc" style={{ padding: 18 }} dangerouslySetInnerHTML={{ __html: body }} />
          </div>

          {/* right rail: trust */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* lifecycle / actions */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <I name="ShieldCheck" size={14} color="var(--ai)" />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Доверие и статус</span>
              </div>
              <LifecycleBar status={a.status} />
              {!isDecision && (
                <div style={{ display: 'flex', gap: 7, marginTop: 12, flexWrap: 'wrap' }}>
                  <button className="btn" onClick={() => onCritique(a.id)} disabled={a.status === 'approved'}
                    style={{ fontSize: 12, opacity: a.status === 'approved' ? 0.5 : 1 }}>
                    <I name="Swords" size={13} /> Критика
                  </button>
                  {a.status !== 'approved' ? (
                    <Btn variant="ai" onClick={() => onApprove(a.id)} style={{ fontSize: 12 }}><I name="Check" size={13} /> Утвердить</Btn>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 600 }}><I name="CircleCheck" size={14} /> Утверждён</span>
                  )}
                </div>
              )}

              {/* critique result */}
              {a.critique && a.critique.length > 0 && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                    <I name="Swords" size={12} color="var(--amber)" /> Red-team: {a.critique.length} замечаний
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {a.critique.map((c, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.45 }}>
                        <I name="Dot" size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: 1 }} /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* decision record */}
            {(canDecide || isDecision) && (
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <I name="Gavel" size={14} color="var(--ink)" />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Решение</span>
                </div>
                {isDecision ? (
                  <div className="muted" style={{ fontSize: 12, lineHeight: 1.5 }}>
                    Это запись решения. Основания — в связях ниже.
                  </div>
                ) : !decOpen ? (
                  <>
                    <div className="muted" style={{ fontSize: 11.5, lineHeight: 1.5, marginBottom: 10 }}>
                      Задача утверждена. Зафиксируйте решение — оно свяжется с этой задачей как основанием.
                    </div>
                    <Btn variant="ai" onClick={() => setDecOpen(true)} style={{ fontSize: 12 }}><I name="Gavel" size={13} /> Зафиксировать решение</Btn>
                  </>
                ) : (
                  <>
                    <input autoFocus value={decTitle} onChange={(e) => setDecTitle(e.target.value)} placeholder="Что решили? Напр.: запускаем MVP без карты лояльности"
                      style={{ width: '100%', height: 38, padding: '0 11px', border: '1px solid var(--ai)', borderRadius: 9, fontSize: 12.5, outline: 'none', background: '#fff', marginBottom: 9 }} />
                    <div style={{ display: 'flex', gap: 7 }}>
                      <Btn variant="ai" onClick={() => decTitle.trim() && onCreateDecision(a, decTitle.trim())} style={{ fontSize: 12, opacity: decTitle.trim() ? 1 : 0.5 }}><I name="Check" size={13} /> Зафиксировать</Btn>
                      <button className="btn" style={{ fontSize: 12 }} onClick={() => setDecOpen(false)}>Отмена</button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* evidence */}
            <SectionCard title="Evidence" icon={<I name="Paperclip" size={13} color="var(--ink-3)" />}>
              {(a.evidence || []).length === 0 ? (
                <div className="muted" style={{ padding: '14px 16px', fontSize: 11.5 }}>Источников пока нет.</div>
              ) : a.evidence.map((e, i) => {
                const clickable = e.kind === 'artifact' && e.ref
                return (
                  <button key={i} className="row" onClick={() => clickable && onOpenArtifact(e.ref)} style={{ cursor: clickable ? 'pointer' : 'default' }}>
                    <TaskIcon name={EV_ICON[e.kind] || 'File'} size={24} bg="rgba(27,28,32,0.05)" color="var(--ink-2)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ellipsis" style={{ fontSize: 12 }}>{e.label}</div>
                      <div className="muted" style={{ fontSize: 10.5 }}>{e.kind}</div>
                    </div>
                    {clickable && <I name="ArrowUpRight" size={13} color="var(--ink-3)" />}
                  </button>
                )
              })}
            </SectionCard>

            {/* links */}
            {((a.links || []).length > 0 || incoming.length > 0) && (
              <SectionCard title="Связи" icon={<I name="Link2" size={13} color="var(--ink-3)" />}>
                {(a.links || []).map((l, i) => {
                  const t = linkOf(l.artifactId)
                  return (
                    <button key={`o${i}`} className="row" onClick={() => t && onOpenArtifact(t.id)}>
                      <I name="ArrowUpRight" size={14} color="var(--ai)" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ai)' }}>{LINK_TYPES[l.type]} </span>
                        <span className="ellipsis" style={{ fontSize: 12 }}>{t ? t.title : '—'}</span>
                      </div>
                    </button>
                  )
                })}
                {incoming.map((x, i) => (
                  <button key={`i${i}`} className="row" onClick={() => onOpenArtifact(x.id)}>
                    <I name="ArrowDownLeft" size={14} color="var(--ink-3)" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-3)' }}>используется в </span>
                      <span className="ellipsis" style={{ fontSize: 12 }}>{x.title}</span>
                    </div>
                  </button>
                ))}
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function LifecycleBar({ status }) {
  const flow = ['draft', 'in_review', 'approved', 'decided']
  const labels = { draft: 'Черновик', in_review: 'Ревью', approved: 'Утверждён', decided: 'Решено' }
  let idx = flow.indexOf(status)
  if (status === 'decided') idx = 3
  if (idx < 0) idx = 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {flow.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 12, height: 12, borderRadius: 999, background: i <= idx ? 'var(--ai)' : 'rgba(27,28,32,0.12)' }} />
            <span style={{ fontSize: 9.5, color: i <= idx ? 'var(--ink-2)' : 'var(--ink-3)', fontWeight: i === idx ? 700 : 500 }}>{labels[s]}</span>
          </div>
          {i < flow.length - 1 && <div style={{ flex: 1, height: 2, background: i < idx ? 'var(--ai)' : 'rgba(27,28,32,0.12)', marginBottom: 14 }} />}
        </React.Fragment>
      ))}
    </div>
  )
}

// ============ Artifacts table ============
export function Artifacts({ artifacts, onOpenArtifact }) {
  const [q, setQ] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const types = ['all', ...Object.keys(ARTIFACT_TYPES).filter((t) => artifacts.some((a) => a.type === t))]
  const filtered = artifacts.filter((a) =>
    (typeFilter === 'all' || a.type === typeFilter) &&
    (!q.trim() || a.title.toLowerCase().includes(q.toLowerCase()) || a.project.toLowerCase().includes(q.toLowerCase())))
  return (
    <div className="scroll">
      <div className="wrap" style={{ maxWidth: 1040 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.04em' }}>Задачи</div>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>{filtered.length} задач · связанный граф работы</div>
          </div>
          <div style={{ position: 'relative', width: 260 }}>
            <I name="Search" size={14} color="var(--ink-3)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск"
              style={{ width: '100%', height: 36, padding: '0 12px 0 32px', border: '1px solid var(--border)', borderRadius: 11, fontSize: 13, background: '#fff', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {types.map((t) => (
            <button key={t} className={`pill ${typeFilter === t ? 'on' : ''}`} onClick={() => setTypeFilter(t)}>
              {t === 'all' ? 'Все' : ARTIFACT_TYPES[t].label}
            </button>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,1.6fr) 1fr 150px 116px', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.42)' }}>
            {['Задача', 'Проект', 'Связи', 'Статус'].map((h) => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</div>
            ))}
          </div>
          {filtered.map((a) => {
            const ty = artifactTypeOf(a.type)
            const evN = (a.evidence || []).length
            const lkN = (a.links || []).length
            return (
              <button key={a.id} onClick={() => onOpenArtifact && onOpenArtifact(a.id)} style={{ background: 'none', width: '100%', textAlign: 'left', display: 'grid', gridTemplateColumns: 'minmax(260px,1.6fr) 1fr 150px 116px', padding: '12px 16px', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <TaskIcon name={ty.icon} size={28} bg={`${ty.color}1a`} color={ty.color} />
                  <div style={{ minWidth: 0 }}>
                    <div className="ellipsis" style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
                      {a.title}
                      {a.version > 1 && <span className="muted" style={{ fontSize: 10.5, fontWeight: 500 }}>v{a.version}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: ty.color }}>{ty.label}</span>
                      {(a.source || []).slice(0, 1).map((s) => PROVENANCE[s] && (
                        <span key={s} className="muted" style={{ fontSize: 10.5, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          · <I name={PROVENANCE[s].icon} size={10} /> {PROVENANCE[s].label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ellipsis muted" style={{ fontSize: 12 }}>{a.project}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: 'var(--ink-2)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title="evidence">
                    <I name="Paperclip" size={12} color={evN ? 'var(--ink-2)' : 'var(--ink-3)'} /> {evN}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }} title="связи">
                    <I name="Link2" size={12} color={lkN ? 'var(--ink-2)' : 'var(--ink-3)'} /> {lkN}
                  </span>
                </div>
                <div>{statusBadge(a.status)}</div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
