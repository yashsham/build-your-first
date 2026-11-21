// OpenCrewBot 2.0 Central Enterprise Backend Service Container
// Dependency Injection Container connecting all autonomous workforce modules

import { SkillsRegistry } from "./services/skills-registry";
import { ApprovalSecurityEngine } from "./services/approval-engine";
import { DynamicAgentFactory } from "./services/agent-factory";
import { PersistentMemoryEngine } from "./services/memory-engine";
import { TaskExecutionEngine } from "./services/task-engine";
import { ChiefOfStaffEngine } from "./services/chief-of-staff";
import { CollaborationRoomEngine } from "./services/collaboration-rooms";
import { IntegrationEngine } from "./services/integration-engine";
import { ModelProviderRegistry } from "./services/model-providers";
import { WorkflowSchedulerEngine } from "./services/workflow-scheduler";

export class OpenCrewBackend {
  public readonly skills: SkillsRegistry;
  public readonly approvals: ApprovalSecurityEngine;
  public readonly agents: DynamicAgentFactory;
  public readonly memory: PersistentMemoryEngine;
  public readonly tasks: TaskExecutionEngine;
  public readonly chiefOfStaff: ChiefOfStaffEngine;
  public readonly rooms: CollaborationRoomEngine;
  public readonly integrations: IntegrationEngine;
  public readonly models: ModelProviderRegistry;
  public readonly workflows: WorkflowSchedulerEngine;

  constructor() {
    this.skills = new SkillsRegistry();
    this.approvals = new ApprovalSecurityEngine();
    this.agents = new DynamicAgentFactory();
    this.memory = new PersistentMemoryEngine();
    this.tasks = new TaskExecutionEngine();
    this.chiefOfStaff = new ChiefOfStaffEngine(this.agents, this.tasks);
    this.rooms = new CollaborationRoomEngine();
    this.integrations = new IntegrationEngine();
    this.models = new ModelProviderRegistry();
    this.workflows = new WorkflowSchedulerEngine();
  }
}

// Global singleton container for runtime access
const g = globalThis as unknown as { __opencrewBackendInstance?: OpenCrewBackend };
export const backend = (g.__opencrewBackendInstance ??= new OpenCrewBackend());
