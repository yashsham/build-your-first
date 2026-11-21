import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Code2,
  Copy,
  FileText,
  Filter,
  GitBranch,
  History,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  X,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  demoMetrics,
  navGroups,
  sampleActivity,
  sampleAgents,
  sampleApprovals,
  sampleIntegrations,
  sampleRooms,
  sampleSkills,
  sampleTasks,
  sampleWorkflows,
  systemSignals,
  throughputSample,
  type Agent,
  type PermissionLevel,
  type Room,
  type Task,
  type TaskStatus,
  type WorkspacePageKey,
} from "@/lib/workspace-data";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Active: "border-success/30 bg-success/10 text-success-foreground",
  Running: "border-info/30 bg-info/10 text-info-foreground",
  Completed: "border-success/30 bg-success/10 text-success-foreground",
  Ready: "border-success/30 bg-success/10 text-success-foreground",
  "In progress": "border-info/30 bg-info/10 text-info-foreground",
  Idle: "border-border bg-muted text-muted-foreground",
  Queued: "border-border bg-muted text-muted-foreground",
  Draft: "border-border bg-muted text-muted-foreground",
  Paused: "border-warning/30 bg-warning/10 text-warning-foreground",
  "Needs review": "border-warning/30 bg-warning/10 text-warning-foreground",
  "Waiting for approval": "border-warning/30 bg-warning/10 text-warning-foreground",
  Failed: "border-destructive/30 bg-destructive/10 text-destructive",
  Disconnected: "border-border bg-muted text-muted-foreground",
  "Demo preview": "border-warning/30 bg-warning/10 text-warning-foreground",
  "Not configured": "border-border bg-muted text-muted-foreground",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("whitespace-nowrap", statusColors[status] ?? "border-border bg-muted text-muted-foreground")}>
      <span className="mr-1.5 size-1.5 rounded-full bg-current" />
      {status}
    </Badge>
  );
}

function PageHeading({
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
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
        <h1 className="text-2xl font-semibold leading-tight text-foreground sm:text-[28px]">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

function Panel({
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
    <section className={cn("min-w-0 rounded-md border border-border bg-card", className)}>
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {subtitle && <p className="mt-1 text-xs leading-5 text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <Alert className="border-warning/30 bg-warning/5 text-foreground">
      <CircleAlert className="size-4" />
      <AlertTitle className="text-sm">Preview only</AlertTitle>
      <AlertDescription className="text-xs leading-5 text-muted-foreground">{children}</AlertDescription>
    </Alert>
  );
}

function InlineNotice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" | "success" }) {
  const toneClass = tone === "success" ? "border-success/30 bg-success/5 text-success-foreground" : tone === "warning" ? "border-warning/30 bg-warning/5 text-warning-foreground" : "border-info/30 bg-info/5 text-info-foreground";
  return <div role="status" className={cn("rounded-md border px-3 py-2.5 text-xs leading-5", toneClass)}>{children}</div>;
}

function SearchField({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="pl-9" aria-label={placeholder} />
    </div>
  );
}

function ActionLink({ to, children }: { to: "/" | "/workspace" | "/agents" | "/rooms" | "/tasks" | "/skills" | "/memory" | "/models" | "/approvals" | "/integrations" | "/workflows" | "/history" | "/analytics" | "/settings"; children: ReactNode }) {
  return <Button asChild variant="outline" size="sm"><Link to={to}>{children}</Link></Button>;
}

function Permission({ level }: { level: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <LockKeyhole className="size-3.5" aria-hidden="true" />{level}
    </span>
  );
}

function WorkspaceOverview() {
  return (
    <>
      <PageHeading
        eyebrow="COMMAND CENTRE · DEMO DATA"
        title="Good morning, Alex"
        description="A clear view of your agent workforce, queued work and items that need human review."
        actions={<><Button asChild size="sm"><Link to="/workspace"><MessageSquareText /> Open agent workspace</Link></Button><Button asChild size="sm" variant="outline"><Link to="/tasks"><Plus /> New task</Link></Button></>}
      />
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {demoMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div className="rounded-md border border-border bg-card p-4" key={metric.label}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <p className="mt-3 text-2xl font-semibold tabular-nums">{metric.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{metric.hint}</p>
            </div>
          );
        })}
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
        <Panel title="Workforce activity" subtitle="Illustrative seven-day activity · no live execution data" action={<Badge variant="outline">Sample series</Badge>}>
          <div className="h-[250px] w-full" role="img" aria-label="Demonstration bar chart of task activity across the week">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={throughputSample} margin={{ top: 8, right: 5, bottom: 0, left: -22 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Tooltip cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="tasks" name="Prepared tasks" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="reviewed" name="Review steps" fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="System signals" subtitle="Connection state, not inferred health">
          <div className="space-y-1">
            {systemSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <div className="flex items-center gap-3 border-b border-border py-3 last:border-0" key={signal.label}>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"><Icon className="size-4" /></div>
                  <p className="min-w-0 flex-1 text-sm">{signal.label}</p>
                  <span className="max-w-28 text-right text-xs text-muted-foreground">{signal.value}</span>
                </div>
              );
            })}
          </div>
          <InlineNotice tone="warning">No live status checks are configured.</InlineNotice>
        </Panel>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <Panel title="Workforce activity" subtitle="Illustrative event feed" action={<ActionLink to="/history">View history <ArrowRight /></ActionLink>}>
          <div className="space-y-1">
            {sampleActivity.map((event, index) => {
              const Icon = event.icon;
              const tone = event.tone === "success" ? "text-success-foreground bg-success/10" : event.tone === "warning" ? "text-warning-foreground bg-warning/10" : event.tone === "danger" ? "text-destructive bg-destructive/10" : "text-info-foreground bg-info/10";
              return (
                <div className="flex gap-3 border-b border-border py-3 last:border-0" key={event.title}>
                  <div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md", tone)}><Icon className="size-4" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{event.detail}</p>
                  </div>
                  <time className="shrink-0 pt-0.5 text-[11px] text-muted-foreground">{event.time}</time>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="Needs human review" subtitle="Preview requests · no actions submitted" action={<ActionLink to="/approvals">Open queue <ArrowRight /></ActionLink>}>
          <div className="space-y-3">
            {sampleApprovals.map((approval) => (
              <div className="border-b border-border pb-3 last:border-0 last:pb-0" key={approval.id}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-muted-foreground">{approval.id}</span>
                  <StatusBadge status="Waiting for approval" />
                </div>
                <p className="mt-2 text-sm font-medium">{approval.action}</p>
                <p className="mt-1 text-xs text-muted-foreground">{approval.agent} · {approval.service}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

type ChatMessage = { author: "agent" | "user"; text: string; time: string };

function AgentWorkspacePage() {
  const [selectedId, setSelectedId] = useState(sampleAgents[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { author: "user", text: "Prepare a source-led summary of the school markets that may be relevant to our next expansion review.", time: "09:18" },
    { author: "agent", text: "I would split this into three checks: addressable market signals, regulatory context and evidence quality. I can prepare a structured research outline, but no connected model or research tool is available in this preview.", time: "09:18" },
  ]);
  const activeAgent = sampleAgents.find((agent) => agent.id === selectedId);

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt) return;
    setMessages((current) => [
      ...current,
      { author: "user", text: prompt, time: "Now" },
      { author: "agent", text: "Not sent. This preview has no connected AI model; your prompt remains local to this page.", time: "Now" },
    ]);
    setDraft("");
  }

  if (!activeAgent) return null;

  return (
    <>
      <PageHeading eyebrow="WORKSPACE" title="Agent workspace" description="Review an agent conversation and its context. This preview does not connect to a model or stream responses." actions={<StatusBadge status="Demo transcript" />} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="flex min-h-[680px] flex-col overflow-hidden rounded-md border border-border bg-card">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4 sm:px-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">{activeAgent.initials}</div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-semibold">{activeAgent.name}</h2>
                <StatusBadge status={activeAgent.status} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{activeAgent.role} · {activeAgent.model}</p>
            </div>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-full sm:w-52" aria-label="Select an agent"><SelectValue placeholder="Select an agent" /></SelectTrigger>
              <SelectContent>{sampleAgents.map((agent) => <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground sm:px-5">
            <MessageSquareText className="size-3.5" />
            Sample transcript · no live conversation is active
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {messages.map((message, index) => (
              <div className={cn("flex gap-3", message.author === "user" && "flex-row-reverse")} key={`${message.time}-${index}`}>
                <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold", message.author === "agent" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                  {message.author === "agent" ? activeAgent.initials : "AC"}
                </div>
                <div className={cn("max-w-[min(88%,660px)] rounded-md border px-4 py-3", message.author === "agent" ? "border-border bg-background" : "border-primary/20 bg-primary/5")}>
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground"><span className="font-medium text-foreground">{message.author === "agent" ? activeAgent.name : "You"}</span><span>·</span><time>{message.time}</time></div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                  {message.author === "agent" && index === 1 && <div className="mt-3 flex items-center gap-2 border-t border-border pt-2 text-[11px] text-muted-foreground"><FileText className="size-3.5" />No external citations in this demonstration</div>}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={submitMessage} className="border-t border-border p-4 sm:p-5">
            <label className="sr-only" htmlFor="agent-message">Message the selected agent</label>
            <div className="rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
              <Textarea id="agent-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a task or question…" className="min-h-24 resize-y border-0 shadow-none focus-visible:ring-0" />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-3 py-2">
                <span className="text-[11px] text-muted-foreground">Sending is disabled in this preview.</span>
                <Button type="submit" size="sm" disabled={!draft.trim()}><Send /> Add local message</Button>
              </div>
            </div>
          </form>
        </section>
        <div className="space-y-4">
          <Panel title="Agent context" subtitle="Configuration preview">
            <dl className="space-y-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">Specialty</dt><dd className="mt-1 font-medium">{activeAgent.specialty}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Model</dt><dd className="mt-1 font-medium">{activeAgent.model}</dd></div>
              <div><dt className="text-xs text-muted-foreground">Permission level</dt><dd className="mt-1"><Permission level={activeAgent.permission} /></dd></div>
              <div><dt className="text-xs text-muted-foreground">Tools</dt><dd className="mt-1 text-muted-foreground">No tools connected</dd></div>
            </dl>
          </Panel>
          <Panel title="Attached skills" subtitle="Example assignments">
            <div className="space-y-2">{activeAgent.skills.map((skill) => <div className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2" key={skill}><span className="text-xs font-medium">{skill}</span><ChevronRight className="size-3.5 text-muted-foreground" /></div>)}</div>
          </Panel>
          <PreviewNotice>Memory and model settings shown here are examples, not active runtime configuration.</PreviewNotice>
        </div>
      </div>
    </>
  );
}

function AgentDirectoryPage() {
  const [agents, setAgents] = useState<Agent[]>(() => sampleAgents.map((agent) => ({ ...agent })));
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [configureId, setConfigureId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [permission, setPermission] = useState<PermissionLevel>("Review required");
  const [instruction, setInstruction] = useState("Use supplied context, state uncertainty, and request review before external actions.");
  const [notice, setNotice] = useState("");
  const filtered = agents.filter((agent) => `${agent.name} ${agent.role} ${agent.specialty}`.toLowerCase().includes(query.toLowerCase()));
  const configuredAgent = agents.find((agent) => agent.id === configureId);

  function addAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !specialty.trim()) return;
    const initials = name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "").join("");
    setAgents((current) => [...current, { id: `draft-${Date.now()}`, name: name.trim(), role: "Custom agent", specialty: specialty.trim(), model: "Unassigned", status: "Draft", permission, skills: [], initials }]);
    setNotice("Agent draft added to this preview only. It has not been saved to a service.");
    setCreateOpen(false);
    setName("");
    setSpecialty("");
  }

  function saveConfig(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configuredAgent) return;
    setAgents((current) => current.map((agent) => agent.id === configuredAgent.id ? { ...agent, permission } : agent));
    setNotice(`${configuredAgent.name} configuration updated in the current preview only.`);
    setConfigureId(null);
  }

  return (
    <>
      <PageHeading eyebrow="WORKFORCE" title="Agent directory" description="Review roles, specialties, models, skills and permission levels across the sample workspace." actions={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus /> Create agent</Button>} />
      {notice && <div className="mb-4"><InlineNotice tone="success">{notice}</InlineNotice></div>}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchField value={query} onChange={setQuery} placeholder="Search agents…" />
        <div className="flex flex-wrap items-center gap-2"><StatusBadge status={`${agents.length} configured`} /><Badge variant="outline">3 permission levels</Badge></div>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
        {filtered.map((agent) => (
          <article className="rounded-md border border-border bg-card p-4" key={agent.id}>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">{agent.initials}</div>
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">{agent.name}</h2><StatusBadge status={agent.status} /></div><p className="mt-1 text-xs text-muted-foreground">{agent.role}</p></div>
              <Button variant="ghost" size="icon" className="size-8" aria-label={`Configure ${agent.name}`} title={`Configure ${agent.name}`} onClick={() => { setConfigureId(agent.id); setPermission(agent.permission); }}><Settings2 /></Button>
            </div>
            <p className="mt-4 min-h-10 text-sm leading-5 text-muted-foreground">{agent.specialty}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
              <div><p className="text-muted-foreground">Model</p><p className="mt-1 font-medium">{agent.model}</p></div>
              <div><p className="text-muted-foreground">Permissions</p><p className="mt-1 font-medium">{agent.permission}</p></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">{agent.skills.length ? agent.skills.map((skill) => <Badge variant="secondary" className="font-normal" key={skill}>{skill}</Badge>) : <span className="text-xs text-muted-foreground">No skills assigned</span>}</div>
          </article>
        ))}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Create agent draft</DialogTitle><DialogDescription>Describe a role and review its local configuration before connecting a service.</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={addAgent}>
            <label className="block space-y-1.5 text-sm"><span className="font-medium">Agent name</span><Input value={name} onChange={(event) => setName(event.target.value)} required placeholder="e.g. Policy researcher" /></label>
            <label className="block space-y-1.5 text-sm"><span className="font-medium">Specialty</span><Input value={specialty} onChange={(event) => setSpecialty(event.target.value)} required placeholder="What should this agent focus on?" /></label>
            <label className="block space-y-1.5 text-sm"><span className="font-medium">Permission level</span><Select value={permission} onValueChange={(value) => setPermission(value as PermissionLevel)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Read only">Read only</SelectItem><SelectItem value="Review required">Review required</SelectItem><SelectItem value="Autonomous">Autonomous</SelectItem></SelectContent></Select></label>
            <PreviewNotice>Saving creates a draft in this page only; no model, tool, memory or backend is configured.</PreviewNotice>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button type="submit"><Plus /> Add draft</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(configuredAgent)} onOpenChange={(open) => { if (!open) setConfigureId(null); }}>
        {configuredAgent && <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Configure {configuredAgent.name}</DialogTitle><DialogDescription>Update review permissions for this local preview.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={saveConfig}><label className="block space-y-1.5 text-sm"><span className="font-medium">Instructions</span><Textarea value={instruction} onChange={(event) => setInstruction(event.target.value)} className="min-h-24" /></label><label className="block space-y-1.5 text-sm"><span className="font-medium">Permission level</span><Select value={permission} onValueChange={(value) => setPermission(value as PermissionLevel)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Read only">Read only</SelectItem><SelectItem value="Review required">Review required</SelectItem><SelectItem value="Autonomous">Autonomous</SelectItem></SelectContent></Select></label><DialogFooter><Button variant="outline" type="button" onClick={() => setConfigureId(null)}>Cancel</Button><Button type="submit">Save local draft</Button></DialogFooter></form></DialogContent>}
      </Dialog>
    </>
  );
}

function CollaborationRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(() => sampleRooms.map((room) => ({ ...room })));
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<Room | null>(null);
  const [roomName, setRoomName] = useState("");
  const [goal, setGoal] = useState("");
  const [mode, setMode] = useState<Room["mode"]>("Parallel");
  const [notice, setNotice] = useState("");

  function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roomName.trim() || !goal.trim()) return;
    const room: Room = { id: `draft-${Date.now()}`, name: roomName.trim(), goal: goal.trim(), agents: ["Chief of Staff"], mode, status: "Draft", updated: "Just now" };
    setRooms((current) => [room, ...current]);
    setNotice("Room draft created locally. No agents have been invited or run.");
    setCreateOpen(false);
    setRoomName("");
    setGoal("");
  }

  return (
    <>
      <PageHeading eyebrow="WORKFORCE" title="Collaboration rooms" description="Group agents around a shared goal, review their context and inspect the proposed coordination mode." actions={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus /> New room</Button>} />
      {notice && <div className="mb-4"><InlineNotice tone="success">{notice}</InlineNotice></div>}
      <div className="mb-4 flex flex-wrap items-center gap-2"><Badge variant="outline">{rooms.length} room previews</Badge><Badge variant="outline">Parallel & sequential modes</Badge></div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {rooms.map((room) => (
          <article key={room.id} className="rounded-md border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">{room.name}</h2><StatusBadge status={room.status} /></div><p className="mt-2 max-w-2xl text-sm leading-5 text-muted-foreground">{room.goal}</p></div><Button variant="ghost" size="icon" className="size-8" aria-label={`View ${room.name}`} onClick={() => setDetail(room)}><MoreHorizontal /></Button></div>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">{room.agents.map((agent) => <Badge variant="secondary" className="font-normal" key={agent}>{agent}</Badge>)}</div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3"><div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><GitBranch className="size-3.5" />{room.mode}</span><span>{room.updated}</span></div><Button size="sm" variant="outline" onClick={() => setNotice(`${room.name}: preview only. No agent tasks were started.`)}>Review plan <ArrowRight /></Button></div>
          </article>
        ))}
      </div>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Create collaboration room</DialogTitle><DialogDescription>Prepare a shared goal and coordination mode as a local draft.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={createRoom}><label className="block space-y-1.5 text-sm"><span className="font-medium">Room name</span><Input required value={roomName} onChange={(event) => setRoomName(event.target.value)} /></label><label className="block space-y-1.5 text-sm"><span className="font-medium">Shared goal</span><Textarea required value={goal} onChange={(event) => setGoal(event.target.value)} /></label><label className="block space-y-1.5 text-sm"><span className="font-medium">Coordination</span><Select value={mode} onValueChange={(value) => setMode(value as Room["mode"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Parallel">Parallel</SelectItem><SelectItem value="Sequential">Sequential</SelectItem></SelectContent></Select></label><PreviewNotice>Room and agent execution services are not connected.</PreviewNotice><DialogFooter><Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button type="submit">Save room draft</Button></DialogFooter></form></DialogContent></Dialog>
      <Dialog open={Boolean(detail)} onOpenChange={(open) => { if (!open) setDetail(null); }}>{detail && <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>{detail.name}</DialogTitle><DialogDescription>{detail.goal}</DialogDescription></DialogHeader><div className="space-y-4"><div><p className="mb-2 text-xs font-medium text-muted-foreground">Participants</p><div className="flex flex-wrap gap-1.5">{detail.agents.map((agent) => <Badge variant="secondary" key={agent}>{agent}</Badge>)}</div></div><div className="flex justify-between border-y border-border py-3 text-sm"><span className="text-muted-foreground">Dependency mode</span><span>{detail.mode}</span></div><InlineNotice tone="warning">Timeline and intermediate outputs are not available until a collaboration service is connected.</InlineNotice><Button className="w-full" onClick={() => { setNotice("No run was started. The room is unchanged because the execution service is not connected."); setDetail(null); }}>Check execution readiness</Button></div></DialogContent>}</Dialog>
    </>
  );
}

function TaskExecutionPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [notice, setNotice] = useState("");
  const tasks = sampleTasks.filter((task) => (status === "All statuses" || task.status === status) && `${task.id} ${task.description} ${task.agent}`.toLowerCase().includes(query.toLowerCase()));
  const statusOptions = ["All statuses", "Running", "Waiting for approval", "Completed", "Failed", "Queued"];

  return (
    <>
      <PageHeading eyebrow="OPERATIONS" title="Task execution" description="Inspect the sample queue, dependencies and states. Controls never contact an execution service in this preview." actions={<Button variant="outline" size="sm" onClick={() => setNotice("No task was created. Connect an execution service to submit work.")}><Plus /> Create task</Button>} />
      {notice && <div className="mb-4"><InlineNotice tone="warning">{notice}</InlineNotice></div>}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"><SearchField value={query} onChange={setQuery} placeholder="Search tasks…" /><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-48" aria-label="Filter task status"><Filter className="mr-2 size-4 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent>{statusOptions.map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select><Badge variant="outline">Sample queue · {tasks.length} rows</Badge></div>
      <div className="rounded-md border border-border bg-card">
        <Table><TableHeader><TableRow><TableHead>Task</TableHead><TableHead>Assigned agent</TableHead><TableHead>Room</TableHead><TableHead>Status</TableHead><TableHead>Duration</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Review</TableHead></TableRow></TableHeader><TableBody>{tasks.map((task) => <TableRow key={task.id}><TableCell className="min-w-56"><span className="block text-[11px] text-muted-foreground">{task.id}</span><span className="mt-1 block font-medium">{task.description}</span></TableCell><TableCell className="whitespace-nowrap">{task.agent}</TableCell><TableCell className="min-w-36">{task.room}</TableCell><TableCell><StatusBadge status={task.status} /></TableCell><TableCell className="tabular-nums">{task.duration}</TableCell><TableCell className="whitespace-nowrap text-xs text-muted-foreground">{task.updated}</TableCell><TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => setNotice(`${task.id}: no action was sent; this sample task remains unchanged.`)}>Inspect</Button></TableCell></TableRow>)}</TableBody></Table>
        {!tasks.length && <div className="px-4 py-12 text-center text-sm text-muted-foreground">No sample tasks match those filters.</div>}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2"><Panel title="Dependency view" subtitle="Example task order · not an active execution graph"><div className="flex flex-wrap items-center gap-2 text-xs"><span className="rounded border border-border bg-muted px-3 py-2">Market scan</span><ArrowRight className="size-4 text-muted-foreground" /><span className="rounded border border-primary/30 bg-primary/5 px-3 py-2">Evidence review</span><ArrowRight className="size-4 text-muted-foreground" /><span className="rounded border border-border bg-muted px-3 py-2">Brief draft</span></div></Panel><PreviewNotice>Pause, resume, retry and cancel controls require a connected task service. No actions are currently sent.</PreviewNotice></div>
    </>
  );
}

function SkillsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [selected, setSelected] = useState<(typeof sampleSkills)[number] | null>(null);
  const categories = ["All categories", ...new Set(sampleSkills.map((skill) => skill.category))];
  const filtered = sampleSkills.filter((skill) => (category === "All categories" || skill.category === category) && `${skill.name} ${skill.description}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <PageHeading eyebrow="INTELLIGENCE" title="Skills & tools" description="Reusable task instructions, permission boundaries and tool requirements for the sample agent set." actions={<Button size="sm" variant="outline" onClick={() => setSelected({ name: "New skill draft", category: "Custom", description: "A local draft for a reusable agent instruction.", version: "Draft", permission: "Review required" })}><Plus /> New skill</Button>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"><SearchField value={query} onChange={setQuery} placeholder="Search skills…" /><Select value={category} onValueChange={setCategory}><SelectTrigger className="w-full sm:w-52" aria-label="Filter skill category"><SelectValue /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select><Badge variant="outline">{sampleSkills.length} reusable skill previews</Badge></div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">{filtered.map((skill) => <article className="rounded-md border border-border bg-card p-4" key={skill.name}><div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{skill.category}</p><h2 className="mt-1 text-sm font-semibold">{skill.name}</h2></div><Badge variant="outline">v{skill.version}</Badge></div><p className="mt-3 min-h-10 text-sm leading-5 text-muted-foreground">{skill.description}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3"><Permission level={skill.permission} /><Button variant="ghost" size="sm" onClick={() => setSelected(skill)}>Inspect <ChevronRight /></Button></div></article>)}</div>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>{selected && <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>{selected.name}</DialogTitle><DialogDescription>{selected.description}</DialogDescription></DialogHeader><div className="space-y-3"><div className="grid grid-cols-2 gap-3"><div className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">Version</p><p className="mt-1 text-sm font-medium">{selected.version}</p></div><div className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">Permission</p><p className="mt-1 text-sm font-medium">{selected.permission}</p></div></div><div className="space-y-2 rounded-md border border-border p-3"><p className="text-xs font-medium">Input schema</p><code className="block whitespace-pre-wrap text-xs text-muted-foreground">{`{ "goal": "string", "context": "string[]", "constraints": "string[]" }`}</code></div><div className="flex justify-between border-b border-border py-2 text-xs"><span className="text-muted-foreground">Dependencies</span><span>None declared in this preview</span></div><div className="flex justify-between py-2 text-xs"><span className="text-muted-foreground">Tool availability</span><span>Disconnected</span></div><InlineNotice>Instruction preview only; no skill is loaded by an agent.</InlineNotice></div><DialogFooter><Button variant="outline" onClick={() => setSelected(null)}>Close</Button></DialogFooter></DialogContent>}</Dialog>
    </>
  );
}

const memoryFiles = [
  { name: "workspace.md", type: "Workspace", text: "# Workspace context\n\nThis preview contains example workspace notes only.\n\n## Working principles\n- Prefer cited, reviewable evidence.\n- Mark assumptions separately from findings.\n- Keep external actions behind human review.\n" },
  { name: "decisions.md", type: "Decisions", text: "# Decisions\n\nNo project decisions have been stored in a connected memory system.\n\n## Example decision\n- Keep demonstration records distinct from operational records.\n- Revisit after the service is connected.\n" },
  { name: "preferences.md", type: "User preferences", text: "# User preferences\n\nThis file is an editable example. The memory store is not connected.\n\n- Response tone: concise and evidence-led\n- External messages: review before sending\n" },
  { name: "agent-notes.md", type: "Agent memory", text: "# Agent notes\n\nNo agent memory has been loaded.\n\nUse this area to review provenance, reasoning context, and the date a note was recorded after a memory service is integrated.\n" },
];

function MemoryManagerPage() {
  const [selected, setSelected] = useState(memoryFiles[0]?.name ?? "");
  const [content, setContent] = useState(memoryFiles[0]?.text ?? "");
  const [saved, setSaved] = useState(false);
  const file = memoryFiles.find((item) => item.name === selected);

  function selectFile(name: string) {
    const next = memoryFiles.find((item) => item.name === name);
    if (!next) return;
    setSelected(next.name);
    setContent(next.text);
    setSaved(false);
  }

  return (
    <>
      <PageHeading eyebrow="INTELLIGENCE" title="Memory manager" description="Review Markdown-style context and provenance across the example workspace. The source memory store is not connected." actions={<Button size="sm" variant="outline" onClick={() => { setContent(file?.text ?? ""); setSaved(false); }}><RotateCcw /> Revert preview</Button>} />
      <div className="mb-4"><PreviewNotice>Edits stay in this page only and are not written to any existing memory architecture.</PreviewNotice></div>
      <div className="grid min-h-[620px] grid-cols-1 overflow-hidden rounded-md border border-border bg-card lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="border-b border-border bg-muted/30 p-3 lg:border-b-0 lg:border-r"><div className="mb-2 flex items-center justify-between px-2 py-1"><h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Memory files</h2><Badge variant="outline">4</Badge></div><nav aria-label="Memory files" className="space-y-1">{memoryFiles.map((item) => <button type="button" onClick={() => selectFile(item.name)} key={item.name} className={cn("flex w-full items-center gap-2 rounded-md px-2.5 py-2.5 text-left text-sm", selected === item.name ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:bg-muted")}><FileText className="size-4 shrink-0" />{item.name}</button>)}</nav></aside>
        <div className="flex min-w-0 flex-col"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3"><div><p className="text-sm font-medium">{selected}</p><p className="mt-1 text-xs text-muted-foreground">{file?.type ?? "Memory"} · sample content</p></div><div className="flex items-center gap-2"><Badge variant="outline">Markdown</Badge><Button size="sm" onClick={() => setSaved(true)}><Check /> Save preview</Button></div></div><Textarea aria-label="Memory markdown editor" value={content} onChange={(event) => { setContent(event.target.value); setSaved(false); }} className="min-h-[300px] flex-1 resize-y rounded-none border-0 font-mono text-sm leading-6 shadow-none focus-visible:ring-0" /><div className="border-t border-border p-4"><div className="mb-2 flex items-center gap-2 text-xs font-semibold"><History className="size-3.5" /> Provenance & preview</div><div className="grid grid-cols-1 gap-3 md:grid-cols-3"><div><p className="text-[11px] text-muted-foreground">Source</p><p className="mt-1 text-xs">Demonstration file</p></div><div><p className="text-[11px] text-muted-foreground">Last updated</p><p className="mt-1 text-xs">Not connected</p></div><div><p className="text-[11px] text-muted-foreground">Preview state</p><p className="mt-1 text-xs">{saved ? "Saved in current page state" : "Unsaved local edits"}</p></div></div>{saved && <div className="mt-3"><InlineNotice tone="success">This preview has been marked saved; the source memory remains unchanged.</InlineNotice></div>}</div></div>
      </div>
    </>
  );
}

function ModelConfigurationPage() {
  const [provider, setProvider] = useState("Groq");
  const [model, setModel] = useState("Llama 3.3 70B");
  const [fallback, setFallback] = useState("Llama 3.1 8B");
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageHeading eyebrow="INTELLIGENCE" title="Model configuration" description="Set a provider and routing preference without exposing credentials. Availability and usage are not checked in this preview." />
      {notice && <div className="mb-4"><InlineNotice tone="success">{notice}</InlineNotice></div>}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {[{ name: "Groq", models: "Llama 3.3 · Llama 3.1", tag: "Provider available in product brief" }, { name: "NVIDIA NIM", models: "Qwen · Nemotron", tag: "Provider available in product brief" }].map((item) => <article className="rounded-md border border-border bg-card p-4" key={item.name}><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary"><Sparkles className="size-4" /></div><div><h2 className="text-sm font-semibold">{item.name}</h2><p className="mt-1 text-xs text-muted-foreground">{item.models}</p></div></div><StatusBadge status="Not configured" /></div><p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{item.tag} · no credentials or endpoint configured</p></article>)}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <Panel title="Default routing" subtitle="Preview configuration; changes are not persisted">
          <form onSubmit={(event) => { event.preventDefault(); setNotice("Configuration saved in this page only. No model provider was contacted."); }} className="space-y-4">
            <label className="block space-y-1.5 text-sm"><span className="font-medium">Provider</span><Select value={provider} onValueChange={setProvider}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Groq">Groq</SelectItem><SelectItem value="NVIDIA NIM">NVIDIA NIM</SelectItem></SelectContent></Select></label>
            <label className="block space-y-1.5 text-sm"><span className="font-medium">Primary model</span><Select value={model} onValueChange={setModel}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Llama 3.3 70B">Llama 3.3 70B</SelectItem><SelectItem value="Llama 3.1 8B">Llama 3.1 8B</SelectItem><SelectItem value="Qwen 2.5 72B">Qwen 2.5 72B</SelectItem></SelectContent></Select></label>
            <label className="block space-y-1.5 text-sm"><span className="font-medium">Fallback model</span><Select value={fallback} onValueChange={setFallback}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Llama 3.3 70B">Llama 3.3 70B</SelectItem><SelectItem value="Llama 3.1 8B">Llama 3.1 8B</SelectItem><SelectItem value="Qwen 2.5 72B">Qwen 2.5 72B</SelectItem></SelectContent></Select></label>
            <div className="rounded-md border border-border bg-muted/30 p-3"><p className="text-xs font-medium">Task-based routing</p><p className="mt-1 text-xs text-muted-foreground">Research · {model} / Analysis · {fallback} (example only)</p></div>
            <Button type="submit"><Check /> Save local configuration</Button>
          </form>
        </Panel>
        <div className="space-y-4"><Panel title="Provider status" subtitle="No health check has run"><div className="space-y-3"><div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">Selected provider</span><span className="font-medium">{provider}</span></div><div className="flex justify-between gap-3 border-t border-border pt-3 text-sm"><span className="text-muted-foreground">Availability</span><span>Not checked</span></div><div className="flex justify-between gap-3 border-t border-border pt-3 text-sm"><span className="text-muted-foreground">Token usage</span><span>Unavailable</span></div></div></Panel><PreviewNotice>No API keys are requested or stored by this interface. Provider calls need a secure server-side connection.</PreviewNotice></div>
      </div>
    </>
  );
}

function ApprovalCentrePage() {
  const [selected, setSelected] = useState<(typeof sampleApprovals)[number] | null>(null);
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageHeading eyebrow="OPERATIONS" title="Approval centre" description="Inspect proposed external actions, their risk and their preview before a connected service decides anything." actions={<Badge variant="outline">{sampleApprovals.length} sample requests</Badge>} />
      {notice && <div className="mb-4"><InlineNotice tone="warning">{notice}</InlineNotice></div>}
      <div className="mb-4"><PreviewNotice>Approve and reject are intentionally unavailable: no approval service is connected, so no decision can be confirmed and execution status remains unknown.</PreviewNotice></div>
      <Panel title="Pending review" subtitle="Example requests · not sent to external services">
        <div className="divide-y divide-border">{sampleApprovals.map((approval) => <div className="grid grid-cols-1 gap-3 py-4 first:pt-0 last:pb-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(120px,0.7fr)_minmax(130px,0.7fr)_auto] lg:items-center" key={approval.id}><div><div className="flex flex-wrap items-center gap-2"><span className="text-[11px] font-medium text-muted-foreground">{approval.id}</span><StatusBadge status="Waiting for approval" /></div><p className="mt-2 text-sm font-semibold">{approval.action}</p><p className="mt-1 text-xs text-muted-foreground">Requested by {approval.agent} · {approval.time}</p></div><div><p className="text-[11px] text-muted-foreground">External service</p><p className="mt-1 text-sm">{approval.service}</p></div><div><p className="text-[11px] text-muted-foreground">Risk</p><p className="mt-1 text-sm">{approval.risk}</p></div><div className="flex gap-2 lg:justify-end"><Button size="sm" variant="outline" onClick={() => setSelected(approval)}>Review preview</Button><Button size="sm" variant="ghost" onClick={() => setNotice("No decision was sent. The request remains pending and execution prevention cannot be confirmed without the approval service.")}>Approve / reject unavailable</Button></div></div>)}</div>
      </Panel>
      <div className="mt-4"><Panel title="Audit history" subtitle="No connected approval decisions"><div className="flex flex-col items-center justify-center py-8 text-center"><ShieldCheck className="size-8 text-muted-foreground/60" /><p className="mt-3 text-sm font-medium">No confirmed decisions</p><p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">This preview has no approval events from a connected service. Example requests above are not audit records.</p></div></Panel></div>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}>{selected && <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Action preview</DialogTitle><DialogDescription>{selected.id} · {selected.agent}</DialogDescription></DialogHeader><div className="space-y-3"><div className="rounded-md border border-border p-3"><p className="text-xs text-muted-foreground">Proposed action</p><p className="mt-1 text-sm font-medium">{selected.action}</p></div><div className="grid grid-cols-2 gap-3"><div><p className="text-xs text-muted-foreground">Service</p><p className="mt-1 text-sm">{selected.service}</p></div><div><p className="text-xs text-muted-foreground">Risk level</p><p className="mt-1 text-sm">{selected.risk}</p></div></div><p className="text-sm leading-6 text-muted-foreground">{selected.detail}</p><InlineNotice tone="warning">No approval choice will be recorded here.</InlineNotice><Button className="w-full" variant="outline" onClick={() => { setNotice("No decision was submitted; the sample request is unchanged."); setSelected(null); }}>Close preview</Button></div></DialogContent>}</Dialog>
    </>
  );
}

function IntegrationsPage() {
  const [notice, setNotice] = useState("");
  return (
    <>
      <PageHeading eyebrow="OPERATIONS" title="Integrations" description="Review service capabilities and connection states. This workspace has no live integrations." actions={<Badge variant="outline">5 service previews</Badge>} />
      {notice && <div className="mb-4"><InlineNotice tone="warning">{notice}</InlineNotice></div>}
      <div className="mb-4"><PreviewNotice>All listed services are disconnected or mocked. “Test connection” does not make a network request.</PreviewNotice></div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{sampleIntegrations.map((integration) => <article className="rounded-md border border-border bg-card p-4 sm:p-5" key={integration.name}><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"><Layers3 className="size-5" /></div><div><h2 className="text-sm font-semibold">{integration.name}</h2><p className="mt-1 text-xs text-muted-foreground">{integration.kind}</p></div></div><StatusBadge status={integration.status} /></div><div className="mt-4 border-t border-border pt-3"><p className="text-[11px] font-medium text-muted-foreground">Capabilities</p><div className="mt-2 flex flex-wrap gap-1.5">{integration.capabilities.map((capability) => <Badge variant="secondary" className="font-normal" key={capability}>{capability}</Badge>)}</div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-2"><Permission level="Scoped access not granted" /><Button size="sm" variant="outline" onClick={() => setNotice(`${integration.name}: no connection test was run because the service is not configured.`)}>Test connection</Button></div></article>)}</div>
    </>
  );
}

function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(() => sampleWorkflows.map((workflow) => ({ ...workflow })));
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [notice, setNotice] = useState("");
  function createWorkflow(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !schedule.trim()) return;
    setWorkflows((current) => [{ name: name.trim(), schedule: schedule.trim(), agents: ["Chief of Staff"], status: "Draft", lastRun: "Not scheduled" }, ...current]);
    setNotice("Workflow draft saved to this preview only. It has not been scheduled or run.");
    setCreateOpen(false);
    setName("");
    setSchedule("");
  }
  return (
    <>
      <PageHeading eyebrow="OPERATIONS" title="Scheduled workflows" description="Prepare recurring agent plans and inspect their schedule, assignments and run history." actions={<Button size="sm" onClick={() => setCreateOpen(true)}><Plus /> New workflow</Button>} />
      {notice && <div className="mb-4"><InlineNotice tone="warning">{notice}</InlineNotice></div>}
      <div className="mb-4"><PreviewNotice>Scheduled execution is not connected. Every run or pause request below is informational only.</PreviewNotice></div>
      <div className="space-y-3">{workflows.map((workflow) => <article className="grid grid-cols-1 gap-4 rounded-md border border-border bg-card p-4 md:grid-cols-[minmax(0,1.35fr)_minmax(180px,0.8fr)_minmax(150px,0.7fr)_auto] md:items-center" key={workflow.name}><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">{workflow.name}</h2><StatusBadge status={workflow.status} /></div><p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{workflow.schedule}</p></div><div><p className="text-[11px] text-muted-foreground">Assigned agents</p><p className="mt-1 text-xs leading-5">{workflow.agents.join(" · ")}</p></div><div><p className="text-[11px] text-muted-foreground">Recent execution</p><p className="mt-1 text-xs">{workflow.lastRun}</p></div><div className="flex flex-wrap gap-2 md:justify-end"><Button size="sm" variant="outline" onClick={() => setNotice(`${workflow.name}: no execution request was sent.`)}><Play /> Run once</Button><Button size="sm" variant="ghost" aria-label={`Edit ${workflow.name}`} onClick={() => setNotice("Workflow editing is limited to new local drafts in this preview.")}><Settings2 /></Button></div></article>)}</div>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Create workflow draft</DialogTitle><DialogDescription>Define a schedule and sample agent assignment.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={createWorkflow}><label className="block space-y-1.5 text-sm"><span className="font-medium">Workflow name</span><Input required value={name} onChange={(event) => setName(event.target.value)} /></label><label className="block space-y-1.5 text-sm"><span className="font-medium">Schedule</span><Input required value={schedule} onChange={(event) => setSchedule(event.target.value)} placeholder="e.g. Every Monday at 09:00" /></label><div className="rounded-md border border-border bg-muted/30 p-3 text-xs"><p className="font-medium">Assigned agent</p><p className="mt-1 text-muted-foreground">Chief of Staff · example assignment</p></div><PreviewNotice>Draft is local. No workflow service will schedule or execute it.</PreviewNotice><DialogFooter><Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button type="submit">Save workflow draft</Button></DialogFooter></form></DialogContent></Dialog>
    </>
  );
}

const historyRows = [
  { id: "EX-0812", task: "Regional market scan", agent: "Mira Research", status: "Completed", duration: "04:18", provider: "Not recorded", date: "Nov 20, 2026" },
  { id: "EX-0811", task: "Partner email draft", agent: "Sage Writer", status: "Waiting for approval", duration: "01:42", provider: "Not recorded", date: "Nov 20, 2026" },
  { id: "EX-0810", task: "Assumption review", agent: "Review Engineer", status: "Failed", duration: "00:38", provider: "Not recorded", date: "Nov 19, 2026" },
  { id: "EX-0809", task: "Weekly leadership outline", agent: "Chief of Staff", status: "Completed", duration: "03:06", provider: "Not recorded", date: "Nov 18, 2026" },
];

function ExecutionHistoryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const rows = historyRows.filter((row) => (status === "All statuses" || row.status === status) && `${row.id} ${row.task} ${row.agent}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <>
      <PageHeading eyebrow="OPERATIONS" title="Execution history" description="Search example task records by agent, status and provider. These are demonstration entries, not live execution history." actions={<Button size="sm" variant="outline" onClick={() => window.print()}><ArrowDownToLine /> Export view</Button>} />
      <div className="mb-4"><PreviewNotice>Example records only · provider usage, token counts and actual execution events are unavailable.</PreviewNotice></div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row"><SearchField value={query} onChange={setQuery} placeholder="Search history…" /><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full sm:w-48" aria-label="Filter history status"><SelectValue /></SelectTrigger><SelectContent>{["All statuses", "Completed", "Failed", "Waiting for approval"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
      <div className="rounded-md border border-border bg-card"><Table><TableHeader><TableRow><TableHead>Task ID</TableHead><TableHead>Result</TableHead><TableHead>Agent</TableHead><TableHead>Status</TableHead><TableHead>Duration</TableHead><TableHead>Provider</TableHead><TableHead>Date</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id}><TableCell className="font-mono text-xs">{row.id}</TableCell><TableCell className="min-w-48 font-medium">{row.task}</TableCell><TableCell className="whitespace-nowrap">{row.agent}</TableCell><TableCell><StatusBadge status={row.status} /></TableCell><TableCell className="tabular-nums">{row.duration}</TableCell><TableCell className="text-xs text-muted-foreground">{row.provider}</TableCell><TableCell className="whitespace-nowrap text-xs text-muted-foreground">{row.date}</TableCell></TableRow>)}</TableBody></Table>{!rows.length && <div className="py-12 text-center text-sm text-muted-foreground">No sample records match those filters.</div>}</div>
    </>
  );
}

function AnalyticsPage() {
  const agentUtilisation = [
    { name: "Research", value: 28 },
    { name: "Writing", value: 22 },
    { name: "Analysis", value: 31 },
    { name: "Planning", value: 19 },
  ];
  const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];
  return (
    <>
      <PageHeading eyebrow="SYSTEM" title="Analytics & monitoring" description="A demonstration analytics view. No live telemetry, model usage, latency or service health is available." actions={<Select defaultValue="7 days"><SelectTrigger className="w-36" aria-label="Analytics time range"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7 days">Last 7 days</SelectItem><SelectItem value="30 days">Last 30 days</SelectItem><SelectItem value="90 days">Last 90 days</SelectItem></SelectContent></Select>} />
      <div className="mb-4"><PreviewNotice>Every chart below is illustrative sample data. It must not be read as a live operational metric.</PreviewNotice></div>
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{[{ label: "Throughput", value: "Sample series", icon: Activity }, { label: "Success rate", value: "Not measured", icon: CheckCheck }, { label: "Latency percentiles", value: "Unavailable", icon: Clock3 }, { label: "Approval wait", value: "Not measured", icon: ShieldCheck }].map((item) => { const Icon = item.icon; return <div className="rounded-md border border-border bg-card p-4" key={item.label}><div className="flex justify-between gap-2"><p className="text-xs text-muted-foreground">{item.label}</p><Icon className="size-4 text-primary" /></div><p className="mt-4 text-sm font-semibold">{item.value}</p></div>; })}</div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2"><Panel title="Illustrative throughput" subtitle="Example activity values, not an observed service"><div className="h-[270px]" role="img" aria-label="Illustrative line chart for example activity values"><ResponsiveContainer width="100%" height="100%"><LineChart data={throughputSample} margin={{ top: 8, right: 10, bottom: 0, left: -20 }}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><Tooltip /><Line dataKey="tasks" name="Sample task values" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} /><Line dataKey="reviewed" name="Sample review values" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></Panel><Panel title="Example agent allocation" subtitle="Illustrative distribution only"><div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(180px,0.9fr)_minmax(0,1fr)]"><div className="h-[230px]" role="img" aria-label="Illustrative pie chart of example agent allocation"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={agentUtilisation} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={3}>{agentUtilisation.map((entry, index) => <Cell fill={chartColors[index % chartColors.length]} key={entry.name} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="space-y-3">{agentUtilisation.map((item, index) => <div className="flex items-center gap-2 text-xs" key={item.name}><span className="size-2.5 rounded-sm" style={{ backgroundColor: chartColors[index] }} /><span className="flex-1">{item.name}</span><span className="font-medium tabular-nums">Example {item.value}%</span></div>)}</div></div></Panel></div>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">{[{ title: "Model usage", text: "No provider usage data connected." }, { title: "Retries & failures", text: "No confirmed task events connected." }, { title: "Approval timing", text: "No confirmed review events connected." }].map((item) => <Panel key={item.title} title={item.title}><p className="text-sm text-muted-foreground">{item.text}</p></Panel>)}</div>
    </>
  );
}

function SettingsPage() {
  const [notice, setNotice] = useState("");
  const [preferences, setPreferences] = useState({ taskUpdates: true, approvalAlerts: true, weeklySummary: false, requireReview: true });
  const updatePreference = (key: keyof typeof preferences, checked: boolean) => {
    setPreferences((current) => ({ ...current, [key]: checked }));
    setNotice("Preference updated in this page only. It is not saved to a workspace service.");
  };
  const preferenceRows: { key: keyof typeof preferences; title: string; description: string }[] = [
    { key: "taskUpdates", title: "Task updates", description: "Notify when a sample task changes state." },
    { key: "approvalAlerts", title: "Approval reminders", description: "Highlight requests awaiting human review." },
    { key: "weeklySummary", title: "Weekly summary", description: "Prepare an example activity summary." },
    { key: "requireReview", title: "Require review for external actions", description: "Default permission setting for new agent drafts." },
  ];
  return (
    <>
      <PageHeading eyebrow="SYSTEM" title="Settings" description="Manage workspace preferences and review the current preview’s security boundaries." />
      {notice && <div className="mb-4"><InlineNotice tone="success">{notice}</InlineNotice></div>}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="space-y-4"><Panel title="Notifications" subtitle="Local preview controls"><div className="divide-y divide-border">{preferenceRows.slice(0, 3).map((item) => <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" key={item.key}><div><p className="text-sm font-medium">{item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.description}</p></div><Switch checked={preferences[item.key]} onCheckedChange={(checked) => updatePreference(item.key, checked)} aria-label={item.title} /></div>)}</div></Panel><Panel title="Security & permissions" subtitle="Permission controls are examples, not enforced by a connected service"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-medium">Require review for external actions</p><p className="mt-1 text-xs text-muted-foreground">Use a review-first default for agent drafts.</p></div><Switch checked={preferences.requireReview} onCheckedChange={(checked) => updatePreference("requireReview", checked)} aria-label="Require review for external actions" /></div><div className="mt-4 rounded-md border border-border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">Permission levels available in the sample workspace: Read only, Review required, Autonomous.</div></Panel></div>
        <div className="space-y-4"><Panel title="Workspace details"><dl className="space-y-3 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Workspace</dt><dd className="font-medium">OpenCrewBot preview</dd></div><div className="flex justify-between gap-3 border-t border-border pt-3"><dt className="text-muted-foreground">Theme</dt><dd className="font-medium">Use the top-bar theme control</dd></div><div className="flex justify-between gap-3 border-t border-border pt-3"><dt className="text-muted-foreground">Data retention</dt><dd className="font-medium">Not configured</dd></div></dl></Panel><PreviewNotice>No account, notification, retention or security setting is sent to a backend.</PreviewNotice><ActionLink to="/integrations">Review integrations <ArrowRight /></ActionLink></div>
      </div>
    </>
  );
}

export function WorkspacePage({ page }: { page: WorkspacePageKey }) {
  switch (page) {
    case "overview": return <WorkspaceOverview />;
    case "workspace": return <AgentWorkspacePage />;
    case "agents": return <AgentDirectoryPage />;
    case "rooms": return <CollaborationRoomsPage />;
    case "tasks": return <TaskExecutionPage />;
    case "skills": return <SkillsPage />;
    case "memory": return <MemoryManagerPage />;
    case "models": return <ModelConfigurationPage />;
    case "approvals": return <ApprovalCentrePage />;
    case "integrations": return <IntegrationsPage />;
    case "workflows": return <WorkflowsPage />;
    case "history": return <ExecutionHistoryPage />;
    case "analytics": return <AnalyticsPage />;
    case "settings": return <SettingsPage />;
  }
}