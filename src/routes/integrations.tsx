import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace-shell";
import { WorkspacePage } from "@/components/workspace-pages";
import { workspaceMeta } from "@/lib/workspace-data";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: workspaceMeta(
      "Integration Manager",
      "Enterprise connections, sandboxed MCP tools, and credential scoping.",
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkspaceShell>
      <WorkspacePage page="integrations" />
    </WorkspaceShell>
  );
}
