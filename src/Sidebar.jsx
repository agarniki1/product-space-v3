import React from 'react'
import { I, Orb, Avatar } from './ui.jsx'

function NavItem({ icon, label, active, badge, onClick }) {
  return (
    <button className={`nav-item ${active ? 'on' : ''}`} onClick={onClick}>
      <span className="ico"><I name={icon} size={16} /></span>
      <span className="lbl">{label}</span>
      {badge !== undefined && <span className="badge">{badge}</span>}
    </button>
  )
}

export default function Sidebar({ persona, view, profile, projects, pms, taskCount, onNav, onCreate, onOpenProject, onOpenPm, onOpenProfile }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Orb size={34} />
        <div style={{ minWidth: 0 }}>
          <div className="tt">Product Space</div>
          <div className="sub">{persona === 'owner' ? 'Owner / CPO' : 'Продакт'} · Revolut</div>
        </div>
      </div>

      <button className="nav-new" onClick={onCreate}>
        <I name="Plus" size={14} strokeWidth={2.1} /> Создать задачу
      </button>

      {persona === 'pm' ? (
        <>
          <div style={{ padding: '0 2px' }}>
            <NavItem icon="House" label="Главная" active={view === 'dashboard'} onClick={() => onNav('dashboard')} />
            <NavItem icon="Briefcase" label="Проекты" active={view === 'projects'} onClick={() => onNav('projects')} />
            <NavItem icon="Layers" label="Задачи" active={view === 'artifacts'} onClick={() => onNav('artifacts')} />
            <NavItem icon="History" label="История" active={view === 'history'} onClick={() => onNav('history')} />
          </div>

          <div className="scroll" style={{ marginTop: 6 }}>
            <div className="nav-label">Проекты</div>
            <div style={{ padding: '0 2px' }}>
              {projects.map((p) => (
                <button
                  key={p.id}
                  className="nav-item"
                  onClick={() => onOpenProject(p.id)}
                >
                  <span className="ico"><I name="Folder" size={15} /></span>
                  <span className="lbl">{p.name}</span>
                  <span className="badge">{p.progress}%</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ padding: '0 2px' }}>
            <NavItem icon="LayoutDashboard" label="Обзор команды" active={view === 'overview'} onClick={() => onNav('overview')} />
            <NavItem icon="Layers" label="Задачи" active={view === 'artifacts'} onClick={() => onNav('artifacts')} />
          </div>

          <div className="scroll" style={{ marginTop: 6 }}>
            <div className="nav-label">Продакты</div>
            <div style={{ padding: '0 2px' }}>
              {pms.map((pm) => (
                <button key={pm.id} className="nav-item" onClick={() => onOpenPm(pm.id)}>
                  <span className="ico"><Avatar initials={pm.initials} color={pm.color} size={20} style={{ fontSize: 9 }} /></span>
                  <span className="lbl">{pm.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button className="sb-user" style={{ marginTop: 8 }} onClick={onOpenProfile}>
        <Avatar initials={profile.initials} color={profile.color} size={30} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }} className="ellipsis">{profile.name}</div>
            {profile.plan && (
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '.04em', color: '#fff', background: 'linear-gradient(135deg, var(--ai), #8b6cf0)', padding: '1px 6px', borderRadius: 5, flexShrink: 0 }}>
                {profile.plan.toUpperCase()}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11 }} className="muted ellipsis">{profile.role}</div>
        </div>
        <I name="Settings2" size={14} color="var(--ink-3)" />
      </button>
    </aside>
  )
}
