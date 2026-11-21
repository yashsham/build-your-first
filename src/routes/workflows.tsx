import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace-shell";
import { WorkspacePage } from "@/components/workspace-pages";
import { workspaceMeta } from "@/lib/workspace-data";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: workspaceMeta(
      "Scheduled Workflows",
      "Autonomous recurring multi-agent pipelines and trigger monitoring.",
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkspaceShell>
      <WorkspacePage page="workflows" />
    </WorkspaceShell>
  );
}
