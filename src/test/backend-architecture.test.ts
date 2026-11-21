import { describe, expect, it } from "vitest";
import { backend } from "../server/index";
import { TaskDependencyGraph, CyclicDependencyError } from "../server/dag";
import type { Task } from "../server/types";

describe("OpenCrewBot 2.0 Backend Architecture & Modular Services", () => {
  describe("DAG Scheduler & Topological Sorting (Module D)", () => {
    it("partitions independent tasks into parallel execution stages", () => {
      const tasks: Task[] = [
        {
          id: "T1",
          title: "Market Scraping",
          description: "",
          requiredCapabilities: [],
          assignedAgentId: "scout",
          dependencies: [],
          priority: "high",
          status: "PENDING",
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 10000,
          requiresApproval: false,
          executionHistory: [],
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "T2",
          title: "Unit Economics",
          description: "",
          requiredCapabilities: [],
          assignedAgentId: "elena",
          dependencies: [],
          priority: "high",
          status: "PENDING",
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 10000,
          requiresApproval: false,
          executionHistory: [],
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "T3",
          title: "Comparison",
          description: "",
          requiredCapabilities: [],
          assignedAgentId: "atlas",
          dependencies: ["T1", "T2"],
          priority: "medium",
          status: "PENDING",
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 10000,
          requiresApproval: false,
          executionHistory: [],
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "T4",
          title: "Executive Synthesis",
          description: "",
          requiredCapabilities: [],
          assignedAgentId: "chief",
          dependencies: ["T3"],
          priority: "critical",
          status: "PENDING",
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 10000,
          requiresApproval: false,
          executionHistory: [],
          createdAt: "",
          updatedAt: "",
        },
      ];

      const dag = new TaskDependencyGraph(tasks);
      const stages = dag.computeParallelExecutionStages();

      // Stage 1: T1 & T2 should run in parallel (0 dependencies)
      expect(stages.length).toBe(3);
      expect(stages[0]).toEqual(expect.arrayContaining(["T1", "T2"]));
      // Stage 2: T3 runs after T1 and T2
      expect(stages[1]).toEqual(["T3"]);
      // Stage 3: T4 runs after T3
      expect(stages[2]).toEqual(["T4"]);
    });

    it("throws CyclicDependencyError when a circular dependency is detected", () => {
      const cyclicTasks: Task[] = [
        {
          id: "A",
          title: "Task A",
          description: "",
          requiredCapabilities: [],
          assignedAgentId: "a",
          dependencies: ["B"],
          priority: "high",
          status: "PENDING",
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 10000,
          requiresApproval: false,
          executionHistory: [],
          createdAt: "",
          updatedAt: "",
        },
        {
          id: "B",
          title: "Task B",
          description: "",
          requiredCapabilities: [],
          assignedAgentId: "b",
          dependencies: ["A"],
          priority: "high",
          status: "PENDING",
          retryCount: 0,
          maxRetries: 3,
          timeoutMs: 10000,
          requiresApproval: false,
          executionHistory: [],
          createdAt: "",
          updatedAt: "",
        },
      ];

      const dag = new TaskDependencyGraph(cyclicTasks);
      expect(() => dag.computeParallelExecutionStages()).toThrow(CyclicDependencyError);
    });
  });

  describe("Chief of Staff & Intent Decomposition (Module A)", () => {
    it("decomposes complex market intelligence instruction into a multi-agent plan", () => {
      const plan = backend.chiefOfStaff.generatePlanFromInstruction(
        "Research the competitive landscape and pricing models for MeetUniversity.",
      );

      expect(plan.tasks.length).toBeGreaterThanOrEqual(4);
      expect(plan.parallelStages.length).toBeGreaterThanOrEqual(2);
      expect(plan.criticalPath.length).toBeGreaterThanOrEqual(3);
      expect(plan.status).toBe("DRAFT");

      // Verify specialist agent assignments
      const agentIds = plan.tasks.map((t) => t.assignedAgentId);
      expect(agentIds).toContain("agent-scout-research");
      expect(agentIds).toContain("agent-financial-analyst");
    });
  });

  describe("Dynamic Agent Factory (Module B)", () => {
    it("dynamically generates and registers a new agent from natural language without source changes", () => {
      const agent = backend.agents.generateAgentFromNaturalLanguage(
        "Analyze high school mathematics curriculum alignments for DACH partners",
        "controlled_access",
      );

      expect(agent.id).toBeDefined();
      expect(agent.permissionLevel).toBe("controlled_access");
      expect(agent.status).toBe("active");

      // Verify retrieval from registry
      const retrieved = backend.agents.getAgent(agent.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(agent.id);
    });
  });

  describe("Multi-Agent Collaboration Rooms (Module C)", () => {
    it("manages 4 distinct rooms and enforces structured message communication", () => {
      const rooms = backend.rooms.listRooms();
      expect(rooms.length).toBe(4);

      const marketRoom = backend.rooms.getRoom("room-market-intel");
      expect(marketRoom).toBeDefined();

      const message = backend.rooms.postMessage({
        roomId: "room-market-intel",
        senderAgentId: "agent-scout-research",
        recipientAgentId: "all",
        messageType: "PROPOSAL",
        payload: {
          summary: "Identified 3 tier pricing structures across LeapScholar and LeverageEdu",
          citations: ["https://leapscholar.com/pricing", "https://leverageedu.com/plans"],
        },
      });

      expect(message.id).toBeDefined();
      expect(message.messageType).toBe("PROPOSAL");
      expect(marketRoom?.messageTimeline.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Autonomous Task Execution Engine (Module D)", () => {
    it("enforces state transitions and executes tasks with retry on failure", async () => {
      const task = backend.tasks.createTask({
        title: "Test Resilient Execution",
        description: "Executes with retry",
        requiredCapabilities: [],
        assignedAgentId: "agent-scout-research",
        dependencies: [],
        priority: "medium",
        maxRetries: 2,
        timeoutMs: 5000,
        requiresApproval: false,
      });

      expect(task.status).toBe("PENDING");

      let attempts = 0;
      const completedTask = await backend.tasks.executeTaskWithRetry(task.id, async () => {
        attempts += 1;
        if (attempts === 1) {
          throw new Error("Simulated transient network timeout");
        }
        return "Sourced 4 university accreditation documents.";
      });

      expect(completedTask.status).toBe("COMPLETED");
      expect(completedTask.retryCount).toBe(1);
      expect(completedTask.executionHistory.length).toBe(2);
      expect(completedTask.output).toBe("Sourced 4 university accreditation documents.");
    });
  });

  describe("Persistent Memory Engine & Secret Redaction (Module E)", () => {
    it("redacts sensitive API keys and tokens before writing to memory", async () => {
      const testPath = "data/workspaces/test-agent/MEMORY.md";
      const dirtyContent =
        "Configured OpenAI with sk-proj-1234567890abcdef12345678 and GitHub ghp_1234567890abcdef12345678.";

      const sanitized = await backend.memory.writeMemory(testPath, dirtyContent);
      expect(sanitized).not.toContain("sk-proj-");
      expect(sanitized).not.toContain("ghp_");
      expect(sanitized).toContain("«REDACTED_");

      const readBack = backend.memory.readMemory(testPath);
      expect(readBack).toBe(sanitized);
    });
  });

  describe("Skills Registry (Module F)", () => {
    it("contains 8 enterprise skills with valid JSON schemas and validates input payloads", () => {
      const skills = backend.skills.listSkills();
      expect(skills.length).toBe(8);

      const skillIds = skills.map((s) => s.id);
      expect(skillIds).toContain("skill-market-research");
      expect(skillIds).toContain("skill-competitor-analysis");
      expect(skillIds).toContain("skill-financial-modelling");
      expect(skillIds).toContain("skill-presentation-creation");
      expect(skillIds).toContain("skill-email-drafting");
      expect(skillIds).toContain("skill-code-review");
      expect(skillIds).toContain("skill-data-analysis");
      expect(skillIds).toContain("skill-lead-generation");

      // Validate schema check
      const validation = backend.skills.validateSkillInput("skill-financial-modelling", {
        arpuUsd: 120,
        // Missing churnRateMonthly and cacUsd
      });
      expect(validation.isValid).toBe(false);
      expect(validation.errors.length).toBe(2);
    });
  });

  describe("Human Approval & Security Policy Engine (Module G / Prompt 12)", () => {
    it("creates cryptographic hash and emits explicit prevention notice upon operator rejection", () => {
      const request = backend.approvals.createApprovalRequest({
        actionType: "post_social_campaign",
        requestedByAgentId: "agent-quill-writer",
        targetToolOrIntegration: "slack_broadcast",
        payload: { channel: "#announcements", message: "Campaign live!" },
        actionPreviewDiff: "- Draft\n+ Public Post to #announcements",
        riskLevel: "HIGH",
      });

      expect(request.actionHash).toBeDefined();
      expect(request.actionHash.length).toBe(64); // SHA-256
      expect(request.status).toBe("PENDING");

      // Operator Rejects Action
      const resolved = backend.approvals.resolveApprovalRequest(
        request.id,
        "REJECTED",
        "operator-alex",
        "Unapproved discount percentage in campaign copy.",
      );

      expect(resolved.status).toBe("REJECTED");
      expect(resolved.executionPreventedNotice).toBe(
        "Execution Prevented: Action blocked and logged to security audit log",
      );

      // Verify in audit trail
      const audit = backend.approvals.listAuditLog();
      const preventedEvent = audit.find((a) => a.eventType === "EXECUTION_PREVENTED");
      expect(preventedEvent).toBeDefined();
      expect(preventedEvent?.executionBlocked).toBe(true);
    });
  });

  describe("Integrations Engine & Multi-Model Registry (Modules H & J)", () => {
    it("executes scoped GitHub and Slack integration actions in sandbox mode", async () => {
      const githubAction = await backend.integrations.executeIntegrationAction(
        "int-github",
        "inspect_repository",
        {
          repo: "Studio1-OSS/OpenCrewBot",
        },
      );
      expect(githubAction.success).toBe(true);
      expect(githubAction.result.license).toBe("MIT");

      const slackAction = await backend.integrations.executeIntegrationAction(
        "int-slack",
        "draft_message",
        {
          channel: "#marketing",
          text: "Preview announcement",
        },
      );
      expect(slackAction.success).toBe(true);
      expect(slackAction.result.scheduledDelivery).toBe("pending_human_approval");
    });

    it("routes models appropriately based on latency vs cost criteria", () => {
      const fastModel = backend.models.routeModel({ priority: "speed" });
      expect(fastModel.provider).toBe("groq");

      const qualityModel = backend.models.routeModel({ priority: "quality" });
      expect(qualityModel.provider).toBe("nvidia");
    });

    it("respects Demo Mode setting to simulate outputs locally without token usage", async () => {
      const result = await backend.models.executeCompletion(
        "llama-3.3-70b-versatile",
        "Synthesize higher education strategy",
        { forceDemo: true },
      );

      expect(result.provider).toBe("mock");
      expect(result.isLive).toBe(false);
      expect(result.text).toContain("Demo Simulation Mode");
    });

    it("handles Auto-Fallback recovery gracefully when configured", async () => {
      const result = await backend.models.executeCompletion(
        "llama-3.3-70b-versatile",
        "Test resilience query",
        { forceDemo: false, autoFallback: true },
      );

      // Either live or safely fallen back, without throwing unhandled exceptions
      expect(result.text).toBeDefined();
      expect(typeof result.latencyMs).toBe("number");
    });
  });
});
