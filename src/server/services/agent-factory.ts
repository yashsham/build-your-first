// Dynamic Agent Factory & Runtime Registry
// Creates and Registers Configurable Specialized Agents via Natural Language or JSON Spec

import { randomUUID } from "node:crypto";
import type { AgentConfiguration, PermissionLevel } from "../types";

export class DynamicAgentFactory {
  private agentRegistry = new Map<string, AgentConfiguration>();

  constructor() {
    this.seedDefaultAgents();
  }

  private seedDefaultAgents(): void {
    const agents: AgentConfiguration[] = [
      {
        id: "agent-chief-of-staff",
        name: "Avery Sterling",
        role: "Chief of Staff & Lead Orchestrator",
        handle: "chief",
        description:
          "Decomposes complex executive business instructions, coordinates multi-agent workflows, and verifies deliverables.",
        specialization: "Multi-Agent Coordination & Executive Planning",
        persona: "Decisive, structured, mathematically rigorous enterprise coordinator.",
        systemInstructions:
          "You are the Chief of Staff for the OpenCrewBot enterprise workforce. Break incoming requests into small, testable tasks with clear owners and dependencies. Schedule independent tasks in parallel and synthesize evidence-backed outcomes.",
        modelProvider: "groq",
        modelIdentifier: "llama-3.3-70b-versatile",
        modelParameters: { temperature: 0.2, maxTokens: 4096 },
        fallbackModel: { provider: "openai", modelIdentifier: "gpt-4o-mini" },
        skills: ["skill-market-research", "skill-presentation-creation"],
        tools: ["web_search", "memory_manager", "task_dispatcher"],
        memoryConfiguration: {
          enabled: true,
          workspacePath: "data/workspaces/chief/MEMORY.md",
          contextLineLimit: 200,
        },
        permissionLevel: "controlled_access",
        expectedOutputFormats: ["Structured DAG Execution Plan", "Executive Business Briefing"],
        status: "active",
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T12:00:00Z",
      },
      {
        id: "agent-scout-research",
        name: "Scout",
        role: "Senior Market & Intelligence Researcher",
        handle: "scout",
        description:
          "Scrapes, cross-references, and synthesizes competitive intelligence with verified citation URLs.",
        specialization: "Competitive Intelligence & Primary Sourced Web Extraction",
        persona: "Inquisitive, analytical, rigorous fact-checker.",
        systemInstructions:
          "Search and verify facts using primary documentation. Report findings with strict citation URLs. Flag conflicting claims plainly.",
        modelProvider: "nvidia",
        modelIdentifier: "meta/llama-3.1-405b-instruct",
        modelParameters: { temperature: 0.3, maxTokens: 8192 },
        skills: ["skill-market-research", "skill-competitor-analysis", "skill-lead-generation"],
        tools: ["web_search", "browser_inspection", "memory_manager"],
        memoryConfiguration: {
          enabled: true,
          workspacePath: "data/workspaces/scout/MEMORY.md",
          contextLineLimit: 200,
        },
        permissionLevel: "ask_first",
        expectedOutputFormats: ["Competitive Intelligence Matrix", "Sourced Research Synthesis"],
        status: "active",
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T12:00:00Z",
      },
      {
        id: "agent-quill-writer",
        name: "Quill",
        role: "Executive Communications & Content Strategist",
        handle: "quill",
        description:
          "Transforms technical findings, market data, and bullet points into polished business memos and campaign plans.",
        specialization: "Executive Memos, Content Calendars & Marketing Strategy",
        persona: "Articulate, brand-conscious, persuasive editorial strategist.",
        systemInstructions:
          "Write with clarity, authoritative cadence, and zero unnecessary fluff. Conform to enterprise tone and audience specifications.",
        modelProvider: "anthropic",
        modelIdentifier: "claude-3-5-sonnet",
        modelParameters: { temperature: 0.5, maxTokens: 4096 },
        skills: ["skill-presentation-creation", "skill-email-drafting"],
        tools: ["template_renderer", "memory_manager"],
        memoryConfiguration: {
          enabled: true,
          workspacePath: "data/workspaces/quill/MEMORY.md",
          contextLineLimit: 200,
        },
        permissionLevel: "controlled_access",
        expectedOutputFormats: ["Marketing Campaign Plan", "Stakeholder Communication Memo"],
        status: "active",
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T12:00:00Z",
      },
      {
        id: "agent-atlas-planner",
        name: "Atlas",
        role: "Operations & Delivery Coordinator",
        handle: "atlas",
        description:
          "Monitors operational milestones, tracks dependencies, and prevents cross-agent blockers.",
        specialization: "Project Roadmaps & Cross-Functional Workflows",
        persona: "Systematic, meticulous, timeline-focused manager.",
        systemInstructions:
          "Track milestones, flag blocked dependencies early, and optimize resource allocation.",
        modelProvider: "groq",
        modelIdentifier: "llama-3.3-70b-versatile",
        modelParameters: { temperature: 0.2, maxTokens: 4096 },
        skills: ["skill-presentation-creation", "skill-email-drafting"],
        tools: ["task_dispatcher", "memory_manager"],
        memoryConfiguration: {
          enabled: true,
          workspacePath: "data/workspaces/atlas/MEMORY.md",
          contextLineLimit: 200,
        },
        permissionLevel: "controlled_access",
        expectedOutputFormats: ["Gantt Dependency Map", "Milestone Progress Log"],
        status: "active",
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T12:00:00Z",
      },
      {
        id: "agent-financial-analyst",
        name: "Elena Vance",
        role: "Lead Financial & Unit Economics Modeler",
        handle: "elena",
        description:
          "Calculates customer acquisition cost (CAC), LTV, payback windows, and unit economics sensitivity models.",
        specialization: "SaaS Metrics, DCF Modeling & Spreadsheet Computation",
        persona: "Quantitative, formula-driven mathematical analyst.",
        systemInstructions:
          "Perform explicit arithmetic calculations. Prove LTV:CAC ratios and compute conversion funnel loss.",
        modelProvider: "nvidia",
        modelIdentifier: "nvidia/nemotron-4-340b-instruct",
        modelParameters: { temperature: 0.1, maxTokens: 8192 },
        skills: ["skill-financial-modelling", "skill-data-analysis"],
        tools: ["code_execution_quickjs", "memory_manager"],
        memoryConfiguration: {
          enabled: true,
          workspacePath: "data/workspaces/elena/MEMORY.md",
          contextLineLimit: 200,
        },
        permissionLevel: "controlled_access",
        expectedOutputFormats: ["Unit Economics Sensitivity Table", "Financial Forecast Summary"],
        status: "active",
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T12:00:00Z",
      },
      {
        id: "agent-dev-inspector",
        name: "Devon Cross",
        role: "Principal Systems & Code Reviewer",
        handle: "devon",
        description:
          "Inspects codebases, verifies git commits, reviews pull requests, and validates security boundaries.",
        specialization: "Code Audit, Dependency Analysis & GitHub Integration",
        persona: "Rigorous software engineer with zero tolerance for technical debt.",
        systemInstructions:
          "Inspect repository diffs against architectural standards. Flag security holes and recommend fixes.",
        modelProvider: "openai",
        modelIdentifier: "gpt-4o",
        modelParameters: { temperature: 0.2, maxTokens: 8192 },
        skills: ["skill-code-review"],
        tools: ["github_api", "git_inspect", "memory_manager"],
        memoryConfiguration: {
          enabled: true,
          workspacePath: "data/workspaces/devon/MEMORY.md",
          contextLineLimit: 200,
        },
        permissionLevel: "ask_first",
        expectedOutputFormats: ["Code Inspection Report", "Architecture Improvement Diff"],
        status: "active",
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T12:00:00Z",
      },
      {
        id: "agent-policy-sentinel",
        name: "Marcus Ward",
        role: "Governance & Security Sentinel",
        handle: "sentinel",
        description:
          "Enforces data privacy compliance, validates external side-effect approvals, and audits memory logs.",
        specialization: "Enterprise Governance, GDPR/HIPAA Compliance & Pre-Execution Gates",
        persona: "Cautious, vigilant corporate governance officer.",
        systemInstructions:
          "Verify that all external modifications carry authenticated approval tokens before execution.",
        modelProvider: "groq",
        modelIdentifier: "llama-3.3-70b-versatile",
        modelParameters: { temperature: 0.1, maxTokens: 4096 },
        skills: ["skill-code-review"],
        tools: ["security_audit_logger", "memory_manager"],
        memoryConfiguration: {
          enabled: true,
          workspacePath: "data/workspaces/sentinel/MEMORY.md",
          contextLineLimit: 200,
        },
        permissionLevel: "ask_first",
        expectedOutputFormats: ["Security Compliance Audit", "Risk Assessment Matrix"],
        status: "active",
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T12:00:00Z",
      },
      {
        id: "agent-growth-hacker",
        name: "Rhea Thorne",
        role: "Growth Operations & Lead Strategist",
        handle: "rhea",
        description:
          "Designs outbound outreach funnels, leads discovery for educational institutions, and scores partner fit.",
        specialization: "Educational Partner Funnels & Institutional Lead Generation",
        persona: "Energetic, metric-focused growth architect.",
        systemInstructions:
          "Identify high-propensity partner universities and schools. Segment leads by enrollment and readiness.",
        modelProvider: "groq",
        modelIdentifier: "llama-3.3-70b-versatile",
        modelParameters: { temperature: 0.4, maxTokens: 4096 },
        skills: ["skill-lead-generation", "skill-email-drafting"],
        tools: ["web_search", "memory_manager"],
        memoryConfiguration: {
          enabled: true,
          workspacePath: "data/workspaces/rhea/MEMORY.md",
          contextLineLimit: 200,
        },
        permissionLevel: "controlled_access",
        expectedOutputFormats: ["Target Institutional Prospect Table", "Outreach Funnel Sequence"],
        status: "active",
        createdAt: "2026-11-20T10:00:00Z",
        updatedAt: "2026-11-21T12:00:00Z",
      },
    ];

    for (const a of agents) {
      this.agentRegistry.set(a.id, a);
    }
  }

  /**
   * Generates a fully formed AgentConfiguration from a natural-language description.
   */
  public generateAgentFromNaturalLanguage(
    prompt: string,
    preferredPermission: PermissionLevel = "controlled_access",
  ): AgentConfiguration {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) throw new Error("Agent prompt description cannot be empty.");

    const id = `agent-dyn-${randomUUID().slice(0, 8)}`;
    const words = cleanPrompt.split(/\s+/);
    const shortTitle = words
      .slice(0, 3)
      .join(" ")
      .replace(/[^a-zA-Z0-9 ]/g, "");
    const handle = shortTitle.toLowerCase().replace(/\s+/g, "-");

    // Dynamic model selection based on keywords in prompt
    let modelProvider: AgentConfiguration["modelProvider"] = "groq";
    let modelIdentifier = "llama-3.3-70b-versatile";
    if (/code|git|inspect|technical|bug/i.test(cleanPrompt)) {
      modelProvider = "openai";
      modelIdentifier = "gpt-4o";
    } else if (/financial|math|calculation|stat/i.test(cleanPrompt)) {
      modelProvider = "nvidia";
      modelIdentifier = "nvidia/nemotron-4-340b-instruct";
    } else if (/copy|email|editorial|story/i.test(cleanPrompt)) {
      modelProvider = "anthropic";
      modelIdentifier = "claude-3-5-sonnet";
    }

    const newAgent: AgentConfiguration = {
      id,
      name: shortTitle.length > 0 ? shortTitle : "Dynamic Autonomous Agent",
      role: `Specialist: ${cleanPrompt.slice(0, 60)}...`,
      handle,
      description: cleanPrompt,
      specialization: "Dynamically Synthesized Domain Task",
      persona: "Focused, responsive autonomous worker synthesized on demand.",
      systemInstructions: `You are an autonomous specialist agent created dynamically to execute: "${cleanPrompt}". Apply evidence-backed reasoning and deliver structured deliverables.`,
      modelProvider,
      modelIdentifier,
      modelParameters: { temperature: 0.3, maxTokens: 4096 },
      skills: ["skill-market-research"],
      tools: ["web_search", "memory_manager"],
      memoryConfiguration: {
        enabled: true,
        workspacePath: `data/workspaces/${handle}/MEMORY.md`,
        contextLineLimit: 200,
      },
      permissionLevel: preferredPermission,
      expectedOutputFormats: ["Structured Deliverable Summary"],
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.registerAgent(newAgent);
    return newAgent;
  }

  public registerAgent(agent: AgentConfiguration): void {
    if (this.agentRegistry.has(agent.id)) {
      throw new Error(`Agent ID '${agent.id}' is already registered.`);
    }
    this.agentRegistry.set(agent.id, agent);
  }

  public getAgent(id: string): AgentConfiguration | undefined {
    return this.agentRegistry.get(id);
  }

  public getAgentByHandle(handle: string): AgentConfiguration | undefined {
    const lower = handle.toLowerCase();
    for (const agent of this.agentRegistry.values()) {
      if (agent.handle.toLowerCase() === lower || agent.name.toLowerCase() === lower) {
        return agent;
      }
    }
    return undefined;
  }

  public listAgents(): AgentConfiguration[] {
    return Array.from(this.agentRegistry.values());
  }

  public updateAgentStatus(id: string, status: AgentConfiguration["status"]): void {
    const agent = this.agentRegistry.get(id);
    if (!agent) throw new Error(`Agent '${id}' not found.`);
    agent.status = status;
    agent.updatedAt = new Date().toISOString();
  }
}
