# OpenCrewBot 2.0 — Proposed Backend Architecture & Modular Engineering

**Assignment Reference**: EDXSO AI Engineer Internship Assignment 3  
**Architecture Paradigm**: Modular Enterprise Architecture, Domain-Driven Design (DDD), SOLID Principles & OOP Abstraction

---

## 1. System Architecture Overview

OpenCrewBot 2.0 re-architects the single-file procedural runtime into a high-reliability, modular enterprise multi-agent operating system. It decouples high-level business orchestration from concrete LLM execution and storage adapters.

```mermaid
graph TD
    subgraph UI_Layer ["Presentation Layer (14 Enterprise Screens)"]
        SHELL["Workspace Shell & Command Palette (Ctrl+K)"]
        VIEWS["Overview | Workspace | Agents | Rooms | Tasks | Skills | Memory | Models | Approvals | Integrations | Workflows | History | Analytics | Settings"]
    end

    subgraph API_GW ["API Gateway & Controller Layer"]
        AUTH["Auth & Workspace Tenant Barrier"]
        ROUTERS["REST & SSE Endpoints (/api/*)"]
        VAL["Zod Input Validation & Error Filter"]
    end

    subgraph Orchestration ["Intelligent Orchestration Core"]
        COS["ChiefOfStaffEngine (Intent & Decomposition)"]
        DAG["TaskGraphScheduler (Topological Sort O(V+E))"]
        FACTORY["DynamicAgentFactory (NL Prompt Compiler)"]
        ROOM_MGR["CollaborationRoomManager (Protocol & Consensus)"]
    end

    subgraph Domain_Services ["Domain Services (OOP & Interfaces)"]
        TASK_SVC["TaskExecutionEngine (State Machine & Retries)"]
        MEM_SVC["PersistentMemoryEngine (Markdown + Provenance)"]
        SKILL_SVC["SkillsRegistry (8 Enterprise Skills & Schemas)"]
        TOOL_SVC["ToolExecutionEngine (Sandbox & Permissions)"]
        APP_SVC["PolicyEnforcementLayer (3-Tier Approval Barrier)"]
        WF_SVC["WorkflowScheduler (Cron Engine & Monitors)"]
    end

    subgraph Adapters ["Integration & Model Adapters"]
        MODELS["ModelProviderAdapter (Groq, NVIDIA NIM, OpenAI, Anthropic)"]
        INT_ADAPTERS["IntegrationAdapters (GitHub, Gmail, Slack, HubSpot, Jira)"]
        MCP_ADAPTER["McpClientManager (Remote MCP Protocols)"]
    end

    subgraph Persistence ["Persistence & Storage Layer"]
        HYBRID_STORE["Hybrid Storage Repository"]
        PG_SUPABASE[("Supabase / PostgreSQL (Structured State & RLS)")]
        SQLITE_LOCAL[("LibSQL / SQLite (Offline Development)")]
        MD_FILES[("data/workspaces/<botId>/MEMORY.md")]
        AUDIT_LOG[("Immutable Security Audit Trail")]
    end

    SHELL --> VIEWS
    VIEWS --> API_GW
    API_GW --> Orchestration
    Orchestration --> Domain_Services
    Domain_Services --> Adapters
    Domain_Services --> Persistence
    APP_SVC -.-> |"Enforces Pre-Execution Gate"| TOOL_SVC
```

---

## 2. Core Modules & OOP / SOLID Principles

Every module is designed with strict boundaries, interfaces, and separation of concerns:

| Module                    | Core Interface / Class             | OOP & SOLID Application                       | Responsibility                                                                                                           |
| ------------------------- | ---------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Chief of Staff**        | `IChiefOfStaffEngine`              | Single Responsibility (SRP)                   | Deconstructs complex natural-language goals into structured dependency graphs (DAGs).                                    |
| **Dynamic Agent Factory** | `IAgentFactory`                    | Factory Pattern, Open/Closed (OCP)            | Generates valid agent configurations from user prompts without modifying source code.                                    |
| **Collaboration Rooms**   | `IRoomCollaborationEngine`         | Mediator Pattern                              | Coordinates agent-to-agent dialogue, manages shared context, and detects circular loops.                                 |
| **Task Execution**        | `ITaskExecutionEngine`             | State Pattern, Command Pattern                | Manages task state transitions (`PENDING` -> `QUEUED` -> `RUNNING` -> `COMPLETED`/`FAILED`), retries, and interruptions. |
| **Skills & Tools**        | `ISkillsRegistry`, `IToolRegistry` | Strategy Pattern, Interface Segregation (ISP) | Validates input/output JSON schemas, tests payloads, and binds permissions.                                              |
| **Policy Enforcement**    | `IPolicyEnforcementService`        | Proxy / Guard Pattern                         | Blocks sensitive side effects prior to execution until approved by human operator.                                       |
| **Model Providers**       | `IModelProvider`                   | Liskov Substitution (LSP), Polymorphism       | Unified abstraction over Groq, NVIDIA NIM, OpenAI, and Anthropic with automatic fallback.                                |
| **Memory Engine**         | `IPersistentMemoryStore`           | Repository Pattern                            | Atomic read/write of Markdown files with versioning, secret redaction, and audit provenance.                             |

---

## 3. Data Structures & Algorithms

To ensure predictable performance under heavy enterprise agent workloads, all core operations utilize mathematically verified data structures:

### A. Task Dependency DAG & Topological Scheduling

- **Data Structure**: Directed Acyclic Graph (DAG) represented as an Adjacency List: `Map<TaskId, Set<TaskId>>`.
- **Algorithm**: Kahn's Topological Sorting Algorithm with in-degree array:
  - Detects circular dependencies in $O(V + E)$ time.
  - Identifies independent tasks (in-degree = 0) to schedule them concurrently in parallel worker pools.
  - Sequentially unlocks dependent tasks upon parent task completion.

```mermaid
graph LR
    subgraph Plan_DAG ["Chief of Staff Generated DAG"]
        T1["Task 1: Market Data Scraping (Scout)"]
        T2["Task 2: Competitor Financials (Analyst)"]
        T3["Task 3: Comparative Analysis (Atlas)"]
        T4["Task 4: Strategic Recommendations (Reviewer)"]
        T5["Task 5: Final Deliverable Synthesis (Chief of Staff)"]

        T1 --> T3
        T2 --> T3
        T3 --> T4
        T4 --> T5
    end
```

### B. Cycle Detection in Agent Collaboration Handoffs

- **Data Structure**: Handoff Call Stack `Array<{ fromAgent: string, toAgent: string, depth: number }>` and Visitation Set `Set<string>`.
- **Algorithm**: Depth-bounded cycle detection with execution budget:
  - Handoff depth capped at 5 hops.
  - Immediate termination if a cycle $(A \to B \to A)$ is detected without new intermediate data.

### C. O(1) Fast Lookups

- Agent directory, active room sessions, and pending approval tokens are indexed using Hash Maps (`Map<string, T>`) providing $O(1)$ lookup complexity.

---

## 4. Agent Execution Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING: User Submits Instruction
    PENDING --> PLANNING: Chief of Staff Evaluates Intent
    PLANNING --> DAG_GENERATED: Structured Plan Validated
    DAG_GENERATED --> QUEUED: Scheduled in Priority Queue
    QUEUED --> RUNNING: Worker Dispatches Agent Turn

    state RUNNING {
        [*] --> MODEL_INFERENCE
        MODEL_INFERENCE --> TOOL_CALL_DETECTED: Model Emits Tool Call
        TOOL_CALL_DETECTED --> PERMISSION_CHECK: Evaluate Risk Tier

        state PERMISSION_CHECK {
            [*] --> FULL_ACCESS: Read-Only / Low Risk
            [*] --> CONTROLLED_ACCESS: Pre-Approved Quota
            [*] --> ASK_FIRST: Sensitive / External Action
        }
    }

    ASK_FIRST --> WAITING_APPROVAL: Approval Card Generated
    WAITING_APPROVAL --> RUNNING: Operator Approves (Execute Tool)
    WAITING_APPROVAL --> BLOCKED: Operator Rejects (Execution Prevented)

    RUNNING --> COMPLETED: Output Verified
    RUNNING --> RETRYING: Transient Failure (Backoff + Jitter)
    RETRYING --> RUNNING: Attempt <= MaxRetries
    RETRYING --> FAILED: Attempt > MaxRetries

    COMPLETED --> [*]
    FAILED --> [*]
    BLOCKED --> [*]
```
