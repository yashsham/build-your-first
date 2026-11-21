# OpenCrewBot 2.0

## Goal
Replace the starter page with a usable, responsive AI-workforce workspace based on the uploaded assignment brief and EDXSO’s public visual identity.

## Build
- Add a shared workspace frame with collapsible navigation, global search, notifications, profile controls, clear demo-mode labeling, and responsive navigation.
- Build the requested workspace modules as distinct pages: Overview, Agent Workspace, Agents, Collaboration Rooms, Task Execution, Skills & Tools, Memory, Models, Approvals, Integrations, Scheduled Workflows, Execution History, Analytics, and Settings.
- Use credible, explicitly labeled sample data only; keep integrations disconnected/demo and never claim backend-confirmed approvals or executions.
- Add useful front-end interactions for navigation, search, filters, forms, dialogs, memory editing, task controls, and theme settings; do not invent backend APIs or replace existing functionality.
- Apply EDXSO’s restrained blue-and-white visual direction using the project’s semantic design tokens, and add unique page metadata.

## Technical approach
- Keep the existing TanStack Start, React, TypeScript, Tailwind v4, and shadcn foundations; no new dependencies or backend work.
- Share typed sample data and focused UI modules across file-based routes, while preserving the home route as the overview.
- Verify navigation and key interactions in the running preview, check responsive layouts and build logs, then commit the completed changes.