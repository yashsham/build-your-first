import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace-shell";
import { WorkspacePage } from "@/components/workspace-pages";
import { workspaceMeta } from "@/lib/workspace-data";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: workspaceMeta(
      "Workspace Settings",
      "Theme, security gates, notification policies, and data retention.",
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkspaceShell>
      <WorkspacePage page="settings" />
    </WorkspaceShell>
  );
}
