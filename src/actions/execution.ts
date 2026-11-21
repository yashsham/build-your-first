import { createServerFn } from "@tanstack/react-start";

export interface ServerTaskExecutionInput {
  prompt: string;
  modelId?: string;
  forceDemo?: boolean;
  autoFallback?: boolean;
  preferredProvider?: "groq" | "nvidia" | "auto" | "mock";
}

export const executePromptServerFn = createServerFn({ method: "POST" })
  .validator((data: ServerTaskExecutionInput) => data)
  .handler(async ({ data }) => {
    try {
      const { backend } = await import("../server/index");
      const result = await backend.models.executeCompletion(
        data.modelId || "llama-3.3-70b-versatile",
        data.prompt,
        {
          forceDemo: data.forceDemo,
          autoFallback: data.autoFallback,
          preferredProvider: data.preferredProvider,
        },
      );
      return { success: true, result };
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message || "Execution failed",
        result: null,
      };
    }
  });
