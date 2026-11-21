import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace-shell";
import { WorkspacePage } from "@/components/workspace-pages";
import { workspaceMeta } from "@/lib/workspace-data";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: workspaceMeta(
      "Task Execution Dashboard",
      "Live execution queue, retries, dependency pipelines, and controls.",
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkspaceShell>
      <WorkspacePage page="tasks" />
    </WorkspaceShell>
  );
}
