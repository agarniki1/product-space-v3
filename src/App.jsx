import React, { useState, useCallback } from 'react'
import Sidebar from './Sidebar.jsx'
import Chat from './Chat.jsx'
import { I, Orb } from './ui.jsx'
import { PMDashboard, Library, Projects, Artifacts, WorkflowRunner, ArtifactDetail } from './views/PMViews.jsx'
import { OwnerOverview, PmDetail } from './views/OwnerViews.jsx'
import { ProfilePanel, History } from './views/AccountViews.jsx'
import {
  ALL_TASKS, taskById, docTemplate, artifactTypeForTask, critiqueFor, briefContext,
  PM_PROFILE, PM_PROJECTS, PM_ARTIFACTS, PM_CHATS,
  OWNER_PROFILE, PMS, WORKFLOWS, workflowById,
} from './data.js'

let _uid = 0
const uid = () => `m${++_uid}`
let _aid = 0
const newArtifactId = () => `na${++_aid}`
let _sid = 0
const newSessionId = () => `s${++_sid}`

const PM_GREETING = 'С чем поработаем, Алексей?'
const OWNER_GREETING = 'Чем помочь, Арман?'

const CRUMBS = {
  dashboard: ['Главная'],
  library: ['Создать задачу'],
  artifacts: ['Задачи'],
  projects: ['Проекты'],
  chat: ['Чат'],
  history: ['История'],
  workflow: ['Workflow'],
  overview: ['Обзор команды'],
}

export default function App() {
  const [persona, setPersona] = useState('pm')
  const [view, setView] = useState('dashboard')
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [selectedPmId, setSelectedPmId] = useState(null)
  const [armedSkillIds, setArmedSkillIds] = useState([])
  const [chatMessages, setChatMessages] = useState([])
  const [createProjectId, setCreateProjectId] = useState(null)
  const [artifacts, setArtifacts] = useState(PM_ARTIFACTS)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(null)
  const [selectedArtifactId, setSelectedArtifactId] = useState(null)
  const [pmProfile, setPmProfile] = useState(PM_PROFILE)
  const [profileOpen, setProfileOpen] = useState(false)
  const [chatSessions, setChatSessions] = useState([])
  const [activeSessionId, setActiveSessionId] = useState(null)

  const isPm = persona === 'pm'
  const profile = isPm ? pmProfile : OWNER_PROFILE
  const createProject = PM_PROJECTS.find((p) => p.id === createProjectId) || null
  const greeting = createProject
    ? `Проект «${createProject.name}» — что произведём?`
    : (isPm ? PM_GREETING : OWNER_GREETING)
  const contextNote = isPm
    ? [pmProfile.role, pmProfile.product, createProject ? createProject.name : null].filter(Boolean).join(' · ')
    : null

  const switchPersona = (p) => {
    if (p === persona) return
    setPersona(p)
    setView(p === 'pm' ? 'dashboard' : 'overview')
    setSelectedProjectId(null)
    setSelectedPmId(null)
  }

  const onNav = (v) => {
    setView(v)
    if (v !== 'projects') setSelectedProjectId(null)
    if (v !== 'library' && v !== 'chat' && v !== 'workflow') setCreateProjectId(null)
  }

  const onArm = useCallback((id) => {
    setArmedSkillIds((cur) => (cur.includes(id) ? cur : [...cur, id]))
    setView('chat')
  }, [])

  const onDisarm = (id) => setArmedSkillIds((cur) => cur.filter((x) => x !== id))

  const onNewChat = () => {
    setChatMessages([])
    setArmedSkillIds([])
    setActiveSessionId(null)
    setView('chat')
  }

  // «Создать задачу» — вход в создание: сначала выбор, что произвести (библиотека-пикер),
  // затем чат с контекстом проекта. Чат и библиотека доступны только отсюда, не из top-level.
  const onCreate = () => {
    setCreateProjectId(null)
    setChatMessages([])
    setArmedSkillIds([])
    setActiveSessionId(null)
    setView('library')
  }

  // создание задачи изнутри проекта — несёт контекст проекта в чат и в генерацию
  const onCreateInProject = (projectId) => {
    setCreateProjectId(projectId)
    setChatMessages([])
    setArmedSkillIds([])
    setActiveSessionId(null)
    setView('library')
  }

  const onSaveProfile = (next) => { setPmProfile(next); setProfileOpen(false) }
  const onOpenSession = (id) => {
    const s = chatSessions.find((x) => x.id === id)
    if (!s) return
    setChatMessages(s.messages || [])
    setActiveSessionId(s.id)
    setArmedSkillIds([])
    setView('chat')
  }

  // создаёт персистентный задача в графе и возвращает его id (для workflow-хендоффов)
  const produceArtifact = useCallback((spec) => {
    const id = newArtifactId()
    setArtifacts((cur) => [{
      id, version: 1, when: 'только что', source: ['drafted'],
      evidence: [], links: [], ...spec,
    }, ...cur])
    return id
  }, [])

  const onOpenWorkflow = (workflowId, projectId) => {
    setCreateProjectId(projectId)
    setSelectedWorkflowId(workflowId)
    setView('workflow')
  }

  const onOpenArtifact = (id) => { setSelectedArtifactId(id); setView('artifact') }
  const updateArtifact = (id, patch) => setArtifacts((cur) => cur.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  const approveArtifact = (id) => updateArtifact(id, { status: 'approved' })
  const critiqueArtifact = (id) => setArtifacts((cur) => cur.map((a) => {
    if (a.id !== id) return a
    const source = (a.source || []).includes('reviewed') ? a.source : [...(a.source || []), 'reviewed']
    return { ...a, critique: critiqueFor(a.type), source, status: a.status === 'draft' ? 'in_review' : a.status }
  }))
  const createDecision = (from, title) => {
    const id = produceArtifact({
      type: 'decision', title, taskId: from.taskId, project: from.project,
      status: 'decided', source: ['manual'],
      evidence: [{ kind: 'artifact', label: from.title, ref: from.id }],
      links: [{ type: 'decided_by', artifactId: from.id }],
    })
    setSelectedArtifactId(id); setView('artifact')
  }

  const onSend = (text, ids) => {
    const sessionId = activeSessionId || newSessionId()
    if (!activeSessionId) setActiveSessionId(sessionId)
    const userMsg = { id: uid(), role: 'user', text }
    const thinkingId = uid()
    setChatMessages((cur) => [...cur, userMsg, { id: thinkingId, role: 'thinking' }])
    const armed = [...ids]
    setArmedSkillIds([])

    setTimeout(() => {
      const proj = PM_PROJECTS.find((p) => p.id === createProjectId)
      const brief = `${briefContext(pmProfile, proj)}${text}`

      let finalMsgs
      if (armed.length === 0) {
        const m = { id: uid(), role: 'assistant', text: 'Готов помочь. Добавь навык или промт через «+», чтобы я собрал задачу по структуре — PRD, JTBD, гипотезы и т.д.' }
        setChatMessages((cur) => { finalMsgs = [...cur.filter((x) => x.id !== thinkingId), m]; return finalMsgs })
      } else {
        const persisted = []
        const msgs = armed.map((tid) => {
          const t = taskById(tid)
          const aid = newArtifactId()
          if (proj) {
            persisted.push({
              id: aid, type: artifactTypeForTask(tid), title: t ? t.name : 'Задача',
              taskId: tid, project: proj.name, when: 'только что',
              status: 'draft', version: 1, source: ['drafted'], evidence: [], links: [],
            })
          }
          return {
            id: uid(), role: 'assistant', type: 'artifact', taskId: tid,
            title: t ? t.name : 'Задача', project: proj ? proj.name : null,
            artifactId: proj ? aid : null, docHtml: docTemplate(tid, brief),
          }
        })
        if (persisted.length) setArtifacts((cur) => [...persisted, ...cur])
        setChatMessages((cur) => { finalMsgs = [...cur.filter((x) => x.id !== thinkingId), ...msgs]; return finalMsgs })
      }

      // upsert session (история)
      const title = armed.length
        ? armed.map((tid) => (taskById(tid) || {}).name).filter(Boolean).join(' + ')
        : (text.slice(0, 60) || 'Новый чат')
      setChatSessions((cur) => {
        const rest = cur.filter((s) => s.id !== sessionId)
        return [{
          id: sessionId, title, when: 'только что',
          taskIds: armed, projectName: proj ? proj.name : null,
          messages: finalMsgs || [],
        }, ...rest]
      })
    }, 1100)
  }

  const selectedProject = PM_PROJECTS.find((p) => p.id === selectedProjectId) || null
  const selectedPm = PMS.find((p) => p.id === selectedPmId) || null

  const selectedArtifact = artifacts.find((x) => x.id === selectedArtifactId) || null

  const crumb = view === 'artifact' && selectedArtifact
      ? [selectedArtifact.project || 'Задачи', selectedArtifact.title]
    : view === 'workflow' && selectedWorkflowId
      ? ['Проекты', createProject ? createProject.name : '', (workflowById(selectedWorkflowId) || {}).name].filter(Boolean)
    : selectedProject ? ['Проекты', selectedProject.name]
    : selectedPm ? ['Обзор команды', selectedPm.name]
    : (CRUMBS[view] || [view])

  let content = null
  if (isPm) {
    if (view === 'dashboard') content = (
      <PMDashboard
        profile={PM_PROFILE} projects={PM_PROJECTS} artifacts={artifacts}
        onArm={onArm} onNav={onNav} onCreate={onCreate}
        onOpenProject={(id) => { setSelectedProjectId(id); setView('projects') }}
        onOpenArtifact={onOpenArtifact}
      />
    )
    else if (view === 'library') content = <Library onArm={onArm} />
    else if (view === 'history') content = <History sessions={chatSessions} onOpenSession={onOpenSession} />
    else if (view === 'artifacts') content = <Artifacts artifacts={artifacts} onOpenArtifact={onOpenArtifact} />
    else if (view === 'artifact') content = (
      <ArtifactDetail
        artifact={selectedArtifact} allArtifacts={artifacts}
        onBack={() => { selectedArtifact && selectedArtifact.project ? (setSelectedProjectId(PM_PROJECTS.find((p) => p.name === selectedArtifact.project)?.id || null), setView('projects')) : setView('artifacts') }}
        onApprove={approveArtifact} onCritique={critiqueArtifact}
        onCreateDecision={createDecision} onOpenArtifact={onOpenArtifact}
      />
    )
    else if (view === 'workflow') content = (
      <WorkflowRunner
        workflow={workflowById(selectedWorkflowId)} project={createProject}
        onProduce={produceArtifact}
        onBack={() => { setSelectedProjectId(createProjectId); setSelectedWorkflowId(null); setView('projects') }}
      />
    )
    else if (view === 'projects') content = (
      <Projects
        projects={PM_PROJECTS} artifacts={artifacts} selectedId={selectedProjectId}
        onOpen={(id) => setSelectedProjectId(id)} onBack={() => setSelectedProjectId(null)} onArm={onArm}
        onCreateInProject={onCreateInProject}
        onOpenWorkflow={(wid) => onOpenWorkflow(wid, selectedProjectId)}
        onOpenArtifact={onOpenArtifact}
      />
    )
    else if (view === 'chat') content = (
      <Chat
        messages={chatMessages} armedSkillIds={armedSkillIds}
        onSend={onSend} onDisarm={onDisarm} onOpenLibrary={() => setView("library")} greeting={greeting} contextNote={contextNote}
      />
    )
  } else {
    if (view === 'overview') content = selectedPm ? (
      <PmDetail pm={selectedPm} onBack={() => setSelectedPmId(null)} onArm={onArm} />
    ) : (
      <OwnerOverview profile={OWNER_PROFILE} pms={PMS} onArm={onArm} onNav={onNav}
        onOpenPm={(id) => setSelectedPmId(id)} />
    )
    else if (view === 'library') content = <Library onArm={onArm} />
    else if (view === 'chat') content = (
      <Chat
        messages={chatMessages} armedSkillIds={armedSkillIds}
        onSend={onSend} onDisarm={onDisarm} onOpenLibrary={() => setView("library")} greeting={greeting} contextNote={contextNote}
      />
    )
  }

  return (
    <div className="app">
      <Sidebar
        persona={persona} view={view} profile={profile}
        projects={PM_PROJECTS} pms={PMS} taskCount={ALL_TASKS.length}
        onNav={onNav} onCreate={onCreate}
        onOpenProject={(id) => { setSelectedProjectId(id); setView('projects') }}
        onOpenPm={(id) => { setSelectedPmId(id); setView('overview') }}
        onOpenProfile={() => setProfileOpen(true)}
      />
      <div className="main">
        <div className="topbar">
          <div className="crumb">
            {crumb.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="sep"><I name="ChevronRight" size={13} /></span>}
                <span style={{ color: i === crumb.length - 1 ? 'var(--ink)' : 'var(--ink-3)' }}>{c}</span>
              </React.Fragment>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <div className="persona">
            <button className={isPm ? 'on' : ''} onClick={() => switchPersona('pm')}>
              <I name="User" size={13} /> Продакт
            </button>
            <button className={!isPm ? 'on' : ''} onClick={() => switchPersona('owner')}>
              <I name="Users" size={13} /> Owner
            </button>
          </div>
        </div>
        {view === 'chat' ? content : (
          <div className="scroll">
            <div className="wrap">{content}</div>
          </div>
        )}
      </div>
      {profileOpen && isPm && (
        <ProfilePanel profile={pmProfile} onSave={onSaveProfile} onClose={() => setProfileOpen(false)} />
      )}
    </div>
  )
}
