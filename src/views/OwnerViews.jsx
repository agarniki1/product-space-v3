import React from 'react'
import { I, Orb, TaskIcon, SectionCard, Badge, Progress, Avatar, Stat, Btn } from '../ui.jsx'
import { PMS, STATUS, HERO, taskById } from '../data.js'

const statusBadge = (s) => {
  const st = STATUS[s] || STATUS.gray
  return <Badge cls={st ? st.cls : 'gray'}>{st ? st.label : s}</Badge>
}

// ============ Owner / CPO team overview ============
export function OwnerOverview({ profile, pms, onOpenPm, onArm, onNav }) {
  const allProducts = pms.flatMap((pm) => pm.products.map((p) => ({ ...p, owner: pm.name, ownerInitials: pm.initials, ownerColor: pm.color })))
  const atRisk = pms.filter((pm) => pm.status === 'at_risk' || pm.status === 'blocked').length
  const totalArtifacts = pms.reduce((s, pm) => s + pm.artifacts, 0)
  const hero = HERO.slice(0, 3).map((id) => taskById(id)).filter(Boolean)

  return (
    <div className="scroll">
      <div className="wrap">
        <div className="card" style={{ padding: 22, marginBottom: 18, background: 'linear-gradient(180deg, rgba(111,127,242,0.08), rgba(255,255,255,0.72) 40%)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
            <Orb size={46} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em' }}>Обзор команды</div>
              <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Статус по каждому продакту и портфель продуктов. Можно работать с AI напрямую.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
            <Stat value={pms.length} label="Продактов" />
            <Stat value={allProducts.length} label="Продуктов" />
            <Stat value={totalArtifacts} label="Артефактов" />
            <Stat value={atRisk} label="Требуют внимания" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <I name="Sparkles" size={14} color="var(--ai)" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Быстрый старт</span>
            <button className="muted" style={{ marginLeft: 'auto', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }} onClick={() => onNav('library')}>
              Вся библиотека <I name="ArrowRight" size={12} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {hero.map((t) => (
              <button key={t.id} className="tile" onClick={() => onArm(t.id)}>
                <TaskIcon name={t.icon} size={30} />
                <div style={{ minWidth: 0 }}>
                  <div className="ellipsis" style={{ fontSize: 12.5, fontWeight: 600 }}>{t.name}</div>
                  <div className="ellipsis muted" style={{ fontSize: 11 }}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 18 }}>
          <SectionCard title="Продакты и статус" icon={<I name="Users" size={13} color="var(--ink-3)" />}>
            {pms.map((pm) => (
              <button key={pm.id} className="row" onClick={() => onOpenPm(pm.id)} style={{ alignItems: 'flex-start', padding: '14px 16px' }}>
                <Avatar initials={pm.initials} color={pm.color} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{pm.name}</span>
                    <span className="muted" style={{ fontSize: 11 }}>· {pm.area}</span>
                    {statusBadge(pm.status)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>{pm.summary}</div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 5 }}>{pm.products.length} продукта · {pm.artifacts} артефактов · {pm.lastActive}</div>
                </div>
                <I name="ArrowRight" size={15} color="var(--ink-3)" style={{ marginTop: 4 }} />
              </button>
            ))}
          </SectionCard>
        </div>

        <SectionCard title="Портфель продуктов" icon={<I name="Layers" size={13} color="var(--ink-3)" />}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {allProducts.map((p, i) => (
              <div key={i} style={{ padding: 16, borderRight: i % 2 === 0 ? '1px solid var(--border)' : 'none', borderBottom: i < allProducts.length - (allProducts.length % 2 === 0 ? 2 : 1) ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Avatar initials={p.ownerInitials} color={p.ownerColor} size={16} style={{ fontSize: 8 }} />
                      <span className="muted" style={{ fontSize: 11 }}>{p.owner} · {p.nsm}</span>
                    </div>
                  </div>
                  {statusBadge(p.status)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Progress value={p.progress} />
                  <span className="muted" style={{ fontSize: 11, fontWeight: 600 }}>{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

// ============ PM detail (drill-down from owner) ============
export function PmDetail({ pm, onBack, onArm }) {
  if (!pm) return null
  return (
    <div className="scroll">
      <div className="wrap">
        <button className="btn" style={{ marginBottom: 18 }} onClick={onBack}><I name="ArrowLeft" size={14} /> Обзор команды</button>
        <div className="card" style={{ padding: 22, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <Avatar initials={pm.initials} color={pm.color} size={52} style={{ fontSize: 18 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>{pm.name}</h1>
                {statusBadge(pm.status)}
              </div>
              <div className="muted" style={{ fontSize: 12.5, marginBottom: 8 }}>{pm.area} · активность: {pm.lastActive}</div>
              <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.6, maxWidth: 640 }}>{pm.summary}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            <Stat value={pm.products.length} label="Продуктов" />
            <Stat value={pm.artifacts} label="Артефактов" />
            <Stat value={pm.chats} label="Чатов" />
          </div>
        </div>

        <SectionCard title="Продукты продакта" icon={<I name="Briefcase" size={13} color="var(--ink-3)" />}>
          {pm.products.map((p, i) => (
            <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
              <TaskIcon name="Target" size={30} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  {statusBadge(p.status)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Progress value={p.progress} />
                  <span className="muted" style={{ fontSize: 11, fontWeight: 600 }}>{p.progress}%</span>
                </div>
                <div className="muted" style={{ fontSize: 11, marginTop: 5 }}>North Star: {p.nsm}</div>
              </div>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  )
}
