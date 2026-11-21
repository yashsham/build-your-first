# OpenCrewBot 2.0 — End-to-End Data Flow & Integration Architecture

**Assignment Reference**: EDXSO AI Engineer Internship Assignment 3  
**Focus**: Request Lifecycles, Multi-Agent Inter-Communication, Integration Adapters & Approval Pipelines

---

## 1. End-to-End Request & Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Human Operator (Browser)
    participant UI as Enterprise Workspace UI
    participant SSE as EventSource Channel
    participant CoS as Chief of Staff Orchestrator
    participant DAG as Task DAG Scheduler
    participant AgentA as Agent Alpha (Researcher)
    participant AgentB as Agent Beta (Writer)
    participant Policy as Policy Enforcement Layer
    participant Tool as Tool / Integration Adapter
    participant Storage as Hybrid Storage / Memory

    Operator->>UI: Submit Multi-Stage Instruction
    UI->>CoS: POST /api/tasks/orchestrate
    CoS->>CoS: Intent Analysis & Task Decomposition
    CoS->>DAG: Build DAG (Tasks A & B)
    DAG->>UI: Emit Generated Execution Plan

    par Parallel Execution Step
        DAG->>AgentA: Dispatch Task A (Research Competitors)
        AgentA->>Storage: Read MEMORY.md (Check past notes)
        AgentA->>Tool: Execute Tavily Search
        Tool-->>AgentA: Sourced Findings
        AgentA->>Storage: Save Findings to Room Context
        AgentA-->>DAG: Task A Complete
    and
        DAG->>AgentB: Dispatch Task B (Audience Profile)
        AgentB->>Tool: Execute Internal Database Query
        Tool-->>AgentB: Student Demographic Stats
        AgentB-->>DAG: Task B Complete
    end

    DAG->>CoS: All Dependencies Met -> Unlock Task C (Draft Campaign)
    CoS->>AgentB: Dispatch Synthesis Task C
    AgentB->>Policy: Request External Action (e.g., Slack Draft or Email)

    alt Policy = Ask First
        Policy->>Storage: Create Pending Approval Record (Signed Hash)
        Policy-->>UI: Push Approval Request Card via SSE
        UI->>Operator: Present Action Preview & Diff Modal

        alt Operator Clicks "Approve"
            Operator->>UI: Authorize Action
            UI->>Policy: POST /api/approvals/:id/decision { decision: "approved" }
            Policy->>Tool: Dispatch Action to Slack/Gmail
            Tool-->>Policy: Action Executed OK
            Policy-->>AgentB: Resume with Execution Receipt
        else Operator Clicks "Reject"
            Operator->>UI: Reject Action
            UI->>Policy: POST /api/approvals/:id/decision { decision: "rejected" }
            Policy->>Policy: Invalidate Token & Mark Blocked
            Policy->>Storage: Log "Execution Prevented: Action blocked and logged to security audit log"
            Policy-->>AgentB: Action Denied (Halt Side Effect)
        end
    end

    AgentB-->>CoS: Final Output Prepared
    CoS->>Storage: Persist Completed Deliverable with SHA-256 Hash
    CoS-->>UI: Deliverable Ready for Operator Download
```

---

## 2. Multi-Agent Room Communication Protocol

In Collaboration Rooms, agents communicate through structured typed messages rather than unstructured text. This prevents circular hallucinations and provides transparent auditability.

```mermaid
graph TD
    subgraph Message_Envelope ["Structured Collaboration Message Envelope"]
        F1["roomId: string"]
        F2["correlationId: UUID"]
        F3["senderAgentId: string"]
        F4["recipientAgentId: string | 'all'"]
        F5["messageType: 'PROPOSAL' | 'CHALLENGE' | 'VERIFICATION' | 'DELIVERABLE'"]
        F6["payload: { objective, findings, data, citations }"]
        F7["timestamp: ISO8601"]
    end

    subgraph Consensus_Flow ["Multi-Agent Consensus Flow"]
        P1["1. Agent A issues PROPOSAL with Market Strategy"]
        P2["2. Agent B flags CHALLENGE on Pricing Assumptions"]
        P3["3. Agent A provides VERIFICATION with Citation Evidence"]
        P4["4. Room Lead issues CONSENSUS & delivers final verified artifact"]

        P1 --> P2
        P2 --> P3
        P3 --> P4
    end
```

---

## 3. Integration Architecture & Credential Boundary

OpenCrewBot 2.0 isolates third-party enterprise tools behind secure, sandboxed integration adapters. Privileged credentials never reach the browser client.

```mermaid
graph LR
    subgraph Client_Space ["Client Boundary"]
        BROWSER["Web Browser (React 19)"]
    end

    subgraph Server_Boundary ["Server Security Boundary"]
        GATEWAY["API Gateway (JWT / Session Token)"]
        CRED_VAULT["Secure Server Environment (.env / Secrets Vault)"]

        subgraph Adapters ["Integration Adapter Layer"]
            GH["GitHub Adapter (Octokit / MCP)"]
            GM["Gmail Adapter (Google Workspace API)"]
            SL["Slack Adapter (Web API / Bot Token)"]
            MCP_CLIENT["Sandboxed MCP Client"]
        end
    end

    subgraph External_Cloud ["External Enterprise SaaS"]
        EXT_GH["GitHub API (Repos, PRs, Issues)"]
        EXT_GM["Google Gmail API (Search, Drafts)"]
        EXT_SL["Slack Webhooks & Channels"]
        REMOTE_MCP["External Custom MCP Servers"]
    end

    BROWSER -->|Only Operator Commands| GATEWAY
    GATEWAY --> Adapters
    CRED_VAULT -.-> |Injects Scoped Credentials| Adapters
    GH --> EXT_GH
    GM --> EXT_GM
    SL --> EXT_SL
    MCP_CLIENT --> REMOTE_MCP
```

---

## 4. Persistent Memory Architecture & Synchronization

```mermaid
graph TD
    subgraph Memory_Scopes ["Hierarchical Memory Architecture"]
        M1["Individual Agent Memory: data/workspaces/<botId>/MEMORY.md"]
        M2["Shared Room Memory: data/rooms/<roomId>/CONTEXT.md"]
        M3["Global Project Knowledge: data/projects/<projectId>/README.md"]
    end

    subgraph Memory_Operations ["Concurrency & Security Pipeline"]
        READ["1. Read Request"] --> FILTER["2. Secret Redaction & Prompt Slicing"]
        WRITE["1. Write Request"] --> LOCK["2. Mutex File Lock (Prevent Race Conditions)"]
        LOCK --> SANITIZE["3. Regex Secret Redaction (Strip Keys, Tokens, Passwords)"]
        SANITIZE --> ATOMIC["4. Atomic Write (Write to .tmp -> Rename to .md)"]
        ATOMIC --> AUDIT["5. Append Provenance Log (Agent, Timestamp, Rationale)"]
    end

    M1 --> Memory_Operations
    M2 --> Memory_Operations
    M3 --> Memory_Operations
```
