// Skills Registry & Enterprise Schema Management
// Implements 8 Reusable Enterprise Skills with Strict Typed JSON Schemas

import type { SkillDefinition, JSONSchemaDefinition } from "../types";

export class SkillsRegistry {
  private skills = new Map<string, SkillDefinition>();

  constructor() {
    this.registerDefaultEnterpriseSkills();
  }

  private registerDefaultEnterpriseSkills(): void {
    const defaultSkills: SkillDefinition[] = [
      {
        id: "skill-market-research",
        name: "Market Research",
        description:
          "Conducts deep market trend analysis, TAM/SAM/SOM estimation, and market positioning.",
        category: "research",
        instructions:
          "Perform structured market research. Identify industry growth drivers, regulatory factors, and demographic segments. Always include citation URLs and evidence-backed data points.",
        inputSchema: {
          type: "object",
          properties: {
            industry: { type: "string", description: "Target industry or market segment" },
            geography: {
              type: "string",
              description: "Target geography (e.g., DACH, North America, Global)",
            },
            timeHorizonYears: { type: "number", description: "Projection timeframe in years" },
          },
          required: ["industry", "geography"],
        },
        outputSchema: {
          type: "object",
          properties: {
            marketSizeUsdMillions: { type: "number" },
            cagrPercentage: { type: "number" },
            keyDrivers: { type: "array" },
            citations: { type: "array" },
          },
          required: ["marketSizeUsdMillions", "keyDrivers"],
        },
        dependencies: [],
        requiredTools: ["web_search", "document_reader"],
        permissions: ["read_network"],
        version: "2.1.0",
        isAvailable: true,
      },
      {
        id: "skill-competitor-analysis",
        name: "Competitor Analysis",
        description:
          "Extracts competitor pricing, positioning, feature matrices, and moat assessments.",
        category: "research",
        instructions:
          "Analyze 3-5 primary competitors. Detail their pricing model, target customer profile, strengths, vulnerabilities, and strategic differentiation.",
        inputSchema: {
          type: "object",
          properties: {
            targetCompany: {
              type: "string",
              description: "Base company or product being evaluated",
            },
            competitorNames: { type: "array", description: "List of named competitors" },
          },
          required: ["targetCompany"],
        },
        outputSchema: {
          type: "object",
          properties: {
            comparisonTable: { type: "array" },
            vulnerabilities: { type: "array" },
            strategicRecommendations: { type: "string" },
          },
          required: ["comparisonTable", "strategicRecommendations"],
        },
        dependencies: ["skill-market-research"],
        requiredTools: ["web_search", "browser_inspection"],
        permissions: ["read_network"],
        version: "2.0.0",
        isAvailable: true,
      },
      {
        id: "skill-financial-modelling",
        name: "Financial Modelling",
        description:
          "Builds DCF valuation models, unit economics breakdown, and CAC/LTV forecasts.",
        category: "finance",
        instructions:
          "Calculate gross margins, customer acquisition cost (CAC), lifetime value (LTV), payback period, and sensitivity analysis. Present calculations with step-by-step arithmetic formulas.",
        inputSchema: {
          type: "object",
          properties: {
            arpuUsd: { type: "number", description: "Average Revenue Per User" },
            churnRateMonthly: { type: "number", description: "Monthly churn rate percentage" },
            cacUsd: { type: "number", description: "Customer Acquisition Cost" },
          },
          required: ["arpuUsd", "churnRateMonthly", "cacUsd"],
        },
        outputSchema: {
          type: "object",
          properties: {
            ltvUsd: { type: "number" },
            ltvToCacRatio: { type: "number" },
            monthsToPayback: { type: "number" },
            breakEvenMonth: { type: "number" },
          },
          required: ["ltvUsd", "ltvToCacRatio"],
        },
        dependencies: [],
        requiredTools: ["code_execution_quickjs"],
        permissions: ["execute_code_sandbox"],
        version: "1.5.0",
        isAvailable: true,
      },
      {
        id: "skill-presentation-creation",
        name: "Presentation Creation",
        description:
          "Drafts structured corporate slide decks, executive summaries, and visual outlines.",
        category: "marketing",
        instructions:
          "Organize presentation narrative into 8-12 slides. For each slide provide: Headline, 3 supporting bullet points, key statistic, and recommended diagram/visual.",
        inputSchema: {
          type: "object",
          properties: {
            deckTitle: { type: "string" },
            audienceType: {
              type: "string",
              description: "e.g., Board, Enterprise Customer, University Partner",
            },
            coreMessage: { type: "string" },
          },
          required: ["deckTitle", "audienceType"],
        },
        outputSchema: {
          type: "object",
          properties: {
            slides: { type: "array" },
            executiveSummary: { type: "string" },
          },
          required: ["slides", "executiveSummary"],
        },
        dependencies: [],
        requiredTools: ["template_renderer"],
        permissions: [],
        version: "1.2.0",
        isAvailable: true,
      },
      {
        id: "skill-email-drafting",
        name: "Email Drafting",
        description:
          "Generates high-conversion stakeholder emails, partner outreach, and executive memos.",
        category: "operations",
        instructions:
          "Draft concise, professional email correspondence. Include compelling subject line, clear value proposition, and frictionless call-to-action.",
        inputSchema: {
          type: "object",
          properties: {
            recipientRole: { type: "string" },
            purpose: { type: "string" },
            keyTerms: { type: "array" },
          },
          required: ["recipientRole", "purpose"],
        },
        outputSchema: {
          type: "object",
          properties: {
            subjectLine: { type: "string" },
            bodyMarkdown: { type: "string" },
            callToAction: { type: "string" },
          },
          required: ["subjectLine", "bodyMarkdown"],
        },
        dependencies: [],
        requiredTools: [],
        permissions: [],
        version: "1.0.0",
        isAvailable: true,
      },
      {
        id: "skill-code-review",
        name: "Code Review",
        description:
          "Inspects source repositories for architectural compliance, security risks, and optimization.",
        category: "engineering",
        instructions:
          "Audit code changes against SOLID principles, OWASP Top 10 vulnerabilities, and performance patterns. Provide line-referenced remediations.",
        inputSchema: {
          type: "object",
          properties: {
            repository: { type: "string" },
            branch: { type: "string" },
            diffContent: { type: "string" },
          },
          required: ["repository", "diffContent"],
        },
        outputSchema: {
          type: "object",
          properties: {
            securityAlerts: { type: "array" },
            architecturalIssues: { type: "array" },
            recommendedDiff: { type: "string" },
            passedVerification: { type: "boolean" },
          },
          required: ["securityAlerts", "passedVerification"],
        },
        dependencies: [],
        requiredTools: ["github_api", "git_inspect"],
        permissions: ["read_repository"],
        version: "3.0.0",
        isAvailable: true,
      },
      {
        id: "skill-data-analysis",
        name: "Data Analysis",
        description:
          "Parses tabular CSV/JSON spreadsheets, computes statistical trends, and detects conversion bottlenecks.",
        category: "finance",
        instructions:
          "Perform exploratory data analysis on sales/admission datasets. Compute mean, median, standard deviation, and conversion funnel drop-offs.",
        inputSchema: {
          type: "object",
          properties: {
            datasetUrl: { type: "string" },
            metricsToAnalyze: { type: "array" },
          },
          required: ["datasetUrl"],
        },
        outputSchema: {
          type: "object",
          properties: {
            summaryStatistics: { type: "object" },
            bottlenecksIdentified: { type: "array" },
            recommendations: { type: "array" },
          },
          required: ["summaryStatistics", "bottlenecksIdentified"],
        },
        dependencies: [],
        requiredTools: ["python_pandas_sandbox", "quickjs"],
        permissions: ["execute_code_sandbox"],
        version: "2.4.0",
        isAvailable: true,
      },
      {
        id: "skill-lead-generation",
        name: "Lead Generation",
        description:
          "Identifies target institutional prospects, university leads, and decision-maker contact points.",
        category: "marketing",
        instructions:
          "Filter prospective universities and schools by enrollment size, international student quotas, and partnership readiness scores.",
        inputSchema: {
          type: "object",
          properties: {
            targetRegion: { type: "string" },
            institutionType: { type: "string" },
            minimumEnrollment: { type: "number" },
          },
          required: ["targetRegion", "institutionType"],
        },
        outputSchema: {
          type: "object",
          properties: {
            leadsList: { type: "array" },
            priorityTargetCount: { type: "number" },
          },
          required: ["leadsList", "priorityTargetCount"],
        },
        dependencies: ["skill-market-research"],
        requiredTools: ["web_search", "crm_adapter"],
        permissions: ["read_network"],
        version: "1.8.0",
        isAvailable: true,
      },
    ];

    for (const skill of defaultSkills) {
      this.skills.set(skill.id, skill);
    }
  }

  public getSkill(id: string): SkillDefinition | undefined {
    return this.skills.get(id);
  }

  public listSkills(): SkillDefinition[] {
    return Array.from(this.skills.values());
  }

  public registerSkill(skill: SkillDefinition): void {
    if (this.skills.has(skill.id)) {
      throw new Error(`Skill with ID '${skill.id}' already exists.`);
    }
    this.skills.set(skill.id, skill);
  }

  /**
   * Validates if a given input payload matches the skill's JSON schema requirements.
   */
  public validateSkillInput(
    skillId: string,
    input: Record<string, unknown>,
  ): { isValid: boolean; errors: string[] } {
    const skill = this.skills.get(skillId);
    if (!skill) {
      return { isValid: false, errors: [`Skill '${skillId}' not found.`] };
    }

    const errors: string[] = [];
    const requiredFields = skill.inputSchema.required || [];

    for (const field of requiredFields) {
      if (input[field] === undefined || input[field] === null || input[field] === "") {
        errors.push(`Missing required field: '${field}'`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}
