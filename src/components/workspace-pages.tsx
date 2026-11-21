import { useMemo, useState, useEffect, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { executePromptServerFn } from "@/actions/execution";
import {
  Activity,
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Brain,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Flame,
  GitBranch,
  History,
  Key,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  MoreHorizontal,
  Pause,
  Play,
  Plug,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  UsersRound,
  Wifi,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  demoMetrics,
  latencySample,
  navGroups,
  sampleActivity,
  sampleAgents,
  sampleApprovals,
  sampleIntegrations,
  sampleMemoryFiles,
  sampleModelProviders,
  sampleRooms,
  sampleSkills,
  sampleTasks,
  sampleWorkflows,
  systemSignals,
  throughputSample,
  type Agent,
  type ApprovalRequest,
  type Integration,
  type MemoryFile,
  type ModelProvider,
  type PermissionLevel,
  type Room,
  type Skill,
  type Task,
  type TaskStatus,
  type Workflow,
  type WorkspacePageKey,
} from "@/lib/workspace-data";
import { cn } from "@/lib/utils";

/* Status Badge Styles */
const statusColors: Record<string, string> = {
  Active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Running: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 animate-pulse",
  Completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Ready: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "In progress": "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Idle: "border-border bg-muted/60 text-muted-foreground",
  Queued: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Draft: "border-border bg-muted/60 text-muted-foreground",
  Paused: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Needs review": "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  "Waiting for approval": "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Failed: "border-destructive/30 bg-destructive/10 text-destructive",
  Disconnected: "border-border bg-muted text-muted-foreground",
  "Demo preview": "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Mocked: "border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Live: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Available: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "Not configured": "border-border bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 font-medium whitespace-nowrap text-[11px] px-2 py-0.5 rounded-full",
        statusColors[status] ?? "border-border bg-muted text-muted-foreground",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}

export function PageHeading({
  eyebrow = "WORKSPACE",
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[28px]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-xl border border-border bg-card shadow-sm", className)}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold tracking-tight text-foreground">{title}</h2>
            )}
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <Alert className="border-amber-500/30 bg-amber-500/5 text-foreground rounded-lg">
      <CircleAlert className="size-4 text-amber-500" />
      <AlertTitle className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
        Enterprise Safety Preview
      </AlertTitle>
      <AlertDescription className="text-xs leading-5 text-muted-foreground mt-0.5">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export function InlineNotice({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "success" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
      : tone === "warning"
        ? "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300"
        : tone === "danger"
          ? "border-destructive/30 bg-destructive/5 text-destructive dark:text-rose-300"
          : "border-primary/30 bg-primary/5 text-primary";
  return (
    <div
      role="status"
      className={cn("rounded-lg border px-3.5 py-2.5 text-xs leading-5 font-medium", toneClass)}
    >
      {children}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-9 h-9 text-xs"
        aria-label={placeholder}
      />
    </div>
  );
}

export function ActionLink({
  to,
  children,
}: {
  to:
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
  children: ReactNode;
}) {
  return (
    <Button asChild variant="outline" size="sm" className="h-8 text-xs font-medium">
      <Link to={to}>{children}</Link>
    </Button>
  );
}

export function Permission({ level }: { level: PermissionLevel | string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
      <LockKeyhole className="size-3 text-primary" aria-hidden="true" />
      {level}
    </span>
  );
}

export function CodeBlock({ code, language = "json" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-lg border border-border bg-muted/40 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-[11px] text-muted-foreground">
        <span>{language}</span>
        <button
          type="button"
          onClick={copyCode}
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-5">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* =========================================================================
   1. OVERVIEW SCREEN (COMMAND CENTRE)
   ========================================================================= */
export function WorkspaceOverview() {
  const [activityFilter, setActivityFilter] = useState("all");
  const filteredActivity = sampleActivity.filter((item) => {
    if (activityFilter === "all") return true;
    if (activityFilter === "success") return item.tone === "success";
    if (activityFilter === "warning") return item.tone === "warning";
    if (activityFilter === "danger") return item.tone === "danger";
    return true;
  });

  return (
    <>
      <PageHeading
        eyebrow="COMMAND CENTRE · EDXSO ENTERPRISE"
        title="Good morning, Alex Mercer"
        description="Autonomous AI workforce orchestrator. Monitor agent capacity, live pipelines, and governance checkpoints across EDXSO higher education expansion."
        actions={
          <>
            <Button asChild size="sm" className="h-9 gap-1.5 bg-primary text-primary-foreground">
              <Link to="/workspace">
                <MessageSquareText className="size-4" />
                Open Agent Workspace
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-9 gap-1.5">
              <Link to="/tasks">
                <Plus className="size-4" />
                New Task
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-9 gap-1.5">
              <Link to="/rooms">
                <UsersRound className="size-4" />
                Collaboration Rooms
              </Link>
            </Button>
          </>
        }
      />

      {/* 6 Key Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {demoMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors"
              key={metric.label}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-foreground tabular-nums">
                {metric.value}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{metric.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Throughput Chart & System Signals */}
      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(320px,0.85fr)]">
        <Panel
          title="Workforce Activity & Throughput"
          subtitle="7-day tasks prepared vs human review verification steps"
          action={
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="size-2 rounded-sm bg-blue-600 inline-block" /> Prepared
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                <span className="size-2 rounded-sm bg-emerald-500 inline-block" /> Reviewed
              </span>
              <Badge variant="outline" className="ml-2 text-[10px]">
                Weekly Series
              </Badge>
            </div>
          }
        >
          <div className="h-[270px] w-full" role="img" aria-label="Task throughput bar chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={throughputSample}
                margin={{ top: 12, right: 10, bottom: 0, left: -20 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 4"
                  opacity={0.6}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="tasks" name="Prepared Tasks" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar
                  dataKey="reviewed"
                  name="Reviewed Steps"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="System Connection Signals"
          subtitle="Sandbox runtime, model router, and quarantined connectors"
        >
          <div className="space-y-3">
            {systemSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  key={signal.label}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{signal.label}</p>
                      <p className="text-[11px] text-muted-foreground">Monitored local channel</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {signal.value}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-border">
            <InlineNotice tone="info">
              Preview sandbox: Execution prevents unauthorized mutations to external accounts.
            </InlineNotice>
          </div>
        </Panel>
      </div>

      {/* Workforce Activity & Pending Approvals */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Panel
          title="Workforce Live Event Feed"
          subtitle="Real-time multi-agent delegations and state transitions"
          action={
            <div className="flex items-center gap-1.5">
              <Button
                variant={activityFilter === "all" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-[11px] px-2.5"
                onClick={() => setActivityFilter("all")}
              >
                All
              </Button>
              <Button
                variant={activityFilter === "success" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-[11px] px-2.5"
                onClick={() => setActivityFilter("success")}
              >
                Completed
              </Button>
              <Button
                variant={activityFilter === "warning" ? "secondary" : "ghost"}
                size="sm"
                className="h-7 text-[11px] px-2.5"
                onClick={() => setActivityFilter("warning")}
              >
                Approvals
              </Button>
              <ActionLink to="/history">Full History</ActionLink>
            </div>
          }
        >
          <div className="divide-y divide-border">
            {filteredActivity.map((event) => {
              const Icon = event.icon;
              const toneClass =
                event.tone === "success"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : event.tone === "warning"
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : event.tone === "danger"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400";
              return (
                <div
                  className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0"
                  key={event.title}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                      toneClass,
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{event.detail}</p>
                  </div>
                  <time className="shrink-0 pt-0.5 text-[11px] text-muted-foreground font-mono">
                    {event.time}
                  </time>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel
          title="Sensitive Actions Awaiting Review"
          subtitle="Human-in-the-loop verification required"
          action={
            <Button asChild size="sm" variant="outline" className="h-8 text-xs">
              <Link to="/approvals">
                Open Queue <ArrowRight className="ml-1 size-3.5" />
              </Link>
            </Button>
          }
        >
          <div className="space-y-3">
            {sampleApprovals.map((req) => (
              <div
                className="rounded-lg border border-border bg-muted/20 p-3.5 transition-colors hover:border-amber-500/40"
                key={req.id}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold text-primary">{req.id}</span>
                  <StatusBadge status="Waiting for approval" />
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground leading-snug">
                  {req.action}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {req.agent} · {req.service}
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    Risk: {req.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <PreviewNotice>
              Rejection immediately prevents token generation and logs to safety audit.
            </PreviewNotice>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* =========================================================================
   2. AGENT WORKSPACE SCREEN (PRESERVING CONVERSATION EXPERIENCE)
   ========================================================================= */
type ChatMessage = {
  id: string;
  author: "agent" | "user" | "tool" | "error";
  text: string;
  time: string;
  toolCall?: {
    name: string;
    args: string;
    duration: string;
    output: string;
  };
  citations?: string[];
  canRetry?: boolean;
};

export function AgentWorkspacePage() {
  const [selectedId, setSelectedId] = useState(sampleAgents[0]?.id ?? "ag-01");
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const activeAgent = sampleAgents.find((agent) => agent.id === selectedId) ?? sampleAgents[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      author: "user",
      text: "Chief of Staff, we need a 48-hour strategy to evaluate international higher education entry into the UAE and Saudi Arabia. Delegate research, verify tuition benchmarks, and present a risk matrix.",
      time: "09:30 AM",
    },
    {
      id: "m-2",
      author: "agent",
      text: "I have decomposed your directive into 3 parallel execution tracks:\n\n1. **Market Intelligence**: Assigning Mira Research to crawl NCES and GCC accreditation registries.\n2. **Financial Scenarios**: Atlas Finance will model break-even tuition bands and student acquisition unit economics.\n3. **Governance & Risk**: Review Engineer will verify data compliance under FERPA/GDPR boundary standards.\n\nExecuting the initial market scan tool now:",
      time: "09:31 AM",
    },
    {
      id: "m-3",
      author: "tool",
      text: "Tool execution completed.",
      time: "09:31 AM",
      toolCall: {
        name: "nces_education_db.query",
        args: '{\n  "region": "GCC",\n  "institution_type": "University",\n  "target_vertical": "STEM & AI"\n}',
        duration: "142ms",
        output:
          '{\n  "total_accredited": 48,\n  "enrolment_growth_yoy": "14.8%",\n  "avg_stem_tuition_usd": 13400,\n  "regulatory_board": "CAA / MoE UAE"\n}',
      },
    },
    {
      id: "m-4",
      author: "agent",
      text: "Based on the retrieved regional census, I have synthesized preliminary entry signals:\n\n- **Addressable Student Volume**: Estimated 120,000 annual undergraduate enrollments across target zones, with a 14.8% YoY surge in technical degrees.\n- **Tuition Range**: $12,500 – $14,200 per student annual run-rate.\n- **Sensitivity Hazard**: Local partner sponsorship required before student visa issuance.",
      time: "09:32 AM",
      citations: [
        "Source: NCES Global Education Survey 2025 (Doc ID: NCES-GCC-981)",
        "UAE CAA Higher Education Registry Table 4.2",
      ],
    },
    {
      id: "m-5",
      author: "error",
      text: "Simulation warning: Primary Groq endpoint hit rate-limit (120 req/min). Model Router automatically transferred execution context to secondary NVIDIA NIM (Qwen 2.5 72B).",
      time: "09:33 AM",
      canRetry: true,
    },
  ]);

  async function handleSend(event?: FormEvent) {
    if (event) event.preventDefault();
    const prompt = draft.trim();
    if (!prompt || isStreaming) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      author: "user",
      text: prompt,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setIsStreaming(true);

    const isDemo =
      typeof window !== "undefined" &&
      window.localStorage.getItem("opencrewbot-demo-mode") === "true";
    const autoFallback =
      typeof window !== "undefined"
        ? window.localStorage.getItem("opencrewbot-auto-fallback") !== "false"
        : true;
    const preferredProvider =
      (typeof window !== "undefined" &&
        window.localStorage.getItem("opencrewbot-primary-provider")) ||
      "groq";

    try {
      const response = await executePromptServerFn({
        data: {
          prompt,
          modelId: activeAgent.model,
          forceDemo: isDemo,
          autoFallback,
          preferredProvider: preferredProvider as "groq" | "nvidia" | "auto" | "mock",
        },
      });

      if (response?.success && response?.result) {
        const res = response.result;
        const agentMsg: ChatMessage = {
          id: "ag-" + Date.now(),
          author: "agent",
          text: res.text,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          citations: [
            `Provider: ${res.provider.toUpperCase()} (${res.model})`,
            `Latency: ${res.latencyMs}ms | Mode: ${res.isLive ? "Live Inference" : "Simulated/Fallback"}`,
          ],
        };
        setMessages((prev) => [...prev, agentMsg]);

        if (res.errorNotice) {
          setMessages((prev) => [
            ...prev,
            {
              id: "err-notice-" + Date.now(),
              author: "error",
              text: `Auto-Fallback Notice: ${res.errorNotice}`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              canRetry: false,
            },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: "err-" + Date.now(),
            author: "error",
            text: `Execution failed: ${response?.error || "Unknown error"}. (Note: Check Settings to toggle Demo Mode or Automatic Fallback).`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            canRetry: true,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          author: "error",
          text: `Inference error: ${(err as Error).message}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          canRetry: true,
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleRetry(msgId: string) {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === msgId
          ? {
              ...msg,
              author: "agent",
              text: "Failover successful: Execution completed via secondary model (Qwen 2.5 72B). All parameter checks passed.",
              canRetry: false,
            }
          : msg,
      ),
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="CONVERSATION & DELEGATION"
        title="Agent Workspace"
        description="Interact directly with specialized agents, review real-time tool calls, inspect citations, and manage execution context."
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={activeAgent.status} />
            <Badge variant="outline" className="text-xs">
              Model: {activeAgent.model}
            </Badge>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Main Chat Stream */}
        <section className="flex min-h-[720px] flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Active Agent Sub-header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/20 p-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                {activeAgent.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-foreground">{activeAgent.name}</h2>
                  <StatusBadge status={activeAgent.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeAgent.role} · <Permission level={activeAgent.permission} />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger className="w-56 h-9 text-xs" aria-label="Select Agent">
                  <SelectValue placeholder="Switch Agent" />
                </SelectTrigger>
                <SelectContent>
                  {sampleAgents.map((ag) => (
                    <SelectItem key={ag.id} value={ag.id} className="text-xs">
                      {ag.name} ({ag.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6 bg-background/50">
            {messages.map((m) => {
              if (m.author === "user") {
                return (
                  <div className="flex gap-3 flex-row-reverse" key={m.id}>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      AM
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-foreground">
                      <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                        <span className="font-semibold text-primary">Alex Mercer (Lead)</span>
                        <time>{m.time}</time>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                );
              }

              if (m.author === "tool" && m.toolCall) {
                return (
                  <div className="flex gap-3 my-2" key={m.id}>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <TerminalSquare className="size-4" />
                    </div>
                    <div className="max-w-[90%] rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs">
                      <div className="flex items-center justify-between gap-2 border-b border-indigo-500/15 pb-2">
                        <span className="font-mono font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                          <Wrench className="size-3.5" />
                          Tool Invocation: {m.toolCall.name}
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-background">
                          Duration: {m.toolCall.duration}
                        </Badge>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground">
                            Parameters:
                          </p>
                          <CodeBlock code={m.toolCall.args} language="json" />
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground">
                            Result Payload:
                          </p>
                          <CodeBlock code={m.toolCall.output} language="json" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (m.author === "error") {
                return (
                  <div className="flex gap-3 my-2" key={m.id}>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                      <AlertTriangle className="size-4" />
                    </div>
                    <div className="max-w-[90%] rounded-xl border border-destructive/30 bg-destructive/5 p-3.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-destructive flex items-center gap-1.5">
                          Execution Warning / Failover
                        </span>
                        <time className="text-[11px] text-muted-foreground">{m.time}</time>
                      </div>
                      <p className="mt-1 text-muted-foreground leading-relaxed">{m.text}</p>
                      {m.canRetry && (
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                            onClick={() => handleRetry(m.id)}
                          >
                            <RefreshCw className="mr-1.5 size-3" /> Retry via Secondary Route
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Agent message
              return (
                <div className="flex gap-3" key={m.id}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground border border-border">
                    {activeAgent.initials}
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3.5 text-sm text-foreground shadow-sm">
                    <div className="mb-2 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        {activeAgent.name}
                        <Badge variant="secondary" className="text-[10px] font-normal py-0">
                          {activeAgent.model}
                        </Badge>
                      </span>
                      <time>{m.time}</time>
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{m.text}</p>

                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-border">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                          Verified References:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.citations.map((c, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-md bg-muted/70 px-2 py-0.5 text-[11px] text-muted-foreground border border-border"
                            >
                              <FileCheck2 className="size-3 text-primary" />
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground italic pl-11">
                <Sparkles className="size-3.5 text-primary animate-spin" />
                {activeAgent.name} is reasoning and formulating response…
              </div>
            )}
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border bg-muted/20 px-4 py-2">
            <span className="text-[11px] font-semibold text-muted-foreground mr-1">Prompts:</span>
            {[
              "Delegate market scan for K-12 hybrid learning",
              "Inspect FERPA/GDPR risk boundaries",
              "Draft partnership email for University Provost",
              "Run sensitivity analysis on DACH model",
            ].map((promptText) => (
              <button
                type="button"
                key={promptText}
                onClick={() => setDraft(promptText)}
                className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Message Input Composer */}
          <form onSubmit={handleSend} className="border-t border-border p-4 bg-card">
            <label className="sr-only" htmlFor="agent-chat-input">
              Direct message to {activeAgent.name}
            </label>
            <div className="rounded-xl border border-input bg-background focus-within:ring-1 focus-within:ring-primary">
              <Textarea
                id="agent-chat-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  "Message " +
                  activeAgent.name +
                  ' (e.g. "Prepare an executive analysis on partner conversion...")'
                }
                className="min-h-20 resize-none border-0 text-sm shadow-none focus-visible:ring-0 p-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="flex items-center justify-between border-t border-border px-3 py-2 bg-muted/10">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="size-3 text-amber-500" />
                  <span>Streaming emulation active</span>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!draft.trim() || isStreaming}
                  className="h-8 gap-1.5"
                >
                  <Send className="size-3.5" /> Send Message
                </Button>
              </div>
            </div>
          </form>
        </section>

        {/* Agent Context & Inspection Sidebar */}
        <div className="space-y-4">
          <Panel title="Agent Specification" subtitle="Runtime context and parameters">
            <dl className="space-y-3 text-xs">
              <div>
                <dt className="text-muted-foreground font-medium">Specialty</dt>
                <dd className="mt-1 font-semibold text-foreground">{activeAgent.specialty}</dd>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <div>
                  <dt className="text-muted-foreground">Primary Model</dt>
                  <dd className="mt-0.5 font-medium">{activeAgent.model}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Fallback</dt>
                  <dd className="mt-0.5 font-medium">{activeAgent.fallbackModel}</dd>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                <div>
                  <dt className="text-muted-foreground">Permission Gate</dt>
                  <dd className="mt-0.5">
                    <Permission level={activeAgent.permission} />
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Temperature</dt>
                  <dd className="mt-0.5 font-mono">{activeAgent.temperature}</dd>
                </div>
              </div>
            </dl>
          </Panel>

          <Panel title="Assigned Skills & Capabilities">
            <div className="space-y-2">
              {activeAgent.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs"
                >
                  <span className="font-medium text-foreground">{skill}</span>
                  <Badge variant="outline" className="text-[10px]">
                    v1.2
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="System Instructions Preview">
            <div className="rounded-lg bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground font-mono">
              {activeAgent.systemPrompt}
            </div>
          </Panel>

          <PreviewNotice>
            All messages, tool cards, and failover steps operate within the browser sandbox.
          </PreviewNotice>
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   3. AGENT DIRECTORY & DYNAMIC CREATION
   ========================================================================= */
export function AgentDirectoryPage() {
  const [agents, setAgents] = useState<Agent[]>(() => sampleAgents.map((a) => ({ ...a })));
  const [searchQuery, setSearchQuery] = useState("");
  const [permissionFilter, setPermissionFilter] = useState<string>("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [configureAgent, setConfigureAgent] = useState<Agent | null>(null);
  const [nlPrompt, setNlPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [notice, setNotice] = useState("");

  // Manual Creation Fields
  const [draftName, setDraftName] = useState("");
  const [draftRole, setDraftRole] = useState("");
  const [draftSpecialty, setDraftSpecialty] = useState("");
  const [draftModel, setDraftModel] = useState("Llama 3.3 70B");
  const [draftPermission, setDraftPermission] = useState<PermissionLevel>("Review required");

  const filteredAgents = agents.filter((ag) => {
    const matchesQuery =
      ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ag.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPermission = permissionFilter === "All" || ag.permission === permissionFilter;
    return matchesQuery && matchesPermission;
  });

  // Natural language generation logic
  function handleGenerateAgent() {
    if (!nlPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      // Auto-extract and populate from prompt
      setDraftName("Compliance Auditor");
      setDraftRole("Regulatory Risk Officer");
      setDraftSpecialty("FERPA, Title IV accreditation checks & institutional risk audits");
      setDraftModel("Llama 3.3 70B");
      setDraftPermission("Review required");
      setIsGenerating(false);
      setNotice(
        "Natural-language agent specification successfully formulated. Review and save below.",
      );
    }, 900);
  }

  function handleSaveNewAgent(e: FormEvent) {
    e.preventDefault();
    if (!draftName.trim() || !draftSpecialty.trim()) return;
    const initials = draftName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");

    const newAgent: Agent = {
      id: "ag-draft-" + Date.now(),
      name: draftName.trim(),
      role: draftRole.trim() || "Specialized Agent",
      specialty: draftSpecialty.trim(),
      model: draftModel,
      fallbackModel: "Qwen 2.5 72B",
      status: "Active",
      permission: draftPermission,
      skills: ["Data Analysis", "Code Review"],
      tools: ["sec_scanner", "rag_retrieval"],
      initials: initials || "AG",
      systemPrompt:
        "You are " +
        draftName.trim() +
        ". Focus on " +
        draftSpecialty.trim() +
        " with zero unverified assumptions.",
      outputFormat: "Formal compliance memo.",
      temperature: 0.2,
    };

    setAgents((prev) => [newAgent, ...prev]);
    setCreateOpen(false);
    setNotice("Agent " + newAgent.name + " deployed to local workspace roster.");
    setDraftName("");
    setDraftRole("");
    setDraftSpecialty("");
    setNlPrompt("");
  }

  return (
    <>
      <PageHeading
        eyebrow="WORKFORCE DIRECTORY"
        title="Agent Directory & Generation"
        description="Review 8 specialized enterprise agents, inspect model routing, and deploy new autonomous agents via natural language."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> Deploy Agent
          </Button>
        }
      />

      {notice && (
        <div className="mb-4">
          <InlineNotice tone="success">{notice}</InlineNotice>
        </div>
      )}

      {/* Filters & Search */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search agents by role or specialty…"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Select value={permissionFilter} onValueChange={setPermissionFilter}>
            <SelectTrigger className="w-44 h-9 text-xs">
              <SelectValue placeholder="Permission Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Permissions</SelectItem>
              <SelectItem value="Read only">Read only</SelectItem>
              <SelectItem value="Review required">Review required</SelectItem>
              <SelectItem value="Autonomous">Autonomous</SelectItem>
            </SelectContent>
          </Select>
          <StatusBadge status={agents.length + " configured"} />
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredAgents.map((ag) => (
          <article
            key={ag.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                    {ag.initials}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">{ag.name}</h2>
                    <p className="text-xs text-muted-foreground">{ag.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={() => setConfigureAgent(ag)}
                  aria-label={"Configure " + ag.name}
                >
                  <Settings2 className="size-4" />
                </Button>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground min-h-[38px]">
                {ag.specialty}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Model</span>
                  <p className="font-semibold text-foreground mt-0.5">{ag.model}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Gate</span>
                  <div className="mt-0.5">
                    <Permission level={ag.permission} />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {ag.skills.slice(0, 2).map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px] font-normal py-0">
                    {s}
                  </Badge>
                ))}
                {ag.skills.length > 2 && (
                  <Badge variant="outline" className="text-[10px] font-normal py-0">
                    +{ag.skills.length - 2}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <StatusBadge status={ag.status} />
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
                <Link to="/workspace">
                  Chat <ChevronRight className="size-3" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Deploy Agent Modal with Natural Language Generation */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Deploy New Autonomous Agent</DialogTitle>
            <DialogDescription>
              Use Natural Language to describe what capability you need, or configure parameters
              manually.
            </DialogDescription>
          </DialogHeader>

          {/* Natural Language Prompt Area */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5 space-y-2">
            <label className="text-xs font-semibold text-primary flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              Natural-Language Agent Formulation
            </label>
            <div className="flex gap-2">
              <Input
                value={nlPrompt}
                onChange={(e) => setNlPrompt(e.target.value)}
                placeholder='e.g. "Create a compliance auditor who checks accreditation standards and FERPA rules"'
                className="text-xs bg-background"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleGenerateAgent}
                disabled={!nlPrompt.trim() || isGenerating}
                className="shrink-0 h-9"
              >
                {isGenerating ? <RefreshCw className="size-3.5 animate-spin" /> : "Generate"}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSaveNewAgent} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs space-y-1">
                <span className="font-medium text-foreground">Agent Name</span>
                <Input
                  required
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g. Compliance Auditor"
                />
              </label>
              <label className="block text-xs space-y-1">
                <span className="font-medium text-foreground">Functional Role</span>
                <Input
                  required
                  value={draftRole}
                  onChange={(e) => setDraftRole(e.target.value)}
                  placeholder="e.g. Regulatory Specialist"
                />
              </label>
            </div>

            <label className="block text-xs space-y-1">
              <span className="font-medium text-foreground">Specialty & Mandate</span>
              <Textarea
                required
                value={draftSpecialty}
                onChange={(e) => setDraftSpecialty(e.target.value)}
                placeholder="What operational scope will this agent own?"
                className="min-h-16 text-xs"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs space-y-1">
                <span className="font-medium text-foreground">Primary Model</span>
                <Select value={draftModel} onValueChange={setDraftModel}>
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Llama 3.3 70B">Llama 3.3 70B (Groq)</SelectItem>
                    <SelectItem value="Qwen 2.5 72B">Qwen 2.5 72B (NVIDIA NIM)</SelectItem>
                    <SelectItem value="Llama 3.1 8B">Llama 3.1 8B (Fast)</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="block text-xs space-y-1">
                <span className="font-medium text-foreground">Permission Gate</span>
                <Select
                  value={draftPermission}
                  onValueChange={(v) => setDraftPermission(v as PermissionLevel)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Read only">Read only</SelectItem>
                    <SelectItem value="Review required">Review required</SelectItem>
                    <SelectItem value="Autonomous">Autonomous</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <PreviewNotice>
              Saving adds an active agent configuration to the local runtime roster.
            </PreviewNotice>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Deploy to Workspace</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Configure Agent Dialog */}
      <Dialog
        open={Boolean(configureAgent)}
        onOpenChange={(open) => !open && setConfigureAgent(null)}
      >
        {configureAgent && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Configure {configureAgent.name}</DialogTitle>
              <DialogDescription>
                Modify execution parameters and permission gates for this agent.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">
                  System Prompt Instructions
                </label>
                <Textarea
                  defaultValue={configureAgent.systemPrompt}
                  className="min-h-24 font-mono text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block mb-1">Model Assigned</span>
                  <Badge variant="outline">{configureAgent.model}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Permission Level</span>
                  <Permission level={configureAgent.permission} />
                </div>
              </div>
              <InlineNotice tone="info">
                Settings take effect immediately across conversational and task pipelines.
              </InlineNotice>
              <DialogFooter>
                <Button
                  onClick={() => {
                    setNotice("Updated " + configureAgent.name + " settings.");
                    setConfigureAgent(null);
                  }}
                >
                  Save Configuration
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

/* =========================================================================
   4. COLLABORATION ROOMS
   ========================================================================= */
export function CollaborationRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(() => sampleRooms.map((r) => ({ ...r })));
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState<Room["mode"]>("Parallel");
  const [notice, setNotice] = useState("");

  function handleCreateRoom(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !goal.trim()) return;
    const newRoom: Room = {
      id: "room-" + Date.now(),
      name: name.trim(),
      goal: goal.trim(),
      agents: ["Chief of Staff", "Mira Research"],
      mode,
      status: "In progress",
      updated: "Just now",
      deliverable: "Strategic synthesis report",
      verificationRequired: true,
      steps: [
        {
          id: "s1",
          title: "Information gathering & market extraction",
          owner: "Mira Research",
          state: "active",
        },
        { id: "s2", title: "Executive brief generation", owner: "Chief of Staff", state: "queued" },
      ],
      discussions: [
        {
          author: "Chief of Staff",
          role: "Orchestrator",
          time: "Just now",
          text:
            'New collaboration goal set: "' + goal.trim() + '". Initiating coordinated workflow.',
        },
      ],
    };
    setRooms((prev) => [newRoom, ...prev]);
    setCreateOpen(false);
    setNotice('Collaboration room "' + newRoom.name + '" opened.');
    setName("");
    setGoal("");
  }

  return (
    <>
      <PageHeading
        eyebrow="MULTI-AGENT ORCHESTRATION"
        title="Collaboration Rooms"
        description="4 active mission rooms where agents debate, execute parallel or sequential dependency flows, and verify deliverables."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> New Room
          </Button>
        }
      />

      {notice && (
        <div className="mb-4">
          <InlineNotice tone="success">{notice}</InlineNotice>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {rooms.map((room) => (
          <article
            key={room.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">{room.name}</h2>
                    <StatusBadge status={room.status} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {room.goal}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] uppercase tracking-wider",
                    room.mode === "Parallel"
                      ? "border-blue-500/30 text-blue-600 dark:text-blue-400"
                      : "border-purple-500/30 text-purple-600 dark:text-purple-400",
                  )}
                >
                  <GitBranch className="mr-1 size-3" />
                  {room.mode} Mode
                </Badge>
              </div>

              {/* Visual Task Dependency Pipeline */}
              <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Task Execution Flow:
                </p>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {room.steps.map((st, idx) => (
                    <div key={st.id} className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "rounded-md px-2.5 py-1 text-[11px] font-medium border",
                          st.state === "completed"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                            : st.state === "active"
                              ? "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 animate-pulse"
                              : "bg-muted border-border text-muted-foreground",
                        )}
                      >
                        {st.title} ({st.owner})
                      </span>
                      {idx < room.steps.length - 1 && (
                        <ArrowRight className="size-3 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Participating Agents */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground font-medium mr-1">Roster:</span>
                {room.agents.map((ag) => (
                  <Badge key={ag} variant="secondary" className="text-xs">
                    <Bot className="mr-1 size-3" />
                    {ag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Updated {room.updated}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedRoom(room)}
                className="gap-1.5 h-8 text-xs"
              >
                Inspect Discussion & Deliverable <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Room Detail Modal (Discussion Stream + Deliverable) */}
      <Dialog open={Boolean(selectedRoom)} onOpenChange={(open) => !open && setSelectedRoom(null)}>
        {selectedRoom && (
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{selectedRoom.name}</DialogTitle>
                <StatusBadge status={selectedRoom.status} />
              </div>
              <DialogDescription>{selectedRoom.goal}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Deliverable Box */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Target Deliverable
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  {selectedRoom.deliverable}
                </p>
                {selectedRoom.verificationRequired && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    Human-in-the-loop verification gate required before external dispatch.
                  </p>
                )}
              </div>

              {/* Multi-Agent Discussion Log */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Inter-Agent Coordination Stream:
                </p>
                <div className="space-y-2.5">
                  {selectedRoom.discussions.map((d, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-3 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span className="font-bold text-foreground">
                          {d.author} ({d.role})
                        </span>
                        <span>{d.time}</span>
                      </div>
                      <p className="text-foreground leading-relaxed">{d.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setNotice("Triggered verification check for " + selectedRoom.name + ".");
                  setSelectedRoom(null);
                }}
              >
                Verify Execution Graph
              </Button>
              <Button onClick={() => setSelectedRoom(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Create Room Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Open Collaboration Room</DialogTitle>
            <DialogDescription>
              Define strategic objective and coordinate multi-agent teams.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRoom} className="space-y-3.5">
            <label className="block text-xs space-y-1">
              <span className="font-medium text-foreground">Room Name</span>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q1 Curriculum Audit"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="font-medium text-foreground">Strategic Goal</span>
              <Textarea
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="What must the agents achieve collaboratively?"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="font-medium text-foreground">Execution Flow</span>
              <Select value={mode} onValueChange={(v) => setMode(v as Room["mode"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parallel">Parallel (Concurrent tracks)</SelectItem>
                  <SelectItem value="Sequential">Sequential (Linear pipeline)</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <PreviewNotice>
              Creates an active collaboration space within the local workspace.
            </PreviewNotice>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Open Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* =========================================================================
   5. TASK EXECUTION DASHBOARD
   ========================================================================= */
export function TaskExecutionPage() {
  const [tasks, setTasks] = useState<Task[]>(() => sampleTasks.map((t) => ({ ...t })));
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [inspectTask, setInspectTask] = useState<Task | null>(null);
  const [notice, setNotice] = useState("");

  const filteredTasks = tasks.filter((t) => {
    const matchesQuery =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.agent.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All statuses" || t.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  function handleRetry(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "Running" as TaskStatus,
              duration: "00:01",
              updated: "Just now",
              retries: t.retries + 1,
              errorLog: undefined,
            }
          : t,
      ),
    );
    setNotice("Task " + taskId + " transitioned to Running: retry initiated.");
    if (inspectTask && inspectTask.id === taskId) {
      setInspectTask(null);
    }
  }

  function handleCancel(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "Failed" as TaskStatus, updated: "Cancelled by user" }
          : t,
      ),
    );
    setNotice("Task " + taskId + " cancelled.");
  }

  return (
    <>
      <PageHeading
        eyebrow="PIPELINES & CONTROLS"
        title="Task Execution Dashboard"
        description="Monitor active task execution queues, retries, input payloads, dependencies, and recovery controls."
        actions={
          <Badge variant="outline" className="text-xs">
            {tasks.length} Tracked Tasks
          </Badge>
        }
      />

      {notice && (
        <div className="mb-4">
          <InlineNotice tone="info">{notice}</InlineNotice>
        </div>
      )}

      {/* Task Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search by ID, agent, or task description…"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-52 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "All statuses",
              "Running",
              "Waiting for approval",
              "Completed",
              "Failed",
              "Queued",
            ].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task Execution Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Task ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Assigned Agent</TableHead>
              <TableHead>Collaboration Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Retries</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {t.id}
                </TableCell>
                <TableCell className="font-medium text-xs max-w-xs">{t.description}</TableCell>
                <TableCell className="text-xs">{t.agent}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{t.room}</TableCell>
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell className="font-mono text-xs tabular-nums">{t.duration}</TableCell>
                <TableCell className="text-xs">{t.retries}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => setInspectTask(t)}
                    >
                      Inspect
                    </Button>
                    {t.status === "Failed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-amber-500/30 text-amber-600 dark:text-amber-400"
                        onClick={() => handleRetry(t.id)}
                      >
                        <RefreshCw className="size-3 mr-1" /> Retry
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Task Inspection Drawer / Modal */}
      <Dialog open={Boolean(inspectTask)} onOpenChange={(open) => !open && setInspectTask(null)}>
        {inspectTask && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{inspectTask.id}</DialogTitle>
                <StatusBadge status={inspectTask.status} />
              </div>
              <DialogDescription>{inspectTask.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-border bg-muted/20">
                <div>
                  <span className="text-muted-foreground">Agent</span>
                  <p className="font-semibold text-foreground mt-0.5">{inspectTask.agent}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dependencies</span>
                  <p className="font-medium text-foreground mt-0.5">{inspectTask.dependency}</p>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground font-semibold block mb-1">
                  Input Parameters:
                </span>
                <CodeBlock code={inspectTask.inputPayload} language="json" />
              </div>

              {inspectTask.outputSummary && (
                <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold block mb-1">
                    Output Summary:
                  </span>
                  <p className="text-foreground leading-relaxed">{inspectTask.outputSummary}</p>
                </div>
              )}

              {inspectTask.errorLog && (
                <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5">
                  <span className="text-destructive font-semibold block mb-1">
                    Execution Error Log:
                  </span>
                  <p className="font-mono text-destructive leading-relaxed">
                    {inspectTask.errorLog}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              {inspectTask.status === "Failed" && (
                <Button variant="default" onClick={() => handleRetry(inspectTask.id)}>
                  <RefreshCw className="mr-1.5 size-3.5" /> Retry Execution
                </Button>
              )}
              {inspectTask.status === "Running" && (
                <Button variant="outline" onClick={() => handleCancel(inspectTask.id)}>
                  Halt Task
                </Button>
              )}
              <Button variant="outline" onClick={() => setInspectTask(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

/* =========================================================================
   6. SKILLS & TOOLS MANAGER
   ========================================================================= */
export function SkillsPage() {
  const [skills] = useState<Skill[]>(sampleSkills);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [testResult, setTestResult] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  const filteredSkills = skills.filter((sk) => {
    const matchesCategory = categoryFilter === "All" || sk.category === categoryFilter;
    const matchesSearch =
      sk.name.toLowerCase().includes(search.toLowerCase()) ||
      sk.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function handleTestSkill() {
    setIsTesting(true);
    setTestResult("");
    setTimeout(() => {
      setIsTesting(false);
      setTestResult(
        JSON.stringify(
          {
            status: "SUCCESS",
            executionTime: "184ms",
            output: {
              market_size_usd: 4800000000,
              cagr: 14.8,
              key_players: ["EDXSO Core", "GEMS Education", "Coursera Enterprise"],
              confidence_score: 0.94,
            },
          },
          null,
          2,
        ),
      );
    }, 800);
  }

  return (
    <>
      <PageHeading
        eyebrow="INTELLIGENCE CATALOG"
        title="Skills & Tools Manager"
        description="8 reusable enterprise agent skills across research, quantitative modeling, code inspection, and growth outreach."
        actions={
          <Badge variant="outline" className="text-xs">
            8 Certified Skills
          </Badge>
        }
      />

      {/* Filter Bar */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search skills by name or capability…"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "All",
              "Research",
              "Analysis",
              "Creation",
              "Communication",
              "Engineering",
              "Growth",
            ].map((c) => (
              <SelectItem key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredSkills.map((sk) => (
          <article
            key={sk.name}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary/40 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    {sk.category}
                  </span>
                  <h2 className="text-sm font-bold text-foreground mt-0.5">{sk.name}</h2>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  v{sk.version}
                </Badge>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground min-h-[44px]">
                {sk.description}
              </p>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-[11px]">
                <Permission level={sk.permission} />
                <span className="text-muted-foreground">
                  {sk.toolsRequired.length} tools attached
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <StatusBadge status={sk.isAvailable ? "Ready" : "Disconnected"} />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => {
                  setSelectedSkill(sk);
                  setTestResult("");
                }}
              >
                Inspect Schema <ChevronRight className="size-3 ml-1" />
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Skill Schema & Test Modal */}
      <Dialog
        open={Boolean(selectedSkill)}
        onOpenChange={(open) => !open && setSelectedSkill(null)}
      >
        {selectedSkill && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>{selectedSkill.name}</DialogTitle>
                <Badge variant="secondary">v{selectedSkill.version}</Badge>
              </div>
              <DialogDescription>{selectedSkill.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <span className="text-muted-foreground font-semibold block mb-1">
                  Formal Input JSON Schema:
                </span>
                <CodeBlock code={selectedSkill.inputSchema} language="json" />
              </div>

              <div>
                <span className="text-muted-foreground font-semibold block mb-1">
                  Expected Output Schema:
                </span>
                <CodeBlock code={selectedSkill.outputSchema} language="json" />
              </div>

              <div className="p-3 rounded-lg border border-border bg-muted/20">
                <p className="font-semibold text-foreground mb-1">Attached Tools:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkill.toolsRequired.map((t) => (
                    <Badge key={t} variant="outline" className="font-mono text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              {testResult && (
                <div className="space-y-1">
                  <span className="text-emerald-600 font-semibold block">
                    Execution Test Payload:
                  </span>
                  <CodeBlock code={testResult} language="json" />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="secondary" onClick={handleTestSkill} disabled={isTesting}>
                {isTesting ? (
                  <RefreshCw className="size-3 animate-spin mr-1.5" />
                ) : (
                  <Play className="size-3 mr-1.5" />
                )}
                Run Test Execution
              </Button>
              <Button variant="outline" onClick={() => setSelectedSkill(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

/* =========================================================================
   7. MEMORY MANAGER (MARKDOWN-FIRST ARCHITECTURE)
   ========================================================================= */
export function MemoryManagerPage() {
  const [files, setFiles] = useState<MemoryFile[]>(sampleMemoryFiles);
  const [activeFileName, setActiveFileName] = useState("workspace.md");
  const [editContent, setEditContent] = useState(sampleMemoryFiles[0]?.text ?? "");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [savedNotice, setSavedNotice] = useState(false);

  const activeFile = files.find((f) => f.name === activeFileName) ?? files[0];

  function handleSelectFile(f: MemoryFile) {
    setActiveFileName(f.name);
    setEditContent(f.text);
    setSavedNotice(false);
  }

  function handleSave() {
    setFiles((prev) =>
      prev.map((f) =>
        f.name === activeFileName ? { ...f, text: editContent, lastUpdated: "Just now" } : f,
      ),
    );
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  return (
    <>
      <PageHeading
        eyebrow="PERSISTENT ARCHITECTURE"
        title="Memory Manager"
        description="Markdown-first persistent agent memory. Preserves project principles, architectural decision records (ADRs), user preferences, and multi-agent learnings."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={viewMode === "edit" ? "secondary" : "ghost"}
              onClick={() => setViewMode("edit")}
              className="h-8 text-xs"
            >
              Markdown Source
            </Button>
            <Button
              size="sm"
              variant={viewMode === "preview" ? "secondary" : "ghost"}
              onClick={() => setViewMode("preview")}
              className="h-8 text-xs"
            >
              Rendered Preview
            </Button>
          </div>
        }
      />

      <div className="grid min-h-[660px] grid-cols-1 overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left File Explorer */}
        <aside className="border-b border-border bg-muted/20 p-3.5 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between px-2 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Database className="size-3.5 text-primary" /> Memory Scopes
            </h2>
            <Badge variant="outline" className="text-[10px]">
              {files.length}
            </Badge>
          </div>

          <nav className="space-y-1">
            {files.map((file) => {
              const isActive = file.name === activeFileName;
              return (
                <button
                  type="button"
                  key={file.name}
                  onClick={() => handleSelectFile(file)}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left text-xs transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <FileText className="size-4 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono">{file.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground mt-0.5">{file.type}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 p-3 rounded-lg border border-border bg-card text-[11px] space-y-1.5">
            <p className="font-semibold text-foreground">Memory Provenance:</p>
            <p className="text-muted-foreground">Author: {activeFile.author}</p>
            <p className="text-muted-foreground">Modified: {activeFile.lastUpdated}</p>
          </div>
        </aside>

        {/* Right Editor / Preview */}
        <div className="flex min-w-0 flex-col">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/10">
            <div>
              <p className="font-mono text-xs font-bold text-foreground">{activeFile.name}</p>
              <p className="text-[11px] text-muted-foreground">{activeFile.purpose}</p>
            </div>
            <div className="flex items-center gap-2">
              {savedNotice && (
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="size-3.5" /> Saved to preview
                </span>
              )}
              <Button size="sm" onClick={handleSave} className="h-8 gap-1.5">
                <Check className="size-3.5" /> Save Memory
              </Button>
            </div>
          </div>

          {viewMode === "edit" ? (
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 min-h-[480px] resize-none border-0 font-mono text-xs leading-relaxed p-4 focus-visible:ring-0 shadow-none"
              aria-label="Markdown memory editor"
            />
          ) : (
            <div className="flex-1 p-6 overflow-y-auto prose dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap">
              {editContent}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   8. MODEL CONFIGURATION
   ========================================================================= */
export function ModelConfigurationPage() {
  const [providers] = useState<ModelProvider[]>(sampleModelProviders);
  const [primaryModel, setPrimaryModel] = useState("Llama 3.3 70B Versatile");
  const [fallbackModel, setFallbackModel] = useState("Qwen 2.5 72B Instruct");
  const [tokenEst, setTokenEst] = useState("500000");
  const [notice, setNotice] = useState("");

  const estCostGroq = ((Number(tokenEst) / 1000000) * 0.69).toFixed(3);
  const estCostNim = ((Number(tokenEst) / 1000000) * 0.8).toFixed(3);

  return (
    <>
      <PageHeading
        eyebrow="FOUNDATION MODELS"
        title="Model Configuration & Routing"
        description="Configure Groq, NVIDIA NIM, and secondary providers. Implement task-based routing without exposing sensitive credentials in browser code."
        actions={
          <Badge variant="outline" className="text-xs">
            3 Active Providers
          </Badge>
        }
      />

      {notice && (
        <div className="mb-4">
          <InlineNotice tone="success">{notice}</InlineNotice>
        </div>
      )}

      {/* Provider Status Tiles */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {providers.map((p) => (
          <div key={p.name} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Cpu className="size-4 text-primary" /> {p.name}
              </h2>
              <StatusBadge status={p.status} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.description}</p>
            <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-muted-foreground">Latency</span>
                <p className="font-semibold text-foreground mt-0.5">{p.latency}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cost / 1M</span>
                <p className="font-semibold text-foreground mt-0.5">{p.costPerMillion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        {/* Routing Policies Form */}
        <Panel
          title="Global Routing & Fallback Policies"
          subtitle="Direct queries to optimal models based on task taxonomy"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setNotice("Model routing preferences updated for all active agents.");
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="font-semibold text-foreground">Primary Reasoning Model</span>
                <Select value={primaryModel} onValueChange={setPrimaryModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Llama 3.3 70B Versatile">Llama 3.3 70B (Groq)</SelectItem>
                    <SelectItem value="Qwen 2.5 72B Instruct">Qwen 2.5 72B (NVIDIA NIM)</SelectItem>
                    <SelectItem value="GPT-4o">GPT-4o (OpenAI)</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="block space-y-1">
                <span className="font-semibold text-foreground">Failover Fallback Model</span>
                <Select value={fallbackModel} onValueChange={setFallbackModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Qwen 2.5 72B Instruct">Qwen 2.5 72B (NVIDIA NIM)</SelectItem>
                    <SelectItem value="Llama 3.1 8B Instant">Llama 3.1 8B (Fast)</SelectItem>
                    <SelectItem value="GPT-4o mini">GPT-4o mini</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-3.5 space-y-2">
              <p className="font-bold text-foreground">Task-Based Routing Matrix:</p>
              <div className="divide-y divide-border text-[11px]">
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Market Research & Scans</span>
                  <span className="font-mono font-medium">Llama 3.3 70B</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Financial Scenario Modelling</span>
                  <span className="font-mono font-medium">Qwen 2.5 72B</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Code Quality & AST Review</span>
                  <span className="font-mono font-medium">Qwen 2.5 72B</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-muted-foreground">Outreach & Executive Drafting</span>
                  <span className="font-mono font-medium">Llama 3.1 8B</span>
                </div>
              </div>
            </div>

            <Button type="submit">Save Routing Policies</Button>
          </form>
        </Panel>

        {/* Token Calculator & Security Notice */}
        <div className="space-y-4">
          <Panel title="Token & Cost Estimator" subtitle="Simulate monthly enterprise volume">
            <div className="space-y-3 text-xs">
              <label className="block space-y-1">
                <span className="text-muted-foreground">Estimated Monthly Tokens</span>
                <Input
                  type="number"
                  value={tokenEst}
                  onChange={(e) => setTokenEst(e.target.value)}
                  className="font-mono text-xs"
                />
              </label>

              <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span>Groq Estimated Cost:</span>
                  <span className="font-bold font-mono">${estCostGroq}</span>
                </div>
                <div className="flex justify-between">
                  <span>NVIDIA NIM Estimated Cost:</span>
                  <span className="font-bold font-mono">${estCostNim}</span>
                </div>
              </div>
            </div>
          </Panel>

          <PreviewNotice>
            Keys and bearer tokens remain quarantined in server-side secret vaults.
          </PreviewNotice>
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   9. APPROVAL CENTRE (HUMAN-IN-THE-LOOP SAFETY GATE)
   ========================================================================= */
export function ApprovalCentrePage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(sampleApprovals);
  const [selectedAction, setSelectedAction] = useState<ApprovalRequest | null>(null);
  const [notice, setNotice] = useState("");
  const [preventedLog, setPreventedLog] = useState<{ id: string; time: string; action: string }[]>(
    [],
  );

  function handleApprove(id: string) {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    setNotice("Request " + id + " approved: execution token released to external sandbox.");
    setSelectedAction(null);
  }

  function handleReject(id: string) {
    const target = approvals.find((a) => a.id === id);
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    if (target) {
      setPreventedLog((prev) => [
        {
          id: target.id,
          time: new Date().toLocaleTimeString(),
          action: target.action,
        },
        ...prev,
      ]);
    }
    setNotice("EXECUTION PREVENTED: Action " + id + " blocked and logged to security audit log.");
    setSelectedAction(null);
  }

  return (
    <>
      <PageHeading
        eyebrow="GOVERNANCE & SAFETY"
        title="Approval Centre"
        description="Human-in-the-loop gatekeeper. All sensitive external mutations (Gmail, Notion, Slack) require explicit human sign-off before dispatch."
        actions={
          <Badge variant="outline" className="text-xs">
            {approvals.length} Pending Actions
          </Badge>
        }
      />

      {notice && (
        <div className="mb-4">
          <InlineNotice tone={notice.includes("PREVENTED") ? "danger" : "success"}>
            {notice}
          </InlineNotice>
        </div>
      )}

      {/* Approvals Table */}
      <div className="mb-6 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Request ID</TableHead>
              <TableHead>Proposed Action</TableHead>
              <TableHead>Requesting Agent</TableHead>
              <TableHead>External Service</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Decision Controls</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {req.id}
                </TableCell>
                <TableCell className="text-xs font-medium max-w-sm">{req.action}</TableCell>
                <TableCell className="text-xs">{req.agent}</TableCell>
                <TableCell className="text-xs">
                  <Badge variant="outline">{req.service}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      req.risk === "High"
                        ? "border-destructive/30 bg-destructive/10 text-destructive"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-600",
                    )}
                  >
                    {req.risk} Risk
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{req.time}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => setSelectedAction(req)}
                    >
                      <Eye className="size-3 mr-1" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="h-7 text-xs"
                      onClick={() => handleReject(req.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {approvals.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                  No actions currently waiting for approval. All queues clear.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rejection / Prevention Audit History */}
      {preventedLog.length > 0 && (
        <Panel
          title="Safety Prevention Audit Trail"
          subtitle="Immutable log of actions rejected to protect external integrity"
        >
          <div className="divide-y divide-border">
            {preventedLog.map((log, i) => (
              <div key={i} className="flex items-center justify-between py-2 text-xs">
                <span className="font-mono text-destructive font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="size-3.5" /> {log.id} BLOCKED
                </span>
                <span className="text-muted-foreground">{log.action}</span>
                <span className="text-[11px] text-muted-foreground font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Action Preview Modal */}
      <Dialog
        open={Boolean(selectedAction)}
        onOpenChange={(open) => !open && setSelectedAction(null)}
      >
        {selectedAction && (
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle>Payload Inspection: {selectedAction.id}</DialogTitle>
                <Badge variant="destructive">{selectedAction.risk} Risk</Badge>
              </div>
              <DialogDescription>{selectedAction.detail}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 rounded-lg border border-border bg-muted/20 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Target Service:</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedAction.service}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Originating Agent:</span>
                  <p className="font-bold text-foreground mt-0.5">{selectedAction.agent}</p>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground font-semibold block mb-1">
                  Proposed External Dispatch Payload:
                </span>
                <pre className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                  {selectedAction.proposedPayload}
                </pre>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="destructive" onClick={() => handleReject(selectedAction.id)}>
                Reject (Halt Execution)
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleApprove(selectedAction.id)}
              >
                Approve & Release
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

/* =========================================================================
   10. INTEGRATIONS MANAGER
   ========================================================================= */
export function IntegrationsPage() {
  const [integrations] = useState<Integration[]>(sampleIntegrations);
  const [testModal, setTestModal] = useState<Integration | null>(null);
  const [testingStep, setTestingStep] = useState(0);

  function startConnectionTest(item: Integration) {
    setTestModal(item);
    setTestingStep(1);
    setTimeout(() => setTestingStep(2), 700);
    setTimeout(() => setTestingStep(3), 1400);
  }

  return (
    <>
      <PageHeading
        eyebrow="ECOSYSTEM & CONNECTOR GATEWAY"
        title="Integration Manager"
        description="Enterprise tool connections: GitHub, Gmail, Slack, Notion, and local Model Context Protocol (MCP) services."
        actions={
          <Badge variant="outline" className="text-xs">
            5 Registered Connectors
          </Badge>
        }
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((item) => (
          <article
            key={item.name}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Plug className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">{item.name}</h2>
                    <p className="text-xs text-muted-foreground">{item.kind}</p>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>

              <div className="mt-4 border-t border-border pt-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Granted Capabilities:
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.capabilities.map((c) => (
                    <Badge key={c} variant="secondary" className="text-[10px] font-normal py-0">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground font-mono">{item.latency}</span>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => startConnectionTest(item)}
              >
                Test Connection
              </Button>
            </div>
          </article>
        ))}
      </div>

      {/* Test Connection Dialog */}
      <Dialog open={Boolean(testModal)} onOpenChange={(open) => !open && setTestModal(null)}>
        {testModal && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Testing {testModal.name} Gateway</DialogTitle>
              <DialogDescription>
                Executing simulated ping, authorization handshake, and sandbox checks.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                {testingStep >= 1 ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <RefreshCw className="size-4 animate-spin text-muted-foreground" />
                )}
                <span>
                  DNS Resolution & Endpoint Handshake: <strong>OK (12ms)</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {testingStep >= 2 ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <RefreshCw className="size-4 animate-spin text-muted-foreground" />
                )}
                <span>
                  Scoped Permission Authorization: <strong>{testModal.permissions}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {testingStep >= 3 ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <RefreshCw className="size-4 animate-spin text-muted-foreground" />
                )}
                <span>
                  Sandbox Quarantine Boundary Check: <strong>Enforced</strong>
                </span>
              </div>

              {testingStep === 3 && (
                <div className="mt-3 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 font-medium">
                  Connection test verified: The connector is ready for safe simulated agent
                  operations.
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setTestModal(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

/* =========================================================================
   11. SCHEDULED WORKFLOWS
   ========================================================================= */
export function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [cron, setCron] = useState("0 9 * * 1");
  const [notice, setNotice] = useState("");

  function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const newWf: Workflow = {
      id: "wf-" + Date.now(),
      name: name.trim(),
      schedule: schedule.trim() || "Weekly",
      cron,
      agents: ["Chief of Staff", "Mira Research"],
      status: "Active",
      lastRun: "Never",
      nextRun: "In 1 day",
      successRate: "100%",
      description: "Custom autonomous recurring pipeline.",
    };
    setWorkflows((prev) => [newWf, ...prev]);
    setCreateOpen(false);
    setNotice('Workflow "' + newWf.name + '" created.');
    setName("");
    setSchedule("");
  }

  function toggleStatus(id: string) {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === "Active" ? "Paused" : "Active" } : w,
      ),
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="RECURRING AUTOMATION"
        title="Scheduled Workflows"
        description="Autonomous cron schedules, periodic intelligence gathering, and executive digest distribution."
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="size-4" /> New Workflow
          </Button>
        }
      />

      {notice && (
        <div className="mb-4">
          <InlineNotice tone="success">{notice}</InlineNotice>
        </div>
      )}

      <div className="space-y-4">
        {workflows.map((wf) => (
          <article
            key={wf.id}
            className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-center"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">{wf.name}</h2>
                <StatusBadge status={wf.status} />
              </div>
              <p className="text-xs text-muted-foreground">{wf.description}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 font-mono">
                  <Clock3 className="size-3 text-primary" /> {wf.schedule} ({wf.cron})
                </span>
                <span>Agents: {wf.agents.join(", ")}</span>
                <span className="font-semibold text-emerald-600">Success: {wf.successRate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() =>
                  setNotice('Manual trigger sent for "' + wf.name + '". Execution queued.')
                }
              >
                <Play className="size-3 mr-1" /> Run Now
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => toggleStatus(wf.id)}
              >
                {wf.status === "Active" ? (
                  <Pause className="size-3 mr-1" />
                ) : (
                  <Play className="size-3 mr-1" />
                )}
                {wf.status === "Active" ? "Pause" : "Resume"}
              </Button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Scheduled Workflow</DialogTitle>
            <DialogDescription>Set recurring multi-agent execution rules.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3.5">
            <label className="block text-xs space-y-1">
              <span className="font-medium text-foreground">Workflow Title</span>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Daily Competitive Pulse"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="font-medium text-foreground">Human Cadence</span>
              <Input
                required
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. Every Monday at 09:00"
              />
            </label>
            <label className="block text-xs space-y-1">
              <span className="font-medium text-foreground">Cron Expression</span>
              <Input
                value={cron}
                onChange={(e) => setCron(e.target.value)}
                className="font-mono text-xs"
              />
            </label>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Deploy Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* =========================================================================
   12. EXECUTION HISTORY
   ========================================================================= */
export function ExecutionHistoryPage() {
  const [history] = useState([
    {
      id: "EX-0812",
      task: "Regional market scan (GCC)",
      agent: "Mira Research",
      status: "Completed",
      duration: "04:18",
      provider: "Groq (Llama 3.3)",
      date: "Nov 21, 2026",
      tokens: "4,210",
    },
    {
      id: "EX-0811",
      task: "Partner email draft verification",
      agent: "Sage Writer",
      status: "Waiting for approval",
      duration: "01:42",
      provider: "Groq (Llama 3.1)",
      date: "Nov 21, 2026",
      tokens: "1,840",
    },
    {
      id: "EX-0810",
      task: "Assumption review & currency hedges",
      agent: "Review Engineer",
      status: "Failed",
      duration: "00:38",
      provider: "NVIDIA NIM (Qwen)",
      date: "Nov 20, 2026",
      tokens: "920",
    },
    {
      id: "EX-0809",
      task: "Weekly leadership outline",
      agent: "Chief of Staff",
      status: "Completed",
      duration: "03:06",
      provider: "Groq (Llama 3.3)",
      date: "Nov 19, 2026",
      tokens: "3,110",
    },
    {
      id: "EX-0808",
      task: "Enrolment cohort table extraction",
      agent: "Delta Analyst",
      status: "Completed",
      duration: "02:14",
      provider: "NVIDIA NIM (Qwen)",
      date: "Nov 18, 2026",
      tokens: "2,400",
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredHistory = history.filter(
    (h) =>
      h.task.toLowerCase().includes(search.toLowerCase()) ||
      h.agent.toLowerCase().includes(search.toLowerCase()) ||
      h.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeading
        eyebrow="AUDIT ARCHIVE"
        title="Execution History"
        description="Searchable log of all agent runs, duration records, token consumption, and outcome status."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.print()}
            className="h-8 gap-1.5 text-xs"
          >
            <ArrowDownToLine className="size-3.5" /> Export Audit Log
          </Button>
        }
      />

      <div className="mb-4">
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Filter by Task ID, Agent, or keywords…"
        />
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Execution ID</TableHead>
              <TableHead>Task Deliverable</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Provider & Model</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {item.id}
                </TableCell>
                <TableCell className="text-xs font-medium">{item.task}</TableCell>
                <TableCell className="text-xs">{item.agent}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.provider}</TableCell>
                <TableCell className="font-mono text-xs">{item.duration}</TableCell>
                <TableCell className="font-mono text-xs">{item.tokens}</TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {item.date}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

/* =========================================================================
   13. ANALYTICS & MONITORING
   ========================================================================= */
export function AnalyticsPage() {
  const agentUtilisation = [
    { name: "Research & Synthesis", value: 34 },
    { name: "Financial & Quantitative", value: 28 },
    { name: "Content & Communications", value: 20 },
    { name: "Engineering & QA", value: 18 },
  ];
  const chartColors = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"];

  return (
    <>
      <PageHeading
        eyebrow="TELEMETRY & OBSERVABILITY"
        title="Analytics & Workforce Monitoring"
        description="Operational metrics, P50/P90/P99 latency trends, agent capacity allocation, and success rates across pipelines."
      />

      {/* KPI Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Overall Success Rate",
            value: "96.4%",
            hint: "Across 240 simulated runs",
            icon: CheckCheck,
          },
          {
            label: "P50 Latency (Groq)",
            value: "1.2s",
            hint: "Median response time",
            icon: Clock3,
          },
          {
            label: "Avg Approval Wait",
            value: "14 min",
            hint: "Human review gate",
            icon: ShieldCheck,
          },
          {
            label: "Total Tokens Processed",
            value: "1.42M",
            hint: "Current billing cycle",
            icon: Activity,
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">{kpi.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{kpi.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel
          title="Latency Percentiles (Seconds)"
          subtitle="P50 to P99 comparative latency distribution"
        >
          <div className="h-[260px] w-full" role="img" aria-label="Latency curve">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencySample} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 4" stroke="var(--border)" opacity={0.6} />
                <XAxis
                  dataKey="percentile"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    borderColor: "var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="groq"
                  name="Groq LPU (s)"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                />
                <Line
                  type="monotone"
                  dataKey="nim"
                  name="NVIDIA NIM (s)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Agent Capacity Allocation" subtitle="Workload distribution by specialty area">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 items-center">
            <div className="h-[240px]" role="img" aria-label="Donut chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={agentUtilisation}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {agentUtilisation.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 text-xs">
              {agentUtilisation.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-sm"
                      style={{ backgroundColor: chartColors[index] }}
                    />
                    <span className="text-foreground">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

/* =========================================================================
   14. SETTINGS
   ========================================================================= */
export function SettingsPage() {
  const [preferences, setPreferences] = useState({
    requireReview: true,
    taskAlerts: true,
    slackBroadcast: false,
    weeklyReport: true,
    sandboxIsolation: true,
  });

  const [demoMode, setDemoMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("opencrewbot-demo-mode") === "true";
    }
    return false;
  });

  const [autoFallback, setAutoFallback] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("opencrewbot-auto-fallback") !== "false";
    }
    return true;
  });

  const [primaryProvider, setPrimaryProvider] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("opencrewbot-primary-provider") || "groq";
    }
    return "groq";
  });

  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  function notifyChange(msg: string) {
    setSaveMessage(msg);
    setSaved(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("opencrewbot-settings-changed"));
    }
    setTimeout(() => setSaved(false), 3000);
  }

  function handleDemoToggle(checked: boolean) {
    setDemoMode(checked);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("opencrewbot-demo-mode", checked ? "true" : "false");
    }
    notifyChange(
      checked
        ? "Demo Mode ENABLED: Tasks will use simulated local tokens without API cost."
        : "Demo Mode DISABLED: Tasks now execute live against Groq & NVIDIA NIM!",
    );
  }

  function handleFallbackToggle(checked: boolean) {
    setAutoFallback(checked);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("opencrewbot-auto-fallback", checked ? "true" : "false");
    }
    notifyChange(
      checked
        ? "Automatic Fallback ENABLED: Network or rate-limit errors will seamlessly fallback without crashing."
        : "Automatic Fallback DISABLED: Live errors will halt execution directly.",
    );
  }

  function handleProviderChange(val: string) {
    setPrimaryProvider(val);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("opencrewbot-primary-provider", val);
    }
    notifyChange(`Primary Model Provider set to ${val.toUpperCase()}.`);
  }

  function toggle(key: keyof typeof preferences) {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    notifyChange("Security policy preference updated.");
  }

  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE GOVERNANCE"
        title="Settings & Policies"
        description="Manage live execution modes, demo simulation toggles, automatic error fallbacks, and security boundaries."
      />

      {saved && (
        <div className="mb-4">
          <InlineNotice tone="success">{saveMessage}</InlineNotice>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
        <div className="space-y-4">
          <Panel
            title="Execution & Inference Mode"
            subtitle="Configure real-time API execution, demo simulation, and resilient error recovery"
          >
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between py-3.5 first:pt-0">
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">Demo / Simulation Mode</p>
                    <Badge
                      variant="outline"
                      className={
                        demoMode
                          ? "border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-700 dark:text-amber-300"
                          : "border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-300"
                      }
                    >
                      {demoMode ? "Demo Mode Active" : "Live Production Active"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    When toggled <strong>ON</strong>, all agent interactions simulate outputs
                    locally without consuming tokens. When <strong>OFF</strong>, agents invoke live
                    Groq and NVIDIA NIM endpoints.
                  </p>
                </div>
                <Switch checked={demoMode} onCheckedChange={handleDemoToggle} />
              </div>

              <div className="flex items-center justify-between py-3.5">
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      Automatic Fallback on Rate Limits & Errors
                    </p>
                    <Badge
                      variant="outline"
                      className="border-blue-500/30 bg-blue-500/10 text-[10px] text-blue-700 dark:text-blue-300"
                    >
                      {autoFallback ? "Auto-Recovery ON" : "Strict Fail-Fast"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    If live Groq or NVIDIA NIM encounters an API rate limit, HTTP 429, or network
                    interruption, automatically fall back to secondary providers or the local
                    simulator to prevent workflow failure.
                  </p>
                </div>
                <Switch checked={autoFallback} onCheckedChange={handleFallbackToggle} />
              </div>

              <div className="py-3.5 last:pb-0">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Primary Routing Provider
                </p>
                <p className="text-xs text-muted-foreground mb-2.5">
                  Select default provider for Chief of Staff task orchestration.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleProviderChange("groq")}
                    className={cn(
                      "flex flex-col p-2.5 rounded-lg border text-left text-xs transition-colors",
                      primaryProvider === "groq"
                        ? "border-primary bg-primary/10 font-medium text-foreground"
                        : "border-border hover:bg-muted/50 text-muted-foreground",
                    )}
                  >
                    <span className="font-bold text-foreground">Groq (Default)</span>
                    <span className="text-[10px]">Llama 3.3 / Qwen (Sub-200ms)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderChange("nvidia")}
                    className={cn(
                      "flex flex-col p-2.5 rounded-lg border text-left text-xs transition-colors",
                      primaryProvider === "nvidia"
                        ? "border-primary bg-primary/10 font-medium text-foreground"
                        : "border-border hover:bg-muted/50 text-muted-foreground",
                    )}
                  >
                    <span className="font-bold text-foreground">NVIDIA NIM</span>
                    <span className="text-[10px]">Nemotron / 405B Deep Reasoning</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProviderChange("auto")}
                    className={cn(
                      "flex flex-col p-2.5 rounded-lg border text-left text-xs transition-colors",
                      primaryProvider === "auto"
                        ? "border-primary bg-primary/10 font-medium text-foreground"
                        : "border-border hover:bg-muted/50 text-muted-foreground",
                    )}
                  >
                    <span className="font-bold text-foreground">Auto-Adaptive</span>
                    <span className="text-[10px]">Chief of Staff decides per task</span>
                  </button>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Security & Autonomous Boundaries" subtitle="Human-in-the-loop gating rules">
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between py-3.5 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Enforce Human Review for External Writes
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quarantine all Gmail, Slack, and Notion mutations in Approval Centre.
                  </p>
                </div>
                <Switch
                  checked={preferences.requireReview}
                  onCheckedChange={() => toggle("requireReview")}
                />
              </div>

              <div className="flex items-center justify-between py-3.5">
                <div>
                  <p className="text-sm font-semibold text-foreground">Strict Sandbox Isolation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Prevent agents from reading files outside of active project directories.
                  </p>
                </div>
                <Switch
                  checked={preferences.sandboxIsolation}
                  onCheckedChange={() => toggle("sandboxIsolation")}
                />
              </div>
            </div>
          </Panel>

          <Panel title="Notifications & Alerts" subtitle="Operational broadcasts">
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between py-3.5 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">Task State Alerts</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Notify when execution failures or retry checkpoints occur.
                  </p>
                </div>
                <Switch
                  checked={preferences.taskAlerts}
                  onCheckedChange={() => toggle("taskAlerts")}
                />
              </div>

              <div className="flex items-center justify-between py-3.5 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">Weekly Executive Digest</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Synthesize Monday morning report across all collaboration rooms.
                  </p>
                </div>
                <Switch
                  checked={preferences.weeklyReport}
                  onCheckedChange={() => toggle("weeklyReport")}
                />
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Workspace Environment Details">
            <dl className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-border pb-2.5">
                <dt className="text-muted-foreground">Product Version</dt>
                <dd className="font-bold text-foreground">OpenCrewBot 2.0</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2.5">
                <dt className="text-muted-foreground">Organization</dt>
                <dd className="font-semibold text-foreground">EDXSO Partner Suite</dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2.5">
                <dt className="text-muted-foreground">Inference Pipeline</dt>
                <dd className="font-semibold text-foreground">
                  {demoMode ? (
                    <span className="text-amber-600">Simulated / Offline</span>
                  ) : (
                    <span className="text-emerald-600">Groq & NVIDIA NIM Live</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2.5">
                <dt className="text-muted-foreground">Auto-Fallback</dt>
                <dd className="font-semibold text-foreground">
                  {autoFallback ? (
                    <span className="text-blue-600">Enabled (Safe)</span>
                  ) : (
                    <span className="text-amber-600">Disabled</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between border-b border-border pb-2.5">
                <dt className="text-muted-foreground">Runtime Mode</dt>
                <dd className="font-semibold text-foreground">Enterprise Sandbox</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Data Retention</dt>
                <dd className="font-semibold text-foreground">Local Session / Memory</dd>
              </div>
            </dl>
          </Panel>

          <PreviewNotice>
            All governance, fallback, and demo simulation settings update live and persist across
            sessions.
          </PreviewNotice>
        </div>
      </div>
    </>
  );
}

/* =========================================================================
   MAIN SWITCHER
   ========================================================================= */
export function WorkspacePage({ page }: { page: WorkspacePageKey }) {
  switch (page) {
    case "overview":
      return <WorkspaceOverview />;
    case "workspace":
      return <AgentWorkspacePage />;
    case "agents":
      return <AgentDirectoryPage />;
    case "rooms":
      return <CollaborationRoomsPage />;
    case "tasks":
      return <TaskExecutionPage />;
    case "skills":
      return <SkillsPage />;
    case "memory":
      return <MemoryManagerPage />;
    case "models":
      return <ModelConfigurationPage />;
    case "approvals":
      return <ApprovalCentrePage />;
    case "integrations":
      return <IntegrationsPage />;
    case "workflows":
      return <WorkflowsPage />;
    case "history":
      return <ExecutionHistoryPage />;
    case "analytics":
      return <AnalyticsPage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <WorkspaceOverview />;
  }
}
