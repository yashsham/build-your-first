// OpenCrewBot 2.0 Core Enterprise Domain Interfaces and Types
// Strict OOP Interfaces, Domain Models, and Protocol Envelopes

export type PermissionLevel = "ask_first" | "controlled_access" | "full_access";

export type TaskStatus =
  | "PENDING"
  | "QUEUED"
  | "RUNNING"
  | "WAITING_APPROVAL"
  | "BLOCKED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface TaskExecutionAttempt {
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  status: "SUCCESS" | "FAILED" | "INTERRUPTED";
  error?: string;
  durationMs?: number;
  toolCalls?: Array<{ toolName: string; durationMs: number; status: string }>;
}

export interface Task {
  id: string;
  planId?: string;
  parentTaskId?: string;
  title: string;
  description: string;
  requiredCapabilities: string[];
  assignedAgentId: string;
  dependencies: string[]; // Task IDs that must finish before this task runs
  priority: TaskPriority;
  status: TaskStatus;
  startedAt?: string;
  completedAt?: string;
  output?: Record<string, unknown> | string;
  error?: string;
  retryCount: number;
  maxRetries: number;
  timeoutMs: number;
  requiresApproval: boolean;
  executionHistory: TaskExecutionAttempt[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionPlan {
  id: string;
  objective: string;
  rawInstruction: string;
  tasks: Task[];
  criticalPath: string[];
  parallelStages: string[][]; // Array of stages where each stage contains task IDs that can run concurrently
  status: "DRAFT" | "EXECUTING" | "COMPLETED" | "FAILED" | "CANCELLED";
  finalDeliverable?: string;
  createdAt: string;
  completedAt?: string;
}

export interface AgentConfiguration {
  id: string;
  name: string;
  role: string;
  handle: string;
  description: string;
  specialization: string;
  persona: string;
  systemInstructions: string;
  modelProvider: "groq" | "nvidia" | "openai" | "anthropic" | "mock";
  modelIdentifier: string;
  modelParameters: {
    temperature: number;
    maxTokens: number;
    topP?: number;
  };
  fallbackModel?: {
    provider: string;
    modelIdentifier: string;
  };
  skills: string[];
  tools: string[];
  memoryConfiguration: {
    enabled: boolean;
    workspacePath: string;
    contextLineLimit: number;
  };
  permissionLevel: PermissionLevel;
  expectedOutputFormats: string[];
  status: "active" | "inactive" | "maintenance";
  createdAt: string;
  updatedAt: string;
}

export type RoomMessageType =
  | "PROPOSAL"
  | "CHALLENGE"
  | "VERIFICATION"
  | "CLARIFICATION"
  | "INTERMEDIATE_OUTPUT"
  | "CONSENSUS_REACHED"
  | "DELIVERABLE";

export interface StructuredRoomMessage {
  id: string;
  roomId: string;
  correlationId: string;
  senderAgentId: string;
  recipientAgentId: string | "all";
  messageType: RoomMessageType;
  payload: {
    summary: string;
    details?: string;
    data?: Record<string, unknown>;
    citations?: string[];
  };
  relatedTaskId?: string;
  timestamp: string;
}

export interface CollaborationRoom {
  id: string;
  name: string;
  topic: string;
  emoji: string;
  leadAgentId: string;
  memberAgentIds: string[];
  sharedContext: {
    objective: string;
    keyDecisions: string[];
    verifiedFacts: Record<string, string>;
  };
  messageTimeline: StructuredRoomMessage[];
  status: "active" | "paused" | "archived";
  deliverables: Array<{
    id: string;
    title: string;
    content: string;
    sha256Hash: string;
    verifiedBy: string[];
    createdAt: string;
  }>;
  createdAt: string;
}

export interface JSONSchemaDefinition {
  type: "object" | "array" | "string" | "number" | "boolean";
  properties?: Record<string, unknown>;
  required?: string[];
  items?: Record<string, unknown>;
  description?: string;
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  instructions: string;
  inputSchema: JSONSchemaDefinition;
  outputSchema: JSONSchemaDefinition;
  dependencies: string[];
  requiredTools: string[];
  permissions: string[];
  version: string;
  isAvailable: boolean;
  category: "research" | "finance" | "marketing" | "engineering" | "operations";
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ApprovalRequest {
  id: string;
  actionType: string;
  requestedByAgentId: string;
  targetToolOrIntegration: string;
  payload: Record<string, unknown>;
  actionPreviewDiff: string;
  riskLevel: RiskLevel;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | "EXECUTED";
  actionHash: string; // Cryptographic SHA-256 binding of action payload
  createdAt: string;
  expiresAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  rejectionReason?: string;
  executionPreventedNotice?: string;
}

export interface IntegrationConnection {
  id: string;
  provider: "github" | "gmail" | "slack" | "hubspot" | "jira" | "postgres";
  name: string;
  status: "connected" | "disconnected" | "error" | "sandbox";
  scopes: string[];
  sandboxMode: boolean;
  lastHealthCheckAt: string;
  connectionMetadata: Record<string, string | number | boolean>;
}

export interface ScheduledWorkflow {
  id: string;
  name: string;
  description: string;
  cronExpression: string;
  targetAgentIds: string[];
  workflowObjective: string;
  isPaused: boolean;
  lastRunAt?: string;
  lastRunStatus?: "SUCCESS" | "FAILED";
  nextRunAt: string;
  executionHistory: Array<{
    runId: string;
    timestamp: string;
    status: "SUCCESS" | "FAILED";
    durationMs: number;
    deliverableUrl?: string;
  }>;
}

export interface AuditSecurityEvent {
  id: string;
  timestamp: string;
  eventType:
    | "APPROVAL_REQUESTED"
    | "APPROVAL_GRANTED"
    | "APPROVAL_REJECTED"
    | "EXECUTION_PREVENTED"
    | "TOOL_INVOKED"
    | "MEMORY_UPDATED"
    | "AGENT_GENERATED";
  actorId: string;
  actorType: "agent" | "human_operator" | "scheduler";
  resource: string;
  details: string;
  payloadHash?: string;
  executionBlocked: boolean;
}
