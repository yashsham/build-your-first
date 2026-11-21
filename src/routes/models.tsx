import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/workspace-shell";
import { WorkspacePage } from "@/components/workspace-pages";
import { workspaceMeta } from "@/lib/workspace-data";

export const Route = createFileRoute("/models")({
  head: () => ({
    meta: workspaceMeta(
      "Model Configuration",
      "Groq, NVIDIA NIM, and multi-model routing policies without credential exposure.",
    ),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <WorkspaceShell>
      <WorkspacePage page="models" />
    </WorkspaceShell>
  );
}
