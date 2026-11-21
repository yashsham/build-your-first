import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace-shell";
import { WorkspacePage } from "@/components/workspace-pages";
import { workspaceMeta } from "@/lib/workspace-data";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: workspaceMeta(
      "Agent Directory",
      "Review, configure, and dynamically generate autonomous enterprise agents.",
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkspaceShell>
      <WorkspacePage page="agents" />
    </WorkspaceShell>
  );
}
