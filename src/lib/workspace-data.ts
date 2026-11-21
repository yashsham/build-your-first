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
      { label: "Agents", href: "/agents", key: "agents", icon: Bot },
      { label: "Collaboration rooms", href: "/rooms", key: "rooms", icon: UsersRound },
      { label: "Task execution", href: "/tasks", key: "tasks", icon: ClipboardList },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Skills & tools", href: "/skills", key: "skills", icon: Wrench },
      { label: "Memory manager", href: "/memory", key: "memory", icon: Brain },
      { label: "Model configuration", href: "/models", key: "models", icon: Sparkles },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Approval centre", href: "/approvals", key: "approvals", icon: ShieldCheck },
      { label: "Integrations", href: "/integrations", key: "integrations", icon: Plug },
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
  const pageTitle = `${title} | OpenCrewBot 2.0`;
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
  status: AgentStatus;
  permission: PermissionLevel;
  skills: string[];
  initials: string;
};

export const sampleAgents: Agent[] = [
  { id: "ag-01", name: "Chief of Staff", role: "Orchestrator", specialty: "Task planning & delegation", model: "Llama 3.3 70B", status: "Active", permission: "Review required", skills: ["Market Research", "Project Planning"], initials: "CS" },
  { id: "ag-02", name: "Mira Research", role: "Research analyst", specialty: "Market & competitor intelligence", model: "Llama 3.3 70B", status: "Active", permission: "Read only", skills: ["Market Research", "Competitor Analysis"], initials: "MR" },
  { id: "ag-03", name: "Atlas Finance", role: "Finance strategist", specialty: "Scenario modelling & forecasting", model: "Qwen 2.5 72B", status: "Idle", permission: "Review required", skills: ["Financial Modelling", "Data Analysis"], initials: "AF" },
  { id: "ag-04", name: "Sage Writer", role: "Content specialist", specialty: "Executive briefs & email drafts", model: "Llama 3.1 8B", status: "Idle", permission: "Read only", skills: ["Email Drafting", "Presentation Creation"], initials: "SW" },
  { id: "ag-05", name: "Delta Analyst", role: "Data analyst", specialty: "Structured data & reporting", model: "Qwen 2.5 72B", status: "Active", permission: "Read only", skills: ["Data Analysis", "Financial Modelling"], initials: "DA" },
  { id: "ag-06", name: "Review Engineer", role: "Code reviewer", specialty: "Quality, risk & code review", model: "Llama 3.3 70B", status: "Needs review", permission: "Review required", skills: ["Code Review", "Data Analysis"], initials: "RE" },
  { id: "ag-07", name: "Nova Growth", role: "Growth researcher", specialty: "Lead discovery & outreach", model: "Llama 3.1 8B", status: "Active", permission: "Read only", skills: ["Lead Generation", "Competitor Analysis"], initials: "NG" },
  { id: "ag-08", name: "Ops Planner", role: "Operations planner", specialty: "Workflow & delivery planning", model: "Llama 3.3 70B", status: "Idle", permission: "Autonomous", skills: ["Project Planning", "Email Drafting"], initials: "OP" },
];

export type Room = {
  id: string;
  name: string;
  goal: string;
  agents: string[];
  mode: "Parallel" | "Sequential";
  status: "In progress" | "Ready" | "Draft";
  updated: string;
};

export const sampleRooms: Room[] = [
  { id: "room-01", name: "Q4 market expansion", goal: "Map promising education markets and entry risks.", agents: ["Chief of Staff", "Mira Research", "Atlas Finance"], mode: "Parallel", status: "In progress", updated: "12 min ago" },
  { id: "room-02", name: "Leadership brief", goal: "Prepare an evidence-led executive briefing outline.", agents: ["Chief of Staff", "Sage Writer", "Delta Analyst"], mode: "Sequential", status: "Ready", updated: "Today" },
  { id: "room-03", name: "Partner landscape", goal: "Organise a reviewable view of potential partners.", agents: ["Mira Research", "Nova Growth"], mode: "Parallel", status: "Ready", updated: "Yesterday" },
  { id: "room-04", name: "Workflow audit", goal: "Identify review points in an operations workflow.", agents: ["Ops Planner", "Review Engineer"], mode: "Sequential", status: "Draft", updated: "Nov 19" },
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
};

export const sampleTasks: Task[] = [
  { id: "TSK-2084", description: "Compare regional enrolment trends", agent: "Mira Research", room: "Q4 market expansion", status: "Running", duration: "04:18", updated: "2 min ago" },
  { id: "TSK-2083", description: "Review outreach draft for approval", agent: "Sage Writer", room: "Leadership brief", status: "Waiting for approval", duration: "01:42", updated: "8 min ago" },
  { id: "TSK-2082", description: "Summarise source notes for the team", agent: "Delta Analyst", room: "Leadership brief", status: "Completed", duration: "02:06", updated: "23 min ago" },
  { id: "TSK-2081", description: "Check model assumptions in draft", agent: "Review Engineer", room: "Q4 market expansion", status: "Failed", duration: "00:38", updated: "1 hr ago" },
  { id: "TSK-2080", description: "Outline a partner discovery workflow", agent: "Ops Planner", room: "Workflow audit", status: "Queued", duration: "—", updated: "1 hr ago" },
];

export const sampleSkills = [
  { name: "Market Research", category: "Research", description: "Structure a source-led scan of a market, audience and key signals.", version: "1.4", permission: "Read only" },
  { name: "Competitor Analysis", category: "Research", description: "Compare positioning, product scope and publicly available evidence.", version: "1.2", permission: "Read only" },
  { name: "Financial Modelling", category: "Analysis", description: "Build transparent scenarios from supplied assumptions and inputs.", version: "1.1", permission: "Review required" },
  { name: "Presentation Creation", category: "Creation", description: "Turn reviewed findings into a concise presentation structure.", version: "1.0", permission: "Review required" },
  { name: "Email Drafting", category: "Communication", description: "Prepare external-facing drafts for a human to review and send.", version: "1.3", permission: "Review required" },
  { name: "Code Review", category: "Engineering", description: "Inspect changes for correctness, maintainability and risk.", version: "1.1", permission: "Read only" },
  { name: "Data Analysis", category: "Analysis", description: "Explore provided datasets and explain key patterns and caveats.", version: "1.2", permission: "Read only" },
  { name: "Lead Generation", category: "Growth", description: "Organise prospect criteria and prepare a research checklist.", version: "1.0", permission: "Review required" },
];

export const sampleApprovals = [
  { id: "APR-0142", agent: "Sage Writer", action: "Send a partner introduction email", service: "Gmail", risk: "External communication", time: "12 min ago", detail: "A draft is ready for human review. No message has been sent." },
  { id: "APR-0141", agent: "Ops Planner", action: "Create a shared project page", service: "Notion", risk: "Write access", time: "42 min ago", detail: "The proposed page outline is available to inspect. No page has been created." },
];

export const sampleIntegrations = [
  { name: "GitHub", kind: "Developer platform", status: "Disconnected", capabilities: ["Repository context", "Issue drafting", "Pull request review"] },
  { name: "Gmail", kind: "Email", status: "Disconnected", capabilities: ["Draft review", "Message context"] },
  { name: "Slack", kind: "Team messaging", status: "Disconnected", capabilities: ["Channel context", "Message drafting"] },
  { name: "Notion", kind: "Knowledge workspace", status: "Demo preview", capabilities: ["Page context", "Page drafting"] },
  { name: "MCP services", kind: "Tool protocol", status: "Not configured", capabilities: ["Custom tools", "Scoped permissions"] },
];

export const sampleWorkflows = [
  { name: "Weekly market pulse", schedule: "Every Monday · 09:00", agents: ["Mira Research", "Chief of Staff"], status: "Paused", lastRun: "No connected run history" },
  { name: "Leadership digest", schedule: "Weekdays · 08:30", agents: ["Delta Analyst", "Sage Writer"], status: "Draft", lastRun: "Not scheduled" },
  { name: "Partner review checklist", schedule: "Monthly · 1st day", agents: ["Ops Planner"], status: "Paused", lastRun: "No connected run history" },
];

export const sampleActivity = [
  { icon: CheckCheck, title: "Brief outline prepared", detail: "Leadership brief · Sage Writer", time: "8 min ago", tone: "success" },
  { icon: ShieldCheck, title: "Approval requested", detail: "Partner email draft · Gmail", time: "12 min ago", tone: "warning" },
  { icon: Activity, title: "Research task in progress", detail: "Q4 market expansion · Mira Research", time: "18 min ago", tone: "info" },
  { icon: GitBranch, title: "Dependency needs review", detail: "Workflow audit · Review Engineer", time: "1 hr ago", tone: "danger" },
];

export const demoMetrics = [
  { label: "Configured agents", value: "08", hint: "Assignment demo workspace", icon: Bot },
  { label: "Tasks in sample queue", value: "05", hint: "Illustrative records", icon: ClipboardList },
  { label: "Approval previews", value: "02", hint: "No actions submitted", icon: ShieldCheck },
  { label: "Workflows", value: "03", hint: "All paused or draft", icon: CalendarClock },
];

export const throughputSample = [
  { day: "Mon", tasks: 8, reviewed: 6 },
  { day: "Tue", tasks: 11, reviewed: 8 },
  { day: "Wed", tasks: 7, reviewed: 6 },
  { day: "Thu", tasks: 13, reviewed: 10 },
  { day: "Fri", tasks: 9, reviewed: 7 },
  { day: "Sat", tasks: 5, reviewed: 4 },
  { day: "Sun", tasks: 6, reviewed: 5 },
];

export const systemSignals = [
  { label: "Agent availability", value: "Not connected", icon: Bot },
  { label: "Integration health", value: "Not monitored", icon: Plug },
  { label: "Execution service", value: "Not connected", icon: Gauge },
];