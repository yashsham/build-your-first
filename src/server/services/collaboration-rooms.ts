// Multi-Agent Collaboration Room Engine
// Structured Communication Protocols, Loop Prevention & Consensus Deliverables

import { createHash, randomUUID } from "node:crypto";
import type { CollaborationRoom, StructuredRoomMessage, RoomMessageType } from "../types";

export class CollaborationRoomEngine {
  private rooms = new Map<string, CollaborationRoom>();

  constructor() {
    this.seedDefaultRooms();
  }

  private seedDefaultRooms(): void {
    const defaultRooms: CollaborationRoom[] = [
      {
        id: "room-market-intel",
        name: "Market Intelligence & Competitive Strategy",
        topic:
          "MeetUniversity expansion in international study abroad and competitor pricing models.",
        emoji: "🔭",
        leadAgentId: "agent-chief-of-staff",
        memberAgentIds: [
          "agent-chief-of-staff",
          "agent-scout-research",
          "agent-financial-analyst",
          "agent-quill-writer",
        ],
        sharedContext: {
          objective:
            "Map competitor pricing and admissions guidance products across North America and UK markets.",
          keyDecisions: ["Focus initial benchmarking on IDP, LeapScholar, and LeverageEdu."],
          verifiedFacts: {
            "Target Geography": "India -> UK / US / Canada / Germany",
            "Student Segment": "Undergraduate & Graduate",
          },
        },
        messageTimeline: [],
        status: "active",
        deliverables: [],
        createdAt: "2026-11-20T10:00:00Z",
      },
      {
        id: "room-campaign-studio",
        name: "Marketing & Student Aspirations Campaign",
        topic:
          "Class 11 outreach campaign development for career navigation and early university prep.",
        emoji: "🎨",
        leadAgentId: "agent-quill-writer",
        memberAgentIds: [
          "agent-quill-writer",
          "agent-scout-research",
          "agent-growth-hacker",
          "agent-atlas-planner",
        ],
        sharedContext: {
          objective: "Design 30-day omnichannel campaign targeting Class 11 student aspirations.",
          keyDecisions: [
            "Lead message to focus on stream selection clarity rather than high-stakes exam pressure.",
          ],
          verifiedFacts: {
            "Primary Channels":
              "Instagram Reels, LinkedIn Student Community, High School WhatsApp Broadcasts",
          },
        },
        messageTimeline: [],
        status: "active",
        deliverables: [],
        createdAt: "2026-11-20T10:00:00Z",
      },
      {
        id: "room-finance-growth",
        name: "Unit Economics & Institutional Growth",
        topic:
          "Conversion funnel optimization, school partnership revenue sharing, and financial modeling.",
        emoji: "📈",
        leadAgentId: "agent-financial-analyst",
        memberAgentIds: ["agent-financial-analyst", "agent-growth-hacker", "agent-chief-of-staff"],
        sharedContext: {
          objective:
            "Optimize sales conversion funnel and reduce institutional partner onboarding friction.",
          keyDecisions: [
            "Model target LTV:CAC ratio above 3.5x for university enrollment partnerships.",
          ],
          verifiedFacts: { "Target Payback Window": "under 5 months" },
        },
        messageTimeline: [],
        status: "active",
        deliverables: [],
        createdAt: "2026-11-20T10:00:00Z",
      },
      {
        id: "room-security-audit",
        name: "Governance, Security & Architecture Audit",
        topic:
          "GitHub repository inspections, pre-execution human sign-off gates, and credential security.",
        emoji: "🛡️",
        leadAgentId: "agent-policy-sentinel",
        memberAgentIds: ["agent-policy-sentinel", "agent-dev-inspector", "agent-chief-of-staff"],
        sharedContext: {
          objective:
            "Review OpenCrewBot 2.0 repository commits and verify zero credential leakage before PR merge.",
          keyDecisions: [
            "Enforce Ask First policy on all GitHub commit pushes and production webhook triggers.",
          ],
          verifiedFacts: { "Approval Barrier": "Strict Pre-Execution Gate Enabled" },
        },
        messageTimeline: [],
        status: "active",
        deliverables: [],
        createdAt: "2026-11-20T10:00:00Z",
      },
    ];

    for (const r of defaultRooms) {
      this.rooms.set(r.id, r);
    }
  }

  public getRoom(id: string): CollaborationRoom | undefined {
    return this.rooms.get(id);
  }

  public listRooms(): CollaborationRoom[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Posts a structured collaboration message to the room.
   * Enforces message schemas and cycle/depth detection to prevent endless loops.
   */
  public postMessage(params: {
    roomId: string;
    senderAgentId: string;
    recipientAgentId: string | "all";
    messageType: RoomMessageType;
    payload: StructuredRoomMessage["payload"];
    correlationId?: string;
  }): StructuredRoomMessage {
    const room = this.rooms.get(params.roomId);
    if (!room) throw new Error(`Collaboration room '${params.roomId}' not found.`);

    if (!room.memberAgentIds.includes(params.senderAgentId)) {
      throw new Error(
        `Agent '${params.senderAgentId}' is not an authorized member of room '${params.roomId}'.`,
      );
    }

    // Loop Prevention: Count consecutive messages in this correlation thread
    const corrId = params.correlationId || `corr-${randomUUID().slice(0, 8)}`;
    const recentThread = room.messageTimeline.filter((m) => m.correlationId === corrId);

    if (recentThread.length >= 10) {
      throw new Error(
        `Max collaboration depth exceeded for correlation thread '${corrId}'. Terminating to prevent endless loop.`,
      );
    }

    const message: StructuredRoomMessage = {
      id: `msg-${randomUUID().slice(0, 8)}`,
      roomId: params.roomId,
      correlationId: corrId,
      senderAgentId: params.senderAgentId,
      recipientAgentId: params.recipientAgentId,
      messageType: params.messageType,
      payload: params.payload,
      timestamp: new Date().toISOString(),
    };

    room.messageTimeline.push(message);

    // If message is a consensus or deliverable, record an official room deliverable
    if (params.messageType === "DELIVERABLE" || params.messageType === "CONSENSUS_REACHED") {
      const content = `${params.payload.summary}\n\n${params.payload.details || ""}`;
      const sha256Hash = createHash("sha256").update(content).digest("hex");

      room.deliverables.push({
        id: `deliv-${randomUUID().slice(0, 8)}`,
        title: params.payload.summary.slice(0, 60),
        content,
        sha256Hash,
        verifiedBy: [params.senderAgentId, room.leadAgentId],
        createdAt: new Date().toISOString(),
      });
    }

    return message;
  }
}
