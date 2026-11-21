import {
  Activity,
  BarChart3,
  Bot,
  Brain,
  CalendarClock,
  CheckCheck,
  ClipboardList,
  Cog,
  FileClock,
  Gauge,
  GitBranch,
  LayoutDashboard,
  MessageSquareText,
  Plug,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceHref =
  | "/"
  | "/workspace"
  | "/agents"
  | "/rooms"
  | "/tasks"
  | "/skills"
  | "/memory"
  | "/models"
  | "/approvals"
  | "/integrations"
  | "/workflows"
  | "/history"
  | "/analytics"
  | "/settings";

export type WorkspacePageKey =
  | "overview"
  | "workspace"
  | "agents"
  | "rooms"
  | "tasks"
  | "skills"
  | "memory"
  | "models"
  | "approvals"
  | "integrations"
  | "workflows"
  | "history"
  | "analytics"
  | "settings";

export type NavItem = {
  label: string;
  href: WorkspaceHref;
  key: WorkspacePageKey;
  icon: LucideIcon;
  badge?: string;
};

export type NavGroup = {
  label: string;
  items: readonly NavItem[];
};

export const navGroups: readonly NavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/", key: "overview", icon: LayoutDashboard },
      { label: "Agent workspace", href: "/workspace", key: "workspace", icon: MessageSquareText },
      { label: "Agents", href: "/agents", key: "agents", icon: Bot, badge: "8" },
      { label: "Collaboration rooms", href: "/rooms", key: "rooms", icon: UsersRound, badge: "4" },
      { label: "Task execution", href: "/tasks", key: "tasks", icon: ClipboardList, badge: "5" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Skills & tools", href: "/skills", key: "skills", icon: Wrench, badge: "8" },
      { label: "Memory manager", href: "/memory", key: "memory", icon: Brain },
      { label: "Model configuration", href: "/models", key: "models", icon: Sparkles },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Approval centre",
        href: "/approvals",
        key: "approvals",
        icon: ShieldCheck,
        badge: "2",
      },
      { label: "Integrations", href: "/integrations", key: "integrations", icon: Plug, badge: "5" },
      { label: "Scheduled workflows", href: "/workflows", key: "workflows", icon: CalendarClock },
      { label: "Execution history", href: "/history", key: "history", icon: FileClock },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics & monitoring", href: "/analytics", key: "analytics", icon: BarChart3 },
      { label: "Settings", href: "/settings", key: "settings", icon: Cog },
    ],
  },
];

export function workspaceMeta(title: string, description: string) {
  const pageTitle = `${title} | OpenCrewBot 2.0 (EDXSO)`;
  return [
    { title: pageTitle },
    { name: "description", content: description },
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export type AgentStatus = "Active" | "Idle" | "Needs review" | "Draft";
export type PermissionLevel = "Read only" | "Review required" | "Autonomous";

export type Agent = {
  id: string;
  name: string;
  role: string;
  specialty: string;
  model: string;
  fallbackModel: string;
  status: AgentStatus;
  permission: PermissionLevel;
  skills: string[];
  tools: string[];
  initials: string;
  systemPrompt: string;
  outputFormat: string;
  temperature: number;
};

export const sampleAgents: Agent[] = [
  {
    id: "ag-01",
    name: "Chief of Staff",
    role: "Orchestrator",
    specialty: "High-level planning, subtask delegation & cross-agent coordination",
    model: "Llama 3.3 70B",
    fallbackModel: "Qwen 2.5 72B",
    status: "Active",
    permission: "Review required",
    skills: ["Market Research", "Project Planning", "Presentation Creation"],
    tools: ["delegation_engine", "task_scheduler", "rag_retrieval"],
    initials: "CS",
    systemPrompt:
      "You are the Chief of Staff orchestrating autonomous multi-agent workforces. Break high-level user directives into structured, reviewable subtasks and assign them to specialized agents.",
    outputFormat: "Structured markdown brief with delegation tables and explicit risk caveats.",
    temperature: 0.2,
  },
  {
    id: "ag-02",
    name: "Mira Research",
    role: "Research analyst",
    specialty: "Market scans, competitor intelligence & evidence-based synthesis",
    model: "Llama 3.3 70B",
    fallbackModel: "Llama 3.1 8B",
    status: "Active",
    permission: "Read only",
    skills: ["Market Research", "Competitor Analysis", "Data Analysis"],
    tools: ["web_search", "academic_retrieval", "nces_education_db"],
    initials: "MR",
    systemPrompt:
      "You are Mira Research, an elite market intelligence analyst. Focus on verifiable source citations, market sizing, and regulatory checks in education technology.",
    outputFormat: "Evidence-backed reports with bulleted citations and methodology notes.",
    temperature: 0.3,
  },
  {
    id: "ag-03",
    name: "Atlas Finance",
    role: "Finance strategist",
    specialty: "Unit economics, scenario modelling & revenue forecasting",
    model: "Qwen 2.5 72B",
    fallbackModel: "Llama 3.3 70B",
    status: "Idle",
    permission: "Review required",
    skills: ["Financial Modelling", "Data Analysis"],
    tools: ["excel_compiler", "monte_carlo_engine"],
    initials: "AF",
    systemPrompt:
      "You are Atlas Finance. Model revenue streams, customer acquisition costs, and cash runway with transparent formulaic breakdown and sensitivity analysis.",
    outputFormat: "Tabular financial scenarios (Base, Bull, Bear) with assumption lists.",
    temperature: 0.1,
  },
  {
    id: "ag-04",
    name: "Sage Writer",
    role: "Content specialist",
    specialty: "Executive memos, external outreach drafts & client presentations",
    model: "Llama 3.1 8B",
    fallbackModel: "Llama 3.3 70B",
    status: "Idle",
    permission: "Read only",
    skills: ["Email Drafting", "Presentation Creation"],
    tools: ["styleguide_linter", "draft_formatter"],
    initials: "SW",
    systemPrompt:
      "You are Sage Writer. Craft executive-level prose that is concise, impactful, and tailored to senior education leaders.",
    outputFormat: "Clean Markdown with callout blocks and highlighted action items.",
    temperature: 0.5,
  },
  {
    id: "ag-05",
    name: "Delta Analyst",
    role: "Data analyst",
    specialty: "Enrolment analytics, retention cohorts & tabular data extraction",
    model: "Qwen 2.5 72B",
    fallbackModel: "Llama 3.3 70B",
    status: "Active",
    permission: "Read only",
    skills: ["Data Analysis", "Financial Modelling"],
    tools: ["duckdb_runner", "chart_builder"],
    initials: "DA",
    systemPrompt:
      "You are Delta Analyst. Transform messy datasets into clear metric cards, cohort tables, and actionable operational insights.",
    outputFormat: "Clean Markdown tables accompanied by statistical summaries.",
    temperature: 0.2,
  },
  {
    id: "ag-06",
    name: "Review Engineer",
    role: "Code reviewer",
    specialty: "Code quality, architecture verification & security boundary review",
    model: "Llama 3.3 70B",
    fallbackModel: "Qwen 2.5 72B",
    status: "Needs review",
    permission: "Review required",
    skills: ["Code Review", "Data Analysis"],
    tools: ["git_diff_inspector", "ast_parser", "sec_scanner"],
    initials: "RE",
    systemPrompt:
      "You are Review Engineer. Review source code and configuration for OWASP risks, regression hazards, and performance bottlenecks.",
    outputFormat: "Unified diff suggestions with severity ratings (Critical, High, Medium, Info).",
    temperature: 0.1,
  },
  {
    id: "ag-07",
    name: "Nova Growth",
    role: "Growth researcher",
    specialty: "Institutional partnership leads, market expansion & outreach profiling",
    model: "Llama 3.1 8B",
    fallbackModel: "Llama 3.3 70B",
    status: "Active",
    permission: "Read only",
    skills: ["Lead Generation", "Competitor Analysis"],
    tools: ["directory_crawler", "linkedin_lead_mapper"],
    initials: "NG",
    systemPrompt:
      "You are Nova Growth. Discover and vet educational partners, accreditation leaders, and institutional buyers according to specified ideal customer profiles.",
    outputFormat: "Lead qualification matrix with qualification scores and contact hooks.",
    temperature: 0.4,
  },
  {
    id: "ag-08",
    name: "Ops Planner",
    role: "Operations planner",
    specialty: "Process automation, SOP preparation & pipeline dependencies",
    model: "Llama 3.3 70B",
    fallbackModel: "Llama 3.1 8B",
    status: "Idle",
    permission: "Autonomous",
    skills: ["Project Planning", "Email Drafting"],
    tools: ["workflow_engine", "webhook_invoker"],
    initials: "OP",
    systemPrompt:
      "You are Ops Planner. Optimize multi-step business pipelines, sequence agent handoffs, and ensure all SLAs and governance gates are respected.",
    outputFormat: "Step-by-step SOP runbook with conditional branches and human gate markers.",
    temperature: 0.2,
  },
];

export type Room = {
  id: string;
  name: string;
  goal: string;
  agents: string[];
  mode: "Parallel" | "Sequential";
  status: "In progress" | "Ready" | "Draft";
  updated: string;
  deliverable: string;
  verificationRequired: boolean;
  discussions: {
    author: string;
    role: string;
    text: string;
    time: string;
  }[];
  steps: {
    id: string;
    title: string;
    owner: string;
    state: "completed" | "active" | "queued";
  }[];
};

export const sampleRooms: Room[] = [
  {
    id: "room-01",
    name: "Q4 Market Expansion",
    goal: "Map top 15 European and Middle East higher education markets, calculate entry economics, and summarize regulatory risks.",
    agents: ["Chief of Staff", "Mira Research", "Atlas Finance"],
    mode: "Parallel",
    status: "In progress",
    updated: "12 min ago",
    deliverable: "Executive Market Entry Briefing & 3-Year Model (PDF/Deck outline)",
    verificationRequired: true,
    steps: [
      {
        id: "s1",
        title: "Market scans & addressable university cohorts",
        owner: "Mira Research",
        state: "completed",
      },
      {
        id: "s2",
        title: "Regulatory accreditation & tuition fee elasticity",
        owner: "Atlas Finance",
        state: "active",
      },
      {
        id: "s3",
        title: "Synthesis of expansion roadmap & board proposal",
        owner: "Chief of Staff",
        state: "queued",
      },
    ],
    discussions: [
      {
        author: "Chief of Staff",
        role: "Orchestrator",
        time: "10:04",
        text: "Team, we have 48 hours to present the international expansion plan. Mira, initiate parallel scans on the DACH and GCC regions. Atlas, prepare baseline CAC and tuition revenue projections.",
      },
      {
        author: "Mira Research",
        role: "Research analyst",
        time: "10:12",
        text: "Initiating data extraction from NCES and Eurostat education registries. I am seeing strong tailwinds for hybrid degree programs in UAE and Saudi Arabia.",
      },
      {
        author: "Atlas Finance",
        role: "Finance strategist",
        time: "10:25",
        text: "Pulling historical partner conversion rates. If regional tuition averages $12,500 with a 15% net margin, break-even requires 4 partner universities by Year 2.",
      },
    ],
  },
  {
    id: "room-02",
    name: "Leadership Briefing & Strategy",
    goal: "Synthesize operational Q3 milestones into an evidence-led board briefing with data tables and presentation slides.",
    agents: ["Chief of Staff", "Sage Writer", "Delta Analyst"],
    mode: "Sequential",
    status: "Ready",
    updated: "Today",
    deliverable: "Board Deck Outline & Q3 Metrics Appendix",
    verificationRequired: true,
    steps: [
      {
        id: "s1",
        title: "Extract operational cohort data and retention KPIs",
        owner: "Delta Analyst",
        state: "completed",
      },
      {
        id: "s2",
        title: "Draft narrative structure and executive takeaways",
        owner: "Sage Writer",
        state: "completed",
      },
      {
        id: "s3",
        title: "Executive review & governance verification",
        owner: "Chief of Staff",
        state: "completed",
      },
    ],
    discussions: [
      {
        author: "Delta Analyst",
        role: "Data analyst",
        time: "Yesterday",
        text: "Final cohort retention numbers are verified: 94.2% student satisfaction and 18% uplift in completion rates across pilot cohorts.",
      },
      {
        author: "Sage Writer",
        role: "Content specialist",
        time: "Yesterday",
        text: "Drafted the 5 core takeaway slides focusing on rapid onboarding and platform reliability. Ready for Chief of Staff sign-off.",
      },
    ],
  },
  {
    id: "room-03",
    name: "Institutional Partner Landscape",
    goal: "Vetting 40 candidate universities across North America for strategic curriculum integration pilots.",
    agents: ["Mira Research", "Nova Growth"],
    mode: "Parallel",
    status: "Ready",
    updated: "Yesterday",
    deliverable: "Ranked Institutional Partnership Roster (CSV/Markdown)",
    verificationRequired: false,
    steps: [
      {
        id: "s1",
        title: "Filter institutions by tech adoption index",
        owner: "Nova Growth",
        state: "completed",
      },
      {
        id: "s2",
        title: "Identify dean and provost contact hierarchies",
        owner: "Mira Research",
        state: "completed",
      },
    ],
    discussions: [
      {
        author: "Nova Growth",
        role: "Growth researcher",
        time: "Nov 19",
        text: "Compiled 40 Tier-1 and Tier-2 state universities with active online degrees initiatives.",
      },
      {
        author: "Mira Research",
        role: "Research analyst",
        time: "Nov 19",
        text: "Verified accreditation compliance and published leadership priorities for the top 15.",
      },
    ],
  },
  {
    id: "room-04",
    name: "Autonomous Workflow Audit",
    goal: "Review all high-risk automated actions across Gmail and Notion integrations to prevent unauthorized write mutations.",
    agents: ["Ops Planner", "Review Engineer"],
    mode: "Sequential",
    status: "Draft",
    updated: "Nov 19",
    deliverable: "Security Audit Log & Remediation Checklist",
    verificationRequired: true,
    steps: [
      {
        id: "s1",
        title: "Map all external webhook endpoints and write privileges",
        owner: "Ops Planner",
        state: "active",
      },
      {
        id: "s2",
        title: "Inspect permission boundary enforcement in runner",
        owner: "Review Engineer",
        state: "queued",
      },
    ],
    discussions: [
      {
        author: "Ops Planner",
        role: "Operations planner",
        time: "Nov 18",
        text: "Starting audit of 5 external connectors. All write actions are quarantined behind the Approval Centre.",
      },
      {
        author: "Review Engineer",
        role: "Code reviewer",
        time: "Nov 18",
        text: "Acknowledged. I will verify that rejection locks down execution tokens immediately.",
      },
    ],
  },
];

export type TaskStatus = "Running" | "Waiting for approval" | "Completed" | "Failed" | "Queued";

export type Task = {
  id: string;
  description: string;
  agent: string;
  room: string;
  status: TaskStatus;
  duration: string;
  updated: string;
  retries: number;
  dependency: string;
  inputPayload: string;
  outputSummary?: string;
  errorLog?: string;
};

export const sampleTasks: Task[] = [
  {
    id: "TSK-2084",
    description: "Compare regional enrolment trends across GCC higher education",
    agent: "Mira Research",
    room: "Q4 Market Expansion",
    status: "Running",
    duration: "04:18",
    updated: "2 min ago",
    retries: 0,
    dependency: "None (Parallel lead)",
    inputPayload: '{"region": "GCC", "sectors": ["HigherEd", "EdTech"], "year": 2026}',
    outputSummary:
      "Parsed 14 government statistical releases. Finalizing competitive tuition table.",
  },
  {
    id: "TSK-2083",
    description: "Review partnership outreach email draft for Dean of Sciences",
    agent: "Sage Writer",
    room: "Leadership Briefing & Strategy",
    status: "Waiting for approval",
    duration: "01:42",
    updated: "8 min ago",
    retries: 0,
    dependency: "TSK-2082 (Delta Analyst source notes)",
    inputPayload:
      '{"target": "Dr. Aris Thorne", "university": "Crestview Tech", "channel": "Gmail"}',
    outputSummary: "Draft prepared. Requires human review before external dispatch.",
  },
  {
    id: "TSK-2082",
    description: "Summarise verified source notes on curriculum licensing costs",
    agent: "Delta Analyst",
    room: "Leadership Briefing & Strategy",
    status: "Completed",
    duration: "02:06",
    updated: "23 min ago",
    retries: 0,
    dependency: "None",
    inputPayload: '{"dataset": "EDXSO_Curriculum_Index_v2.json"}',
    outputSummary: "Extracted 12 licensing benchmarks. Average cost per credit hour: $42.50.",
  },
  {
    id: "TSK-2081",
    description: "Check sensitivity assumptions in DACH break-even model",
    agent: "Review Engineer",
    room: "Q4 Market Expansion",
    status: "Failed",
    duration: "00:38",
    updated: "1 hr ago",
    retries: 1,
    dependency: "TSK-2084",
    inputPayload: '{"script": "validate_financials.py", "tolerance": 0.05}',
    errorLog: "ValueError: Column 'currency_hedge_rate' contains NaN for fiscal year 2027.",
  },
  {
    id: "TSK-2080",
    description: "Outline a partner discovery and vetting workflow SOP",
    agent: "Ops Planner",
    room: "Autonomous Workflow Audit",
    status: "Queued",
    duration: "—",
    updated: "1 hr ago",
    retries: 0,
    dependency: "TSK-2081",
    inputPayload: '{"template": "sop_autonomous_vetting_standard.md"}',
  },
];

export type Skill = {
  name: string;
  category: "Research" | "Analysis" | "Creation" | "Communication" | "Engineering" | "Growth";
  description: string;
  version: string;
  permission: PermissionLevel;
  toolsRequired: string[];
  inputSchema: string;
  outputSchema: string;
  isAvailable: boolean;
};

export const sampleSkills: Skill[] = [
  {
    name: "Market Research",
    category: "Research",
    description:
      "Structure a source-led scan of an education market, audience demand, and institutional growth signals.",
    version: "1.4",
    permission: "Read only",
    toolsRequired: ["web_search", "academic_retrieval", "nces_education_db"],
    inputSchema:
      '{\n  "query": "string",\n  "geographic_scope": "string[]",\n  "target_vertical": "string"\n}',
    outputSchema:
      '{\n  "market_size_usd": "number",\n  "cagr": "number",\n  "key_players": "string[]",\n  "sources": "string[]"\n}',
    isAvailable: true,
  },
  {
    name: "Competitor Analysis",
    category: "Research",
    description:
      "Compare positioning, product offering, pricing models, and public evidence between target education solutions.",
    version: "1.2",
    permission: "Read only",
    toolsRequired: ["web_search", "pricing_crawler"],
    inputSchema:
      '{\n  "competitors": "string[]",\n  "metrics": ["pricing", "features", "accreditation"]\n}',
    outputSchema:
      '{\n  "comparison_matrix": "object[]",\n  "differentiation_points": "string[]"\n}',
    isAvailable: true,
  },
  {
    name: "Financial Modelling",
    category: "Analysis",
    description:
      "Build transparent 3-statement financial scenarios from supplied assumptions and enrolment estimates.",
    version: "1.1",
    permission: "Review required",
    toolsRequired: ["excel_compiler", "monte_carlo_engine"],
    inputSchema:
      '{\n  "student_count": "number",\n  "tuition_per_student": "number",\n  "churn_rate": "number"\n}',
    outputSchema:
      '{\n  "arr": "number",\n  "gross_margin": "number",\n  "payback_months": "number"\n}',
    isAvailable: true,
  },
  {
    name: "Presentation Creation",
    category: "Creation",
    description:
      "Transform reviewed strategic findings into a high-impact board presentation structure and slide outline.",
    version: "1.0",
    permission: "Review required",
    toolsRequired: ["styleguide_linter", "draft_formatter"],
    inputSchema:
      '{\n  "brief_title": "string",\n  "key_findings": "string[]",\n  "slide_count": "number"\n}',
    outputSchema:
      '{\n  "slides": [{ "title": "string", "bullets": "string[]", "notes": "string" }]\n}',
    isAvailable: true,
  },
  {
    name: "Email Drafting",
    category: "Communication",
    description:
      "Prepare external-facing communications for high-touch human review before dispatch.",
    version: "1.3",
    permission: "Review required",
    toolsRequired: ["styleguide_linter", "gmail_connector"],
    inputSchema:
      '{\n  "recipient_name": "string",\n  "recipient_role": "string",\n  "purpose": "string"\n}',
    outputSchema:
      '{\n  "subject": "string",\n  "body_markdown": "string",\n  "risk_score": "low" | "medium" | "high"\n}',
    isAvailable: true,
  },
  {
    name: "Code Review",
    category: "Engineering",
    description:
      "Inspect code, configurations, and API integrations for correctness, maintainability, and security risk.",
    version: "1.1",
    permission: "Read only",
    toolsRequired: ["git_diff_inspector", "ast_parser"],
    inputSchema:
      '{\n  "repo": "string",\n  "pull_request_id": "number",\n  "check_owasp": "boolean"\n}',
    outputSchema:
      '{\n  "findings": [{ "file": "string", "line": "number", "issue": "string", "severity": "string" }]\n}',
    isAvailable: true,
  },
  {
    name: "Data Analysis",
    category: "Analysis",
    description:
      "Explore tabular datasets and explain key statistical patterns, outliers, and caveats.",
    version: "1.2",
    permission: "Read only",
    toolsRequired: ["duckdb_runner", "chart_builder"],
    inputSchema: '{\n  "dataset_url": "string",\n  "target_column": "string"\n}',
    outputSchema:
      '{\n  "summary_statistics": "object",\n  "correlations": "object",\n  "insights": "string[]"\n}',
    isAvailable: true,
  },
  {
    name: "Lead Generation",
    category: "Growth",
    description:
      "Organise prospective partner criteria, scrape public registries, and prepare a research checklist.",
    version: "1.0",
    permission: "Review required",
    toolsRequired: ["directory_crawler", "linkedin_lead_mapper"],
    inputSchema: '{\n  "icp_criteria": "string",\n  "target_titles": "string[]"\n}',
    outputSchema:
      '{\n  "qualified_leads": [{ "institution": "string", "contact": "string", "fit_score": "number" }]\n}',
    isAvailable: true,
  },
];

export type ApprovalRequest = {
  id: string;
  agent: string;
  action: string;
  service: string;
  risk: "High" | "Medium" | "Low";
  time: string;
  detail: string;
  proposedPayload: string;
  status: "Pending" | "Approved" | "Rejected";
};

export const sampleApprovals: ApprovalRequest[] = [
  {
    id: "APR-0142",
    agent: "Sage Writer",
    action: "Send institutional partner introduction email to University Dean",
    service: "Gmail",
    risk: "High",
    time: "12 min ago",
    detail:
      "A customized draft proposing a pilot curriculum trial is ready for human sign-off. External dispatch is halted until approved.",
    proposedPayload:
      "To: dean.morris@crestview.edu\nSubject: Exploring AI-Powered Curriculum Innovation with EDXSO\nBody:\nDear Dr. Morris,\nWe have followed Crestview's bold initiatives in expanding digital access for undergraduate engineering. OpenCrewBot 2.0 has analyzed curriculum completion bottlenecks and identified a potential 18% improvement opportunity...",
    status: "Pending",
  },
  {
    id: "APR-0141",
    agent: "Ops Planner",
    action: "Create a shared Notion workspace page with partner evaluation matrix",
    service: "Notion",
    risk: "Medium",
    time: "42 min ago",
    detail:
      "The proposed page outline containing 40 evaluated institutions is queued. Write access to the corporate Notion database requires review.",
    proposedPayload:
      'Database: EDXSO Strategic Partners\nTitle: Q4 Regional Institutional Landscape (Vetted)\nProperties: { "Status": "Under Evaluation", "Target Pilot": "Spring 2027", "Vetted Count": 40 }',
    status: "Pending",
  },
];

export type Integration = {
  name: string;
  kind: string;
  status: "Live" | "Disconnected" | "Mocked" | "Failed";
  capabilities: string[];
  latency: string;
  permissions: string;
  description: string;
};

export const sampleIntegrations: Integration[] = [
  {
    name: "GitHub",
    kind: "Developer platform",
    status: "Mocked",
    capabilities: [
      "Repository context",
      "Issue drafting",
      "Pull request review",
      "Security scanning",
    ],
    latency: "32ms (mocked)",
    permissions: "repo:read, pull_requests:write (sandbox only)",
    description:
      "Allows Review Engineer and Ops Planner to inspect codebase changes and propose code pull requests.",
  },
  {
    name: "Gmail",
    kind: "Email & communication",
    status: "Mocked",
    capabilities: ["Draft review", "Message context", "Outbox queue"],
    latency: "45ms (mocked)",
    permissions: "gmail.compose (quarantined behind Approval Centre)",
    description:
      "Enables Sage Writer to stage personalized communication. External dispatch is strictly gate-kept.",
  },
  {
    name: "Slack",
    kind: "Team messaging",
    status: "Mocked",
    capabilities: ["Channel context", "Notification alerts", "Approval triggers"],
    latency: "28ms (mocked)",
    permissions: "chat:write, channels:read",
    description:
      "Broadcasts critical workforce updates, task failures, and approval notifications to designated ops channels.",
  },
  {
    name: "Notion",
    kind: "Knowledge workspace",
    status: "Mocked",
    capabilities: ["Page context", "Document sync", "Database rows"],
    latency: "64ms (mocked)",
    permissions: "pages:read, pages:write",
    description:
      "Synchronizes memory files, deliverables, and strategic research documents into team knowledge bases.",
  },
  {
    name: "MCP Services",
    kind: "Model Context Protocol",
    status: "Live",
    capabilities: ["Local SQLite tools", "Filesystem sandboxes", "Custom protocol endpoints"],
    latency: "12ms (active)",
    permissions: "Scoped process execution",
    description:
      "Standardized tool runtime enabling agents to discover and invoke sandboxed external utilities.",
  },
];

export type Workflow = {
  id: string;
  name: string;
  schedule: string;
  cron: string;
  agents: string[];
  status: "Active" | "Paused" | "Draft";
  lastRun: string;
  nextRun: string;
  successRate: string;
  description: string;
};

export const sampleWorkflows: Workflow[] = [
  {
    id: "wf-01",
    name: "Weekly Market Pulse",
    schedule: "Every Monday · 09:00",
    cron: "0 9 * * 1",
    agents: ["Mira Research", "Chief of Staff"],
    status: "Active",
    lastRun: "Nov 17, 2026 · Success",
    nextRun: "In 2 days",
    successRate: "98.2%",
    description:
      "Crawls education regulatory portals and industry press to generate an automated executive briefing on Monday morning.",
  },
  {
    id: "wf-02",
    name: "Leadership Digest & Metric Sync",
    schedule: "Weekdays · 08:30",
    cron: "30 8 * * 1-5",
    agents: ["Delta Analyst", "Sage Writer"],
    status: "Active",
    lastRun: "Today · 08:30 · Success",
    nextRun: "Tomorrow · 08:30",
    successRate: "100%",
    description:
      "Aggregates pilot cohort completion metrics and compiles a formatted email digest for senior leadership.",
  },
  {
    id: "wf-03",
    name: "Partner Review & Compliance Checklist",
    schedule: "Monthly · 1st day",
    cron: "0 0 1 * *",
    agents: ["Ops Planner", "Review Engineer"],
    status: "Paused",
    lastRun: "Nov 01, 2026 · Success",
    nextRun: "Paused by admin",
    successRate: "94.0%",
    description:
      "Audits external integration tokens, reviews permission boundaries, and flags expired institutional partner certs.",
  },
];

export type MemoryFile = {
  name: string;
  type: string;
  author: string;
  lastUpdated: string;
  purpose: string;
  text: string;
};

export const sampleMemoryFiles: MemoryFile[] = [
  {
    name: "workspace.md",
    type: "Workspace Architecture",
    author: "Chief of Staff",
    lastUpdated: "Nov 21, 2026",
    purpose:
      "Defines core operational boundaries, team principles, and delivery standards for OpenCrewBot 2.0.",
    text: `# OpenCrewBot 2.0 — Enterprise Workspace Principles\n\n## Core Governance\n1. **Evidence-First**: All agent assertions must cite primary research sources or data files.\n2. **Review-Before-Action**: External modifications (Gmail, Notion, GitHub writes) are strictly quarantined in the Approval Centre.\n3. **Graceful Degradation**: If an LLM endpoint fails or times out, the router automatically fails over to secondary models (e.g. Llama 3.3 70B -> Qwen 2.5 72B).\n\n## Assigned Mission\nEmpower schools, universities, and education enterprises to achieve sustainable growth through autonomous AI orchestration and strategic research.\n`,
  },
  {
    name: "decisions.md",
    type: "Architecture Decisions",
    author: "Review Engineer",
    lastUpdated: "Nov 20, 2026",
    purpose: "ADR log documenting key technical decisions and architectural constraints.",
    text: `# Architectural Decision Records (ADRs)\n\n## ADR-012: Model Context Protocol (MCP) Standard\n- **Status**: Approved\n- **Context**: Needed secure, pluggable protocol for local tools without hardcoding API contracts.\n- **Decision**: Adopt MCP for all local tools and database connectors.\n\n## ADR-013: Transparent Human-in-the-Loop Rejection\n- **Status**: Approved\n- **Context**: Enterprise users must have absolute confidence that rejected actions are halted.\n- **Decision**: Rejection visibly logs an immutable safety audit event and invalidates dispatch tokens.\n`,
  },
  {
    name: "preferences.md",
    type: "User Preferences",
    author: "Alex Mercer (User)",
    lastUpdated: "Nov 19, 2026",
    purpose: "Personal preferences for reporting cadence, tone, and external communication style.",
    text: `# User & Organization Preferences\n\n- **Tone**: Concise, evidence-backed, executive-grade. Avoid conversational fluff.\n- **Data Visualizations**: Prefer tabular breakdowns and structured bar/line charts over lengthy prose.\n- **Timezone**: UTC+05:30 (IST).\n- **Default Review Policy**: All outbound external messages require human sign-off.\n`,
  },
  {
    name: "agent-notes.md",
    type: "Cross-Agent Long-Term Memory",
    author: "Mira Research & Atlas Finance",
    lastUpdated: "Nov 18, 2026",
    purpose: "Persistent learnings extracted during past research and scenario runs.",
    text: `# Cross-Agent Knowledge Base\n\n## European Higher Education Dynamics\n- Tuition fee regulations in Germany strictly limit public university course charges, but executive education certificates have 35% higher margin flexibility.\n- Middle East (GCC) expansion shows highest demand in STEM, Cyber, and AI engineering degrees with English as primary language of instruction.\n`,
  },
];

export type ModelProvider = {
  name: string;
  status: "Available" | "Degraded" | "Not configured";
  latency: string;
  contextWindow: string;
  costPerMillion: string;
  models: string[];
  description: string;
};

export const sampleModelProviders: ModelProvider[] = [
  {
    name: "Groq",
    status: "Available",
    latency: "140ms (ultra-fast)",
    contextWindow: "128k tokens",
    costPerMillion: "$0.59 / $0.79",
    models: ["Llama 3.3 70B Versatile", "Llama 3.1 8B Instant"],
    description:
      "LPUs provide near-instant token streaming for real-time conversational agent experiences.",
  },
  {
    name: "NVIDIA NIM",
    status: "Available",
    latency: "280ms (optimized)",
    contextWindow: "128k tokens",
    costPerMillion: "$0.70 / $0.90",
    models: ["Qwen 2.5 72B Instruct", "Nemotron-4 340B"],
    description:
      "Enterprise GPU microservices optimized for deep analytical reasoning and code verification.",
  },
  {
    name: "OpenAI Compatible",
    status: "Available",
    latency: "450ms",
    contextWindow: "128k tokens",
    costPerMillion: "$2.50 / $10.00",
    models: ["GPT-4o", "GPT-4o mini"],
    description: "General enterprise foundation model fallback endpoint.",
  },
];

export const demoMetrics = [
  { label: "Configured Agents", value: "08", hint: "Autonomous specialized roles", icon: Bot },
  { label: "Active Tasks", value: "02", hint: "Running in execution pipelines", icon: Activity },
  { label: "Completed Tasks", value: "42", hint: "Delivered this week", icon: CheckCheck },
  { label: "Pending Approvals", value: "02", hint: "Awaiting human sign-off", icon: ShieldCheck },
  { label: "Scheduled Workflows", value: "03", hint: "2 active, 1 paused", icon: CalendarClock },
  {
    label: "System Health",
    value: "99.98%",
    hint: "All services operational · Live Production (Groq + NVIDIA NIM)",
    icon: Gauge,
  },
];

export const throughputSample = [
  { day: "Mon", tasks: 8, reviewed: 6, volume: 14 },
  { day: "Tue", tasks: 12, reviewed: 9, volume: 21 },
  { day: "Wed", tasks: 9, reviewed: 7, volume: 16 },
  { day: "Thu", tasks: 15, reviewed: 11, volume: 26 },
  { day: "Fri", tasks: 11, reviewed: 8, volume: 19 },
  { day: "Sat", tasks: 5, reviewed: 4, volume: 9 },
  { day: "Sun", tasks: 7, reviewed: 5, volume: 12 },
];

export const latencySample = [
  { percentile: "P50", latency: 1.2, groq: 0.8, nim: 1.5 },
  { percentile: "P75", latency: 2.1, groq: 1.3, nim: 2.4 },
  { percentile: "P90", latency: 3.4, groq: 1.9, nim: 3.8 },
  { percentile: "P95", latency: 4.8, groq: 2.5, nim: 5.1 },
  { percentile: "P99", latency: 6.2, groq: 3.2, nim: 6.9 },
];

export const sampleActivity = [
  {
    icon: CheckCheck,
    title: "Brief outline synthesized",
    detail: "Leadership brief · Sage Writer",
    time: "8 min ago",
    tone: "success",
  },
  {
    icon: ShieldCheck,
    title: "External action quarantined",
    detail: "Partner outreach draft · Gmail",
    time: "12 min ago",
    tone: "warning",
  },
  {
    icon: Activity,
    title: "Parallel research in progress",
    detail: "Q4 market expansion · Mira Research",
    time: "18 min ago",
    tone: "info",
  },
  {
    icon: GitBranch,
    title: "Assumption review flagged",
    detail: "DACH model sensitivity · Review Engineer",
    time: "1 hr ago",
    tone: "danger",
  },
  {
    icon: Sparkles,
    title: "New agent generated",
    detail: "Policy Analyst · Natural Language Spec",
    time: "2 hrs ago",
    tone: "info",
  },
];

export const systemSignals = [
  { label: "Agent Orchestration Engine", value: "Operational (Mocked)", icon: Bot },
  { label: "Integration Gateway & Sandboxes", value: "Quarantined (Safe)", icon: Plug },
  { label: "LLM Model Router (Groq/NIM)", value: "Connected (Demo)", icon: Sparkles },
  { label: "Execution Sandbox Runtime", value: "Operational (Local)", icon: Gauge },
];
