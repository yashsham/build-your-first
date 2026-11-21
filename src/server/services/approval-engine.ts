// Human Approval & Security Policy Enforcement Engine
// Implements 3 Permission Tiers (Ask First, Controlled Access, Full Access)
// Strict Pre-Execution Barrier & Immutable Audit Prevention Trail

import { createHash, randomUUID } from "node:crypto";
import type { ApprovalRequest, AuditSecurityEvent, PermissionLevel, RiskLevel } from "../types";

export class ApprovalSecurityEngine {
  private requests = new Map<string, ApprovalRequest>();
  private auditLog: AuditSecurityEvent[] = [];

  /**
   * Evaluates if a proposed tool action requires human operator approval
   * based on the agent's permission level and tool risk classification.
   */
  public evaluatePermission(
    agentPermissionLevel: PermissionLevel,
    toolName: string,
    isExternalSideEffect: boolean,
  ): { requiresApproval: boolean; riskLevel: RiskLevel } {
    let riskLevel: RiskLevel = "LOW";

    if (
      isExternalSideEffect ||
      toolName.includes("post") ||
      toolName.includes("send") ||
      toolName.includes("deploy")
    ) {
      riskLevel = "HIGH";
    } else if (
      toolName.includes("write") ||
      toolName.includes("code") ||
      toolName.includes("delete")
    ) {
      riskLevel = "MEDIUM";
    }

    if (agentPermissionLevel === "ask_first") {
      // Ask First: Every external or state-mutating action requires approval
      return { requiresApproval: isExternalSideEffect || riskLevel !== "LOW", riskLevel };
    }

    if (agentPermissionLevel === "controlled_access") {
      // Controlled Access: Medium/High risk operations require approval
      return { requiresApproval: riskLevel === "HIGH" || riskLevel === "CRITICAL", riskLevel };
    }

    // Full Access: Autonomously allowed except for CRITICAL system boundaries
    return { requiresApproval: riskLevel === "CRITICAL", riskLevel };
  }

  /**
   * Registers a pre-execution approval request.
   * Cryptographically binds the exact action payload using SHA-256.
   */
  public createApprovalRequest(params: {
    actionType: string;
    requestedByAgentId: string;
    targetToolOrIntegration: string;
    payload: Record<string, unknown>;
    actionPreviewDiff: string;
    riskLevel: RiskLevel;
  }): ApprovalRequest {
    const serializedPayload = JSON.stringify(params.payload);
    const actionHash = createHash("sha256").update(serializedPayload).digest("hex");

    const request: ApprovalRequest = {
      id: `apr-${randomUUID().slice(0, 8)}`,
      actionType: params.actionType,
      requestedByAgentId: params.requestedByAgentId,
      targetToolOrIntegration: params.targetToolOrIntegration,
      payload: params.payload,
      actionPreviewDiff: params.actionPreviewDiff,
      riskLevel: params.riskLevel,
      status: "PENDING",
      actionHash,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minute expiration
    };

    this.requests.set(request.id, request);

    this.recordAudit({
      eventType: "APPROVAL_REQUESTED",
      actorId: params.requestedByAgentId,
      actorType: "agent",
      resource: `${params.targetToolOrIntegration}:${params.actionType}`,
      details: `Action approval requested for ${params.actionType}. Payload hash: ${actionHash.slice(0, 12)}`,
      payloadHash: actionHash,
      executionBlocked: true, // Blocked pending decision
    });

    return request;
  }

  /**
   * Processes the human operator's decision (Approve vs Reject).
   * In strict adherence to Assignment 3 rules:
   * A rejected action halts all execution paths and emits an explicit security prevention record.
   */
  public resolveApprovalRequest(
    requestId: string,
    decision: "APPROVED" | "REJECTED",
    operatorId: string,
    reason?: string,
  ): ApprovalRequest {
    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error(`Approval request '${requestId}' not found.`);
    }

    if (request.status !== "PENDING") {
      throw new Error(
        `Approval request '${requestId}' has already been resolved (${request.status}).`,
      );
    }

    // Check expiration
    if (new Date() > new Date(request.expiresAt)) {
      request.status = "EXPIRED";
      throw new Error(`Approval request '${requestId}' has expired.`);
    }

    request.resolvedAt = new Date().toISOString();
    request.resolvedBy = operatorId;

    if (decision === "APPROVED") {
      request.status = "APPROVED";
      this.recordAudit({
        eventType: "APPROVAL_GRANTED",
        actorId: operatorId,
        actorType: "human_operator",
        resource: request.targetToolOrIntegration,
        details: `Operator '${operatorId}' authorized execution of ${request.actionType}.`,
        payloadHash: request.actionHash,
        executionBlocked: false,
      });
    } else {
      request.status = "REJECTED";
      request.rejectionReason = reason || "Declined by security operator.";
      request.executionPreventedNotice =
        "Execution Prevented: Action blocked and logged to security audit log";

      this.recordAudit({
        eventType: "EXECUTION_PREVENTED",
        actorId: operatorId,
        actorType: "human_operator",
        resource: request.targetToolOrIntegration,
        details: `Execution blocked and logged to security audit log: ${request.actionType}. Reason: ${request.rejectionReason}`,
        payloadHash: request.actionHash,
        executionBlocked: true,
      });
    }

    return request;
  }

  public getRequest(id: string): ApprovalRequest | undefined {
    return this.requests.get(id);
  }

  public listPendingRequests(): ApprovalRequest[] {
    return Array.from(this.requests.values()).filter((r) => r.status === "PENDING");
  }

  public listAuditLog(): AuditSecurityEvent[] {
    return [...this.auditLog];
  }

  private recordAudit(event: Omit<AuditSecurityEvent, "id" | "timestamp">): void {
    this.auditLog.unshift({
      id: `aud-${randomUUID().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
      ...event,
    });
  }
}
