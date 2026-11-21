import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace-shell";
import { WorkspacePage } from "@/components/workspace-pages";
import { workspaceMeta } from "@/lib/workspace-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: workspaceMeta(
      "Overview & Command Centre",
      "Enterprise AI workforce management, queued work, and human-in-the-loop review.",
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkspaceShell>
      <WorkspacePage page="overview" />
    </WorkspaceShell>
  );
}
