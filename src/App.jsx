import React, { useState, useCallback } from 'react'
import Sidebar from './Sidebar.jsx'
import Chat from './Chat.jsx'
import { I, Orb } from './ui.jsx'
import { PMDashboard, Library, Projects, Artifacts, WorkflowRunner } from './views/PMViews.jsx'
import { OwnerOverview, PmDetail } from './views/OwnerViews.jsx'
import {
  ALL_TASKS, taskById, docTemplate, artifactTypeForTask,
  PM_PROFILE, PM_PROJECTS, PM_ARTIFACTS, PM_CHATS,
  OWNER_PROFILE, PMS, WORKFLOWS, workflowById,
} from './data.js'

let _uid = 0
const uid = () => `m${++_uid}`
let _aid = 0
const newArtifactId = () => `na${++_aid}`

const PM_GREETING = 'С чем поработаем, Алексей?'
const OWNER_GREETING = 'Чем помочь, Арман?'

const CRUMBS = {
  dashboard: ['Главная'],
  library: ['Создать артефакт'],
  artifacts: ['Артефакты'],
  projects: ['Проекты'],
  chat: ['Чат'],
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

  const isPm = persona === 'pm'
  const profile = isPm ? PM_PROFILE : OWNER_PROFILE
  const createProject = PM_PROJECTS.find((p) => p.id === createProjectId) || null
  const greeting = createProject
    ? `Проект «${createProject.name}» — что произведём?`
    : (isPm ? PM_GREETING : OWNER_GREETING)

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
    setView('chat')
  }

  // «Создать артефакт» — вход в создание: сначала выбор, что произвести (библиотека-пикер),
  // затем чат с контекстом проекта. Чат и библиотека доступны только отсюда, не из top-level.
  const onCreate = () => {
    setCreateProjectId(null)
    setChatMessages([])
    setArmedSkillIds([])
    setView('library')
  }

  // создание артефакта изнутри проекта — несёт контекст проекта в чат и в генерацию
  const onCreateInProject = (projectId) => {
    setCreateProjectId(projectId)
    setChatMessages([])
    setArmedSkillIds([])
    setView('library')
  }

  // создаёт персистентный артефакт в графе и возвращает его id (для workflow-хендоффов)
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

  const onSend = (text, ids) => {
    const userMsg = { id: uid(), role: 'user', text }
    const thinkingId = uid()
    setChatMessages((cur) => [...cur, userMsg, { id: thinkingId, role: 'thinking' }])
    const armed = [...ids]
    setArmedSkillIds([])

    setTimeout(() => {
      const proj = PM_PROJECTS.find((p) => p.id === createProjectId)
      const brief = proj ? `[Проект: ${proj.name} · ${proj.goal}] ${text}` : text

      if (armed.length === 0) {
        setChatMessages((cur) => [...cur.filter((m) => m.id !== thinkingId), {
          id: uid(), role: 'assistant',
          text: 'Готов помочь. Добавь навык или промт через «+», чтобы я собрал артефакт по структуре — PRD, JTBD, гипотезы и т.д.',
        }])
        return
      }

      const persisted = []
      const msgs = armed.map((tid) => {
        const t = taskById(tid)
        const aid = newArtifactId()
        if (proj) {
          persisted.push({
            id: aid, type: artifactTypeForTask(tid), title: t ? t.name : 'Артефакт',
            taskId: tid, project: proj.name, when: 'только что',
            status: 'draft', version: 1, source: ['drafted'], evidence: [], links: [],
          })
        }
        return {
          id: uid(), role: 'assistant', type: 'artifact', taskId: tid,
          title: t ? t.name : 'Артефакт', project: proj ? proj.name : null,
          artifactId: proj ? aid : null, docHtml: docTemplate(tid, brief),
        }
      })

      if (persisted.length) setArtifacts((cur) => [...persisted, ...cur])
      setChatMessages((cur) => [...cur.filter((m) => m.id !== thinkingId), ...msgs])
    }, 1100)
  }

  const selectedProject = PM_PROJECTS.find((p) => p.id === selectedProjectId) || null
  const selectedPm = PMS.find((p) => p.id === selectedPmId) || null

  const crumb = view === 'workflow' && selectedWorkflowId
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
      />
    )
    else if (view === 'library') content = <Library onArm={onArm} />
    else if (view === 'artifacts') content = <Artifacts artifacts={artifacts} />
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
      />
    )
    else if (view === 'chat') content = (
      <Chat
        messages={chatMessages} armedSkillIds={armedSkillIds}
        onSend={onSend} onDisarm={onDisarm} onOpenLibrary={() => setView('library')} greeting={greeting}
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
        onSend={onSend} onDisarm={onDisarm} onOpenLibrary={() => setView('library')} greeting={greeting}
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
    </div>
  )
}
