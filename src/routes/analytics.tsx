import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace-shell";
import { WorkspacePage } from "@/components/workspace-pages";
import { workspaceMeta } from "@/lib/workspace-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: workspaceMeta(
      "Analytics & Monitoring",
      "Telemetry, throughput, latency percentiles, and agent utilization charts.",
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkspaceShell>
      <WorkspacePage page="analytics" />
    </WorkspaceShell>
  );
}
