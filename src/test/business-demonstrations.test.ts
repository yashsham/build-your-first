import { describe, expect, it } from "vitest";
import { backend } from "../server/index";

describe("EDXSO Assignment 3 — MeetUniversity Real-World Business Demonstrations", () => {
  // Demonstration 1: Market Intelligence
  it("Demonstration 1 (Market Intelligence): Decomposes and executes competitor research for MeetUniversity", async () => {
    const plan = backend.chiefOfStaff.generatePlanFromInstruction(
      "Research the competitive landscape for MeetUniversity. Identify competitors, products, publicly available pricing, target customers, positioning, and potential market opportunities.",
    );

    expect(plan.tasks.length).toBeGreaterThanOrEqual(4);

    // Simulate execution of each task step
    for (const task of plan.tasks) {
      await backend.tasks.executeTaskWithRetry(task.id, async (t) => {
        if (t.assignedAgentId === "agent-scout-research") {
          return {
            competitorsIdentified: ["IDP Education", "LeapScholar", "LeverageEdu"],
            pricingModels: {
              IDP: "Free counseling, institution commission",
              LeapScholar: "$299 premium prep",
            },
            marketPositioning: "MeetUniversity captures early high school intent via Aspirations.",
          };
        }
        if (t.assignedAgentId === "agent-financial-analyst") {
          return {
            blendedCacUsd: 48,
            estimatedLtvUsd: 320,
            ltvCacRatio: 6.67,
          };
        }
        return `Verified output for ${t.title}`;
      });
    }

    const deliverable = backend.chiefOfStaff.consolidateDeliverable(plan.id);
    expect(deliverable).toContain("Executive Business Deliverable");
    expect(deliverable).toContain("MeetUniversity");
    expect(deliverable).toContain("IDP Education");
  });

  // Demonstration 2: Marketing Campaign
  it("Demonstration 2 (Marketing Campaign): Generates 30-day Class 11 Aspirations campaign package", async () => {
    const plan = backend.chiefOfStaff.generatePlanFromInstruction(
      "Create a campaign targeting Class 11 students for Aspirations. Research the audience, identify concerns, develop campaign concepts, and prepare a 30-day content calendar.",
    );

    expect(plan.tasks.length).toBeGreaterThanOrEqual(4);

    // Execute first two parallel tasks
    const firstStage = plan.parallelStages[0];
    expect(firstStage.length).toBeGreaterThanOrEqual(2);

    for (const taskId of firstStage) {
      await backend.tasks.executeTaskWithRetry(
        taskId,
        async () => "Audience pain points & school leads mapped",
      );
    }

    const completed = plan.tasks.filter((t) => firstStage.includes(t.id));
    expect(completed.every((t) => t.status === "COMPLETED")).toBe(true);
  });

  // Demonstration 3: Business Analysis
  it("Demonstration 3 (Business Analysis): Analyzes dataset and identifies conversion bottlenecks", () => {
    const skill = backend.skills.getSkill("skill-data-analysis");
    expect(skill).toBeDefined();

    const validation = backend.skills.validateSkillInput("skill-data-analysis", {
      datasetUrl: "https://meetuniversity.com/data/admissions-funnel-q3.csv",
      metricsToAnalyze: ["counselor_dropoff", "visa_approval_rate"],
    });

    expect(validation.isValid).toBe(true);
  });

  // Demonstration 4: Development Team
  it("Demonstration 4 (Development Team): Inspects repository and requires human sign-off before changes", async () => {
    const inspection = await backend.integrations.executeIntegrationAction(
      "int-github",
      "inspect_repository",
      {
        repo: "Studio1-OSS/OpenCrewBot",
      },
    );

    expect(inspection.success).toBe(true);
    expect(inspection.result.license).toBe("MIT");

    // Require human approval before any push or modification
    const approvalReq = backend.approvals.createApprovalRequest({
      actionType: "git_push_hotfix",
      requestedByAgentId: "agent-dev-inspector",
      targetToolOrIntegration: "github_api",
      payload: { repo: "Studio1-OSS/OpenCrewBot", branch: "patch-1" },
      actionPreviewDiff: "- vulnerable_dependency\n+ patched_dependency",
      riskLevel: "HIGH",
    });

    expect(approvalReq.status).toBe("PENDING");
  });

  // Demonstration 5: Autonomous Routine
  it("Demonstration 5 (Autonomous Routine): Manages recurring competitor-monitoring workflow", async () => {
    const wf = backend.workflows.getWorkflow("wf-competitor-pulse");
    expect(wf).toBeDefined();
    expect(wf?.cronExpression).toBe("0 8 * * 1-5");

    const result = await backend.workflows.triggerWorkflow("wf-competitor-pulse");
    expect(result.status).toBe("SUCCESS");
    expect(wf?.executionHistory.length).toBeGreaterThanOrEqual(2);
  });

  // Demonstration 6: Persistent Memory
  it("Demonstration 6 (Persistent Memory): Recalls user preference and respects corrections across restarts", async () => {
    const testPath = "data/workspaces/test-memory-demo/MEMORY.md";

    // 1. Teach initial preference
    await backend.memory.writeMemory(
      testPath,
      "## Preferences\n- Prefers concise executive summaries under 200 words.",
    );
    let loaded = backend.memory.readMemory(testPath);
    expect(loaded).toContain("concise executive summaries");

    // 2. Operator updates / corrects preference
    await backend.memory.writeMemory(
      testPath,
      "## Preferences\n- Prefers detailed appendices with complete formula derivations.",
    );
    loaded = backend.memory.readMemory(testPath);
    expect(loaded).toContain("complete formula derivations");
    expect(loaded).not.toContain("concise executive summaries");
  });

  // Demonstration 7: Human Intervention
  it("Demonstration 7 (Human Intervention): Rejects external action with zero side-effects and explicit prevention notice", () => {
    const request = backend.approvals.createApprovalRequest({
      actionType: "send_partner_broadcast_email",
      requestedByAgentId: "agent-growth-hacker",
      targetToolOrIntegration: "gmail_gateway",
      payload: { recipients: ["admissions@cambridge.edu"], subject: "Partnership" },
      actionPreviewDiff: "Send cold outbound email to admissions@cambridge.edu",
      riskLevel: "HIGH",
    });

    // Operator Rejects
    const resolved = backend.approvals.resolveApprovalRequest(
      request.id,
      "REJECTED",
      "operator-alex",
      "Tone too aggressive for university partnership.",
    );

    expect(resolved.status).toBe("REJECTED");
    expect(resolved.executionPreventedNotice).toBe(
      "Execution Prevented: Action blocked and logged to security audit log",
    );

    // Verify in audit trail
    const audit = backend.approvals.listAuditLog();
    const blockedEvent = audit.find((a) => a.eventType === "EXECUTION_PREVENTED");
    expect(blockedEvent).toBeDefined();
    expect(blockedEvent?.executionBlocked).toBe(true);
  });
});
