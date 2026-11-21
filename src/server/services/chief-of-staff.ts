// Intelligent Chief of Staff & Multi-Agent Orchestration Engine
// Decomposes Complex Business Instructions, Builds Topological DAG Plans,
// Dispatches Parallel Specialist Tasks, and Consolidates Verified Deliverables

import { randomUUID } from "node:crypto";
import type { ExecutionPlan, Task, AgentConfiguration } from "../types";
import { TaskDependencyGraph } from "../dag";
import { DynamicAgentFactory } from "./agent-factory";
import { TaskExecutionEngine } from "./task-engine";

export class ChiefOfStaffEngine {
  private plans = new Map<string, ExecutionPlan>();
  private agentFactory: DynamicAgentFactory;
  private taskEngine: TaskExecutionEngine;

  constructor(agentFactory: DynamicAgentFactory, taskEngine: TaskExecutionEngine) {
    this.agentFactory = agentFactory;
    this.taskEngine = taskEngine;
  }

  /**
   * Evaluates a complex natural-language business instruction and compiles
   * it into a structured, dependency-aware multi-agent Execution Plan.
   */
  public generatePlanFromInstruction(rawInstruction: string): ExecutionPlan {
    const clean = rawInstruction.trim();
    if (!clean) throw new Error("Instruction cannot be empty.");

    const planId = `plan-${randomUUID().slice(0, 8)}`;
    const tasks: Task[] = [];

    // Parse business intent and decompose into specialized task dependencies
    if (/competitor|market|pricing|landscape|meetuniversity/i.test(clean)) {
      // Demonstration 1: Market Intelligence Decomposition
      const task1 = this.taskEngine.createTask({
        planId,
        title: "Identify EdTech Competitors & Pricing Models",
        description:
          "Scrape and synthesize publicly available pricing, product tiers, and positioning for higher-ed platforms.",
        requiredCapabilities: ["web_search", "skill-competitor-analysis"],
        assignedAgentId: "agent-scout-research",
        dependencies: [],
        priority: "high",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      const task2 = this.taskEngine.createTask({
        planId,
        title: "Model Unit Economics & Customer Acquisition Costs",
        description:
          "Compute LTV:CAC sensitivity curves and price elasticity for student career guidance subscriptions.",
        requiredCapabilities: ["skill-financial-modelling", "code_execution_quickjs"],
        assignedAgentId: "agent-financial-analyst",
        dependencies: [],
        priority: "high",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      const task3 = this.taskEngine.createTask({
        planId,
        title: "Comparative Feature & Vulnerability Analysis",
        description:
          "Cross-reference Scout's market research with Elena's financial models to isolate competitor moats.",
        requiredCapabilities: ["skill-market-research"],
        assignedAgentId: "agent-atlas-planner",
        dependencies: [task1.id, task2.id],
        priority: "medium",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      const task4 = this.taskEngine.createTask({
        planId,
        title: "Executive Synthesis & Strategic Recommendations",
        description:
          "Assemble verified findings into a finalized board-ready market intelligence deliverable.",
        requiredCapabilities: ["skill-presentation-creation"],
        assignedAgentId: "agent-chief-of-staff",
        dependencies: [task3.id],
        priority: "critical",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      tasks.push(task1, task2, task3, task4);
    } else if (/marketing|campaign|class 11|aspirations/i.test(clean)) {
      // Demonstration 2: Marketing Campaign Decomposition
      const task1 = this.taskEngine.createTask({
        planId,
        title: "Class 11 Student Audience & Parent Persona Research",
        description:
          "Analyze core decision factors, pain points, and anxieties regarding stream selection and university admissions.",
        requiredCapabilities: ["skill-market-research"],
        assignedAgentId: "agent-scout-research",
        dependencies: [],
        priority: "high",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      const task2 = this.taskEngine.createTask({
        planId,
        title: "Institutional Lead Outreach Sequencing",
        description:
          "Filter top 50 prospective partner high schools and prepare guidance counselor engagement lists.",
        requiredCapabilities: ["skill-lead-generation"],
        assignedAgentId: "agent-growth-hacker",
        dependencies: [],
        priority: "medium",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      const task3 = this.taskEngine.createTask({
        planId,
        title: "30-Day Omnichannel Content Calendar & Ad Concepts",
        description:
          "Draft 30-day editorial schedule across LinkedIn, Instagram, and school partner newsletters.",
        requiredCapabilities: ["skill-presentation-creation"],
        assignedAgentId: "agent-quill-writer",
        dependencies: [task1.id],
        priority: "high",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      const task4 = this.taskEngine.createTask({
        planId,
        title: "Consolidated Marketing Campaign Deliverable",
        description:
          "Synthesize audience research, school targets, and content drafts into one verified package.",
        requiredCapabilities: ["skill-presentation-creation"],
        assignedAgentId: "agent-chief-of-staff",
        dependencies: [task2.id, task3.id],
        priority: "critical",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      tasks.push(task1, task2, task3, task4);
    } else {
      // General Multi-Agent Task Decomposition
      const task1 = this.taskEngine.createTask({
        planId,
        title: `Discovery & Research: ${clean.slice(0, 40)}`,
        description: `Investigate background facts and parameters for: ${clean}`,
        requiredCapabilities: ["skill-market-research"],
        assignedAgentId: "agent-scout-research",
        dependencies: [],
        priority: "high",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      const task2 = this.taskEngine.createTask({
        planId,
        title: `Synthesis & Deliverable: ${clean.slice(0, 40)}`,
        description: `Compile recommendations and executive summary.`,
        requiredCapabilities: ["skill-presentation-creation"],
        assignedAgentId: "agent-chief-of-staff",
        dependencies: [task1.id],
        priority: "critical",
        maxRetries: 3,
        timeoutMs: 30000,
        requiresApproval: false,
      });

      tasks.push(task1, task2);
    }

    // Compute DAG stages and critical path
    const dag = new TaskDependencyGraph(tasks);
    const parallelStages = dag.computeParallelExecutionStages();
    const criticalPath = dag.computeCriticalPath();

    const plan: ExecutionPlan = {
      id: planId,
      objective: clean,
      rawInstruction: clean,
      tasks,
      criticalPath,
      parallelStages,
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    };

    this.plans.set(planId, plan);
    return plan;
  }

  public getPlan(planId: string): ExecutionPlan | undefined {
    return this.plans.get(planId);
  }

  public listPlans(): ExecutionPlan[] {
    return Array.from(this.plans.values());
  }

  /**
   * Consolidates completed task outputs into one final business deliverable.
   */
  public consolidateDeliverable(planId: string): string {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error(`Plan '${planId}' not found.`);

    const completedTasks = plan.tasks.filter((t) => t.status === "COMPLETED");
    if (completedTasks.length === 0) {
      throw new Error(
        `Cannot consolidate deliverable: No tasks have completed successfully in plan '${planId}'.`,
      );
    }

    const sections: string[] = [
      `# Executive Business Deliverable: ${plan.objective}`,
      `**Prepared by**: OpenCrewBot 2.0 Autonomous Workforce`,
      `**Chief of Staff**: Avery Sterling`,
      `**Completed Tasks**: ${completedTasks.length} of ${plan.tasks.length}`,
      `**Verification Timestamp**: ${new Date().toISOString()}`,
      `---`,
    ];

    for (const t of completedTasks) {
      sections.push(`### Step: ${t.title}`);
      sections.push(`*Assigned Specialist*: @${t.assignedAgentId}`);
      sections.push(
        `*Execution Output*:\n${typeof t.output === "string" ? t.output : JSON.stringify(t.output, null, 2)}`,
      );
      sections.push("");
    }

    plan.finalDeliverable = sections.join("\n\n");
    plan.status = "COMPLETED";
    plan.completedAt = new Date().toISOString();

    return plan.finalDeliverable;
  }
}
