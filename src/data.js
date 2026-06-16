// ============ stages (PM lifecycle) ============
export const STAGES = [
  { id: 'discovery', label: 'Дискавери', color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'research', label: 'Исследования', color: '#2563EB', bg: '#DBEAFE' },
  { id: 'delivery', label: 'Деливери', color: '#C2410C', bg: '#FEE9DF' },
  { id: 'proto', label: 'Прототипы', color: '#9333EA', bg: '#F3E8FF' },
  { id: 'analytics', label: 'Аналитика', color: '#16A34A', bg: '#DCFCE7' },
  { id: 'strategy', label: 'Стратегия', color: '#D97706', bg: '#FEF3C7' },
]
export const stageOf = (id) => STAGES.find((s) => s.id === id) || STAGES[0]

// ============ 20 skills ============
export const SKILLS = [
  { id: 's1', name: 'Problem Framing', stage: 'discovery', level: 'middle+', icon: 'Target', desc: 'Размытая идея → problem statement, кого болит, почему важно сейчас.' },
  { id: 's2', name: 'Opportunity Solution Tree', stage: 'discovery', level: 'senior+', icon: 'GitBranch', desc: 'Outcome → opportunities → solutions → эксперименты (Torres).' },
  { id: 's3', name: 'JTBD Extractor', stage: 'discovery', level: 'senior+', icon: 'Lightbulb', desc: 'Интервью → jobs, силы (push/pull/anxiety/habit), desired outcomes.' },
  { id: 's4', name: 'Competitive Teardown', stage: 'discovery', level: 'middle+', icon: 'Flag', desc: 'Конкурент → фичи, позиционирование, гэпы, чем отстраиваемся.' },
  { id: 's5', name: 'Market Sizing', stage: 'discovery', level: 'lead', icon: 'Globe', desc: 'Сегмент → TAM/SAM/SOM с явными допущениями и источниками.' },
  { id: 's6', name: 'Interview Guide', stage: 'research', level: 'middle+', icon: 'MessageSquare', desc: 'Цель → гайд с воронкой вопросов, без leading.' },
  { id: 's7', name: 'Survey Designer', stage: 'research', level: 'senior+', icon: 'ClipboardList', desc: 'Цель → анкета + проверка на NPS-шкалу, leading, демографию.' },
  { id: 's8', name: 'Research Synthesis', stage: 'research', level: 'senior+', icon: 'Layers', desc: 'Транскрипты → темы, инсайты, ранжирование по частоте × импакту.' },
  { id: 's9', name: 'Persona / Segment', stage: 'research', level: 'middle+', icon: 'Users', desc: 'Данные → сегменты по поведению и мотивации, а не демографии.' },
  { id: 's10', name: 'PRD / Spec', stage: 'delivery', level: 'middle+', icon: 'FileText', desc: 'Проблема → goals/non-goals, требования, метрики, acceptance criteria.' },
  { id: 's11', name: 'User Stories + AC', stage: 'delivery', level: 'middle', icon: 'SquareCheckBig', desc: 'Фича → истории + критерии приёмки (given-when-then).' },
  { id: 's12', name: 'Tech Requirements', stage: 'delivery', level: 'senior+', icon: 'Cpu', desc: 'Спека → требования к разработке, контракт API, зависимости.' },
  { id: 's13', name: 'Edge Case & Risk', stage: 'delivery', level: 'senior+', icon: 'ShieldCheck', desc: 'Фича → что упустили, failure modes, риски.' },
  { id: 's14', name: 'Release Notes', stage: 'delivery', level: 'middle', icon: 'Megaphone', desc: 'Изменения → внутренние ноты + внешний релиз под аудиторию.' },
  { id: 's15', name: 'Prototype Builder', stage: 'proto', level: 'middle+', icon: 'Smartphone', desc: 'Спека / флоу → интерактивный HTML-прототип (кликабельный).' },
  { id: 's16', name: 'User Flow Mapper', stage: 'proto', level: 'middle+', icon: 'Workflow', desc: 'Сценарий → флоу / диаграмма состояний, включая ошибки.' },
  { id: 's17', name: 'Metrics Tree', stage: 'analytics', level: 'senior+', icon: 'TrendingUp', desc: 'Цель → North Star + input-метрики + контр-метрики.' },
  { id: 's18', name: 'Experiment Designer', stage: 'analytics', level: 'senior+', icon: 'TestTube', desc: 'Гипотеза → дизайн A/B: метрики, выборка, длительность, стоп-критерии.' },
  { id: 's19', name: 'Funnel Diagnosis', stage: 'analytics', level: 'senior+', icon: 'Funnel', desc: 'Данные воронки → где течёт + ранжированные гипотезы причин.' },
  { id: 's20', name: 'Strategy + Roadmap', stage: 'strategy', level: 'lead', icon: 'Map', desc: 'Контекст → стратегия, Now/Next/Later, приоритизация (RICE), OKR.' },
].map((s) => ({ ...s, entity: 'skill' }))

// ============ 20 prompts ============
export const PROMPTS = [
  { id: 'p1', name: 'Фидбэк → задачи', stage: 'research', icon: 'Inbox', desc: 'Куча отзывов → топ-проблемы, ранжированные по частоте и тяжести.',
    text: 'Вот сырой фидбэк пользователей: [вставь]. Выдели топ-проблемы, сгруппируй по темам, отранжируй по частоте × тяжести. Для каждой — строка проблемы и цитата.' },
  { id: 'p2', name: 'Критика своего PRD', stage: 'delivery', icon: 'ShieldAlert', desc: 'Скептичный staff-инженер ищет дыры в твоём PRD.',
    text: 'Ты скептичный staff-инженер и придирчивый дизайнер. Вот PRD: [вставь]. Найди дыры: непокрытые кейсы, нечёткие требования, скрытые допущения, риски. Не хвали.' },
  { id: 'p3', name: 'Чистка leading-вопросов', stage: 'research', icon: 'Eraser', desc: 'Переписать вопросы анкеты в нейтральные, без подсказок.',
    text: 'Перепиши эти вопросы в нейтральные, без подсказок и double-barreled. Для каждого: было → стало → в чём была проблема. Вопросы: [вставь].' },
  { id: 'p4', name: 'Почему просела метрика', stage: 'analytics', icon: 'TrendingDown', desc: '10 гипотез падения метрики + как быстро проверить.',
    text: 'Метрика [название] упала на [X% за период]. Контекст: [что знаем]. Дай 10 гипотез причин (продуктовые / технические / внешние / сезонные). Для каждой — как быстро проверить.' },
  { id: 'p5', name: 'RICE по списку фич', stage: 'strategy', icon: 'ListOrdered', desc: 'Оценка и приоритизация фич по RICE.',
    text: 'Оцени фичи по RICE (Reach, Impact, Confidence, Effort). Где данных нет — отметь допущение явно. Дай таблицу и итоговый порядок. Фичи: [вставь].' },
  { id: 'p6', name: 'Фича → user stories', stage: 'delivery', icon: 'SquareCheckBig', desc: 'Разбить фичу на истории с критериями приёмки.',
    text: 'Разбей фичу на user stories с критериями приёмки (given-when-then). Включи happy path и основные edge cases. Фича: [вставь].' },
  { id: 'p7', name: 'Подготовка к 1:1', stage: 'strategy', icon: 'Handshake', desc: 'Аргументы и ответы на возражения стейкхолдера.',
    text: 'Мне нужно убедить [роль] в [решение]. Его приоритеты: [...]. Дай 3 аргумента под его картину мира, 3 вероятных возражения и ответы на них.' },
  { id: 'p8', name: 'Девил-адвокат', stage: 'discovery', icon: 'Swords', desc: 'Почему это решение провалится + дешёвая альтернатива.',
    text: 'Решение: [вставь]. Сыграй жёсткого девил-адвоката: почему провалится, что недооцениваем, какая более дешёвая альтернатива решает ту же проблему.' },
  { id: 'p9', name: 'Док → exec-summary', stage: 'strategy', icon: 'AlignLeft', desc: 'Сжать длинный документ в 5 строк для руководителя.',
    text: 'Сожми в 5 строк для занятого руководителя: суть, почему важно, что просим, риск, следующий шаг. Без воды. Док: [вставь].' },
  { id: 'p10', name: 'Гипотеза эксперимента', stage: 'analytics', icon: 'TestTube', desc: 'Оформить идею как проверяемую гипотезу.',
    text: 'Оформи как гипотезу: «Мы верим, что [изменение] приведёт к [эффект] для [сегмент]. Поймём по [метрика]. Подтверждение если [порог]». Контекст: [вставь].' },
  { id: 'p11', name: 'Разбор конкурента', stage: 'discovery', icon: 'Flag', desc: 'Позиционирование, сильные/слабые места, чем отстроиться.',
    text: 'Конкурент: [URL или описание]. Дай: позиционирование, на кого таргетится, сильные фичи, слабые места, чем мы отстроимся. Коротко.' },
  { id: 'p12', name: 'Интервью → боли и цитаты', stage: 'research', icon: 'MessageSquare', desc: 'Вытащить боли, исходы и дословные цитаты из транскрипта.',
    text: 'Транскрипт интервью: [вставь]. Вытащи боли, желаемые исходы и 3-5 дословных цитат. Отметь, где респондент противоречит сам себе.' },
  { id: 'p13', name: 'Вопросы под гипотезу', stage: 'discovery', icon: 'HelpCircle', desc: '8 вопросов, проверяющих гипотезу, а не подтверждающих.',
    text: 'Гипотеза дискавери: [вставь]. Дай 8 вопросов для интервью, которые её проверяют (а не подтверждают), про прошлый опыт, а не гипотетику.' },
  { id: 'p14', name: 'Оценка идеи по DVF', stage: 'discovery', icon: 'Scale', desc: 'Desirability / viability / feasibility + дешёвая проверка.',
    text: 'Оцени идею по desirability / viability / feasibility. По каждому: ключевой риск и самый дешёвый способ проверить до разработки. Идея: [вставь].' },
  { id: 'p15', name: 'Запрос → проблема + scope', stage: 'discovery', icon: 'Crosshair', desc: 'Превратить запрос стейкхолдера в чёткую проблему и MVP.',
    text: 'Стейкхолдер просит: [вставь]. Переформулируй в проблему (что и для кого), отдели проблему от решения, предложи scope MVP и что за рамки.' },
  { id: 'p16', name: 'Edge cases для флоу', stage: 'delivery', icon: 'GitFork', desc: 'Граничные случаи флоу + что показываем юзеру.',
    text: 'Флоу: [опиши]. Перечисли edge cases: пустые состояния, ошибки сети, отмены, гонки, права, лимиты, оффлайн. Что показываем пользователю в каждом.' },
  { id: 'p17', name: 'Провокация для стратегии', stage: 'strategy', icon: 'Zap', desc: '3 спорных тезиса, которые заставят пересмотреть план.',
    text: 'Дай 3 спорных, но защитимых тезиса про [продукт/рынок], которые заставят команду пересмотреть план. Под каждый — на чём держится.' },
  { id: 'p18', name: 'Trade-off двух решений', stage: 'delivery', icon: 'Scale', desc: 'Сравнить два варианта таблицей + рекомендация.',
    text: 'Сравни два варианта: [A] vs [B]. Таблица по осям: скорость, стоимость, риск, обратимость, влияние на UX, долг. Дай рекомендацию и при каком условии она меняется.' },
  { id: 'p19', name: 'Чеклист перед релизом', stage: 'delivery', icon: 'ListChecks', desc: 'Аналитика, фича-флаг, rollback, мониторинг первых 24ч.',
    text: 'Фича: [вставь]. Собери чеклист перед релизом: события и аналитика, фича-флаг, rollback-план, edge cases, доступность, перформанс, тексты, мониторинг 24ч.' },
  { id: 'p20', name: 'Тех-решение для не-тех', stage: 'delivery', icon: 'Languages', desc: 'Объяснить техническое решение без жаргона.',
    text: 'Объясни [техническое решение/ограничение] для [продажи / саппорт / руководство]: что это, почему так, что значит для них, без жаргона. 4-5 предложений.' },
].map((p) => ({ ...p, entity: 'prompt' }))

export const ALL_TASKS = [...SKILLS, ...PROMPTS]
export const taskById = (id) => ALL_TASKS.find((t) => t.id === id)

// hero quick-start skills (shown on dashboard + chat)
export const HERO = ['s10', 's3', 's19', 's15', 's20', 's7']

// ============ PM persona ============
export const PM_PROFILE = { name: 'Алексей Романов', initials: 'AR', role: 'Product Manager', company: 'Revolut', color: '#f47b42' }

export const PM_PROJECTS = [
  { id: 'pr1', name: 'Debit card · DACH', product: 'Payments', status: 'active', progress: 42,
    nsm: 'Активированные карты', updated: 'Сегодня', artifacts: 3,
    goal: 'Запустить дебетовую карту в Германии и Австрии с локализованным CX.',
    audience: 'Резиденты DE/AT, 25–40, digital-first, уже пользуются необанками',
    constraints: 'KYC-провайдер ограничивает онбординг; требования BaFin к локализации' },
  { id: 'pr2', name: 'Onboarding v2', product: 'Growth', status: 'active', progress: 61,
    nsm: 'Time-to-value', updated: 'Вчера', artifacts: 5,
    goal: 'Сократить time-to-value с 7 до 3 дней.',
    audience: 'Новые пользователи Revolut в первые 7 дней после регистрации',
    constraints: 'Зависимость от KYC-провайдера; нельзя ломать core-флоу оплаты' },
  { id: 'pr3', name: 'Subscriptions · SME', product: 'Payments', status: 'planning', progress: 18,
    nsm: 'MRR от подписок', updated: '3 дн. назад', artifacts: 0,
    goal: 'Проверить гипотезы подписочной модели для SME-сегмента.',
    audience: 'SME-компании 1–50 сотрудников, уже держат счёт в Revolut',
    constraints: 'Спрос не подтверждён; гипотеза на ранней стадии дискавери' },
]

// ---- artifact model ----
// тип артефакта: label + иконка + цвет (для графа и карточек)
export const ARTIFACT_TYPES = {
  research_note:      { label: 'Research note',       icon: 'NotebookPen',  color: '#2563EB' },
  insight:            { label: 'Инсайт',              icon: 'Lightbulb',    color: '#16A34A' },
  problem_statement:  { label: 'Problem statement',   icon: 'Target',       color: '#7C3AED' },
  jtbd:               { label: 'JTBD',                icon: 'Users',        color: '#7C3AED' },
  prd:                { label: 'PRD / Spec',          icon: 'FileText',     color: '#C2410C' },
  strategy:           { label: 'Стратегия',           icon: 'Compass',      color: '#D97706' },
  metric_tree:        { label: 'Метрик-дерево',       icon: 'GitBranch',    color: '#16A34A' },
  experiment:         { label: 'Эксперимент',         icon: 'FlaskConical', color: '#16A34A' },
  prototype:          { label: 'Прототип',            icon: 'AppWindow',    color: '#9333EA' },
  decision:           { label: 'Решение',             icon: 'Gavel',        color: '#1b1c20' },
  stakeholder_update: { label: 'Stakeholder update',  icon: 'Megaphone',    color: '#D97706' },
}
export const artifactTypeOf = (t) => ARTIFACT_TYPES[t] || ARTIFACT_TYPES.research_note

// типы связей между артефактами
export const LINK_TYPES = {
  derived_from: 'выведен из',
  backed_by: 'подкреплён',
  supersedes: 'заменяет',
  prototype_of: 'прототип для',
  tested_by: 'проверяется',
  decided_by: 'решение по',
}

// provenance — чем порождён артефакт (без имён моделей в UI)
export const PROVENANCE = {
  web:       { label: 'Исследовано в вебе', icon: 'Globe' },
  synthesis: { label: 'Собрано из артефактов', icon: 'Combine' },
  drafted:   { label: 'Черновик AI', icon: 'Sparkles' },
  reviewed:  { label: 'Проверено критикой', icon: 'ShieldCheck' },
  manual:    { label: 'Вручную', icon: 'PenLine' },
}

// evidence kind shape: { kind: 'url'|'file'|'artifact'|'metric', label, ref? }
// link shape:          { type: <LINK_TYPES key>, artifactId }
export const PM_ARTIFACTS = [
  // ---- Debit card · DACH: research → PRD → decision ----
  { id: 'a4', type: 'research_note', title: 'Конкуренты: N26, Bunq, Wise', taskId: 's4',
    project: 'Debit card · DACH', when: '4 дн. назад', status: 'approved', version: 2,
    source: ['web', 'reviewed'],
    evidence: [
      { kind: 'url', label: 'n26.com — тарифы и условия' },
      { kind: 'url', label: 'bunq.com — pricing' },
      { kind: 'url', label: 'wise.com — карта и лимиты' },
    ],
    links: [] },
  { id: 'a1', type: 'prd', title: 'PRD: дебетовая карта DACH', taskId: 's10',
    project: 'Debit card · DACH', when: 'Сегодня', status: 'in_review', version: 3,
    source: ['synthesis', 'drafted'],
    evidence: [{ kind: 'artifact', label: 'Конкуренты: N26, Bunq, Wise', ref: 'a4' }],
    links: [{ type: 'backed_by', artifactId: 'a4' }] },
  { id: 'a8', type: 'decision', title: 'Решение: запускаем сначала виртуальную карту', taskId: 's11',
    project: 'Debit card · DACH', when: 'Сегодня', status: 'decided', version: 1,
    source: ['manual'],
    evidence: [{ kind: 'artifact', label: 'PRD: дебетовая карта DACH', ref: 'a1' }],
    links: [{ type: 'decided_by', artifactId: 'a1' }] },

  // ---- Onboarding v2: discovery → insight → problem → experiment/prototype ----
  { id: 'a3', type: 'jtbd', title: 'JTBD: открыть счёт за вечер', taskId: 's3',
    project: 'Onboarding v2', when: '6 дн. назад', status: 'approved', version: 2,
    source: ['synthesis', 'reviewed'],
    evidence: [{ kind: 'file', label: '7 discovery-интервью (транскрипты)' }],
    links: [] },
  { id: 'a2', type: 'insight', title: 'Воронка активации — где течёт', taskId: 's19',
    project: 'Onboarding v2', when: 'Вчера', status: 'approved', version: 1,
    source: ['synthesis'],
    evidence: [
      { kind: 'metric', label: 'Activation funnel (Amplitude)' },
      { kind: 'artifact', label: 'JTBD: открыть счёт за вечер', ref: 'a3' },
    ],
    links: [{ type: 'derived_from', artifactId: 'a3' }] },
  { id: 'a7', type: 'problem_statement', title: 'Долгий KYC роняет активацию на шаге 3', taskId: 's2',
    project: 'Onboarding v2', when: 'Вчера', status: 'in_review', version: 1,
    source: ['synthesis', 'drafted'],
    evidence: [{ kind: 'artifact', label: 'Воронка активации — где течёт', ref: 'a2' }],
    links: [{ type: 'derived_from', artifactId: 'a2' }, { type: 'backed_by', artifactId: 'a3' }] },
  { id: 'a6', type: 'prototype', title: 'Прототип нового Welcome-экрана', taskId: 's15',
    project: 'Onboarding v2', when: '3 дн. назад', status: 'approved', version: 2,
    source: ['drafted'],
    evidence: [{ kind: 'artifact', label: 'Долгий KYC роняет активацию', ref: 'a7' }],
    links: [{ type: 'prototype_of', artifactId: 'a7' }] },
  { id: 'a5', type: 'experiment', title: 'A/B: новый Welcome-экран', taskId: 's18',
    project: 'Onboarding v2', when: 'Сегодня', status: 'draft', version: 1,
    source: ['drafted'],
    evidence: [{ kind: 'artifact', label: 'Прототип нового Welcome-экрана', ref: 'a6' }],
    links: [{ type: 'tested_by', artifactId: 'a6' }] },
]
export const artifactById = (id) => PM_ARTIFACTS.find((a) => a.id === id)
// тип артефакта, который производит навык/промт — по его этапу
const STAGE_ARTIFACT_TYPE = {
  discovery: 'problem_statement',
  research: 'research_note',
  delivery: 'prd',
  proto: 'prototype',
  analytics: 'experiment',
  strategy: 'strategy',
}
export const artifactTypeForTask = (taskId) => {
  const t = taskById(taskId)
  return (t && STAGE_ARTIFACT_TYPE[t.stage]) || 'research_note'
}
// все артефакты, связанные с данным (входящие + исходящие связи)
export const linkedArtifacts = (id) => {
  const a = artifactById(id)
  if (!a) return []
  const out = (a.links || []).map((l) => artifactById(l.artifactId)).filter(Boolean)
  const incoming = PM_ARTIFACTS.filter((x) => (x.links || []).some((l) => l.artifactId === id))
  return [...new Set([...out, ...incoming])]
}

export const PM_CHATS = [
  { id: 'c1', title: 'PRD дебетовой карты DACH', taskId: 's10', when: 'Сегодня' },
  { id: 'c2', title: 'Гипотезы падения активации', taskId: 's19', when: 'Вчера' },
  { id: 'c3', title: 'Гайд для дискавери-интервью', taskId: 's6', when: '3 дн. назад' },
]

// ============ Owner / CPO persona ============
export const OWNER_PROFILE = { name: 'Арман', initials: 'А', role: 'Head of Product', company: 'Revolut', color: '#6f7ff2' }

export const PMS = [
  {
    id: 'pm1', name: 'Алексей Романов', initials: 'AR', color: '#f47b42', area: 'Payments',
    status: 'on_track', artifacts: 12, chats: 5, lastActive: 'Сегодня',
    summary: 'DACH-карта в графике, GTM согласован. Риск только по срокам KYC-провайдера.',
    products: [
      { name: 'Debit card · DACH', progress: 42, status: 'on_track', nsm: 'CAC < €40' },
      { name: 'Subscriptions · SME', progress: 18, status: 'planning', nsm: 'MRR подписок' },
    ],
  },
  {
    id: 'pm2', name: 'Алексей Мосин', initials: 'AM', color: '#B0299A', area: 'Growth',
    status: 'at_risk', artifacts: 17, chats: 8, lastActive: 'Сегодня',
    summary: 'Onboarding v2 близко к rollout. Activation push отстаёт — нет ресёрча по сегменту.',
    products: [
      { name: 'Onboarding v2', progress: 61, status: 'on_track', nsm: 'Time-to-value' },
      { name: 'Activation push', progress: 30, status: 'at_risk', nsm: 'D1 retention' },
    ],
  },
  {
    id: 'pm3', name: 'Полина Орлова', initials: 'PO', color: '#7A5CD6', area: 'Retention',
    status: 'on_track', artifacts: 9, chats: 4, lastActive: 'Вчера',
    summary: 'Win-back flow в активной фазе, A/B стартует на неделе. Churn signals в дискавери.',
    products: [
      { name: 'Win-back flow', progress: 54, status: 'on_track', nsm: 'Reactivation rate' },
      { name: 'Churn signals', progress: 12, status: 'planning', nsm: 'Early churn' },
    ],
  },
  {
    id: 'pm4', name: 'Дмитрий Власов', initials: 'DV', color: '#2D6CDF', area: 'Platform',
    status: 'blocked', artifacts: 3, chats: 1, lastActive: '5 дн. назад',
    summary: 'B2B API Portal заблокирован: нет решения по auth от security. Нужна эскалация.',
    products: [
      { name: 'B2B API Portal', progress: 8, status: 'blocked', nsm: 'Активные партнёры' },
    ],
  },
]

export const STATUS = {
  on_track: { label: 'В графике', cls: 'green' },
  at_risk: { label: 'Риск', cls: 'amber' },
  blocked: { label: 'Блок', cls: 'red' },
  planning: { label: 'Планирование', cls: 'gray' },
  active: { label: 'В работе', cls: 'green' },
  // artifact lifecycle: draft → in_review → approved → decided → archived
  draft: { label: 'Черновик', cls: 'ai' },
  in_review: { label: 'На ревью', cls: 'amber' },
  approved: { label: 'Утверждён', cls: 'green' },
  decided: { label: 'Решено', cls: 'ai' },
  archived: { label: 'Архив', cls: 'gray' },
  done: { label: 'Готово', cls: 'green' },
}

// ============ doc templates (for chat artifacts) ============
const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function docTemplate(taskId, brief) {
  const ctx = `<p><strong>Контекст:</strong> ${esc((brief || '').slice(0, 160))}</p>`
  if (taskId === 's10') return `${ctx}
    <h3><span class="num">01</span> Problem &amp; Goals</h3>
    <p>Бизнес-проблема и 2–3 измеримые цели релиза.</p>
    <h3><span class="num">02</span> User Stories</h3>
    <ul><li>Как [роль] я хочу [действие], чтобы [ценность].</li><li>Как пользователь, я хочу видеть прогресс, чтобы понимать остаток шагов.</li></ul>
    <h3><span class="num">03</span> Scope</h3>
    <table><thead><tr><th>In scope</th><th>Out of scope</th></tr></thead>
      <tbody><tr><td>Core flow A</td><td>Nice-to-have X</td></tr><tr><td>Core flow B</td><td>Phase 2</td></tr></tbody></table>
    <div class="note"><strong>Next:</strong> согласовать с engineering до следующего спринта.</div>`
  if (taskId === 's3') return `${ctx}
    <h3><span class="num">01</span> Core Job</h3>
    <p>Когда [ситуация], я хочу [мотивация], чтобы [желаемый исход].</p>
    <h3><span class="num">02</span> Jobs Map</h3>
    <table><thead><tr><th>Тип</th><th>Job</th><th>Приоритет</th></tr></thead>
      <tbody><tr><td>Functional</td><td>Открыть счёт без похода в банк</td><td>High</td></tr>
      <tr><td>Emotional</td><td>Чувствовать контроль над финансами</td><td>High</td></tr>
      <tr><td>Social</td><td>Выглядеть технологично перед партнёрами</td><td>Medium</td></tr></tbody></table>`
  if (taskId === 's19') return `${ctx}
    <h3><span class="num">01</span> Где течёт</h3>
    <table><thead><tr><th>Шаг</th><th>Конверсия</th><th>Drop</th></tr></thead>
      <tbody><tr><td>Старт → KYC</td><td>72%</td><td>—</td></tr><tr><td>KYC → Funding</td><td>41%</td><td>⚠ основной слив</td></tr>
      <tr><td>Funding → Active</td><td>88%</td><td>—</td></tr></tbody></table>
    <h3><span class="num">02</span> Гипотезы причин</h3>
    <ul><li>KYC-форма слишком длинная для мобильных.</li><li>Нет понятной ценности до пополнения.</li><li>Внешний провайдер падает на пике.</li></ul>
    <div class="note">Проверить первым: сессии с дропом на KYC по типу устройства.</div>`
  if (taskId === 's18') return `${ctx}
    <h3><span class="num">01</span> Гипотеза</h3>
    <p>Мы верим, что [изменение] приведёт к [эффект] для [метрика], потому что [основание].</p>
    <h3><span class="num">02</span> Дизайн</h3>
    <table><thead><tr><th>Параметр</th><th>Значение</th></tr></thead>
      <tbody><tr><td>Метрика успеха</td><td>Conversion на шаге оплаты</td></tr><tr><td>Мин. эффект</td><td>+5% относительно</td></tr>
      <tr><td>Длительность</td><td>14 дней</td></tr><tr><td>Выборка</td><td>~8 400 / группа</td></tr></tbody></table>
    <div class="note">Проверить SRM после запуска.</div>`
  // generic
  const t = taskById(taskId)
  return `${ctx}
    <h3><span class="num">01</span> ${esc(t ? t.name : 'Результат')}</h3>
    <p>Структурированная заготовка под задачу на основе контекста продукта.</p>
    <h3><span class="num">02</span> Следующие шаги</h3>
    <ul><li>Уточнить вводные и допущения.</li><li>Связать с проектом и назначить ответственного.</li></ul>
    <div class="note">Демо-шаблон. В проде ответ генерируется на контексте продукта.</div>`
}
