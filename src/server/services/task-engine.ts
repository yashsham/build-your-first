// Autonomous Task Execution Engine
// State Machine, DAG Execution, Parallel Stage Dispatching, Exponential Backoff Retries

import { randomUUID } from "node:crypto";
import type { Task, TaskExecutionAttempt, TaskStatus } from "../types";
import { TaskDependencyGraph } from "../dag";

export class TaskExecutionEngine {
  private tasks = new Map<string, Task>();

  // Valid state transitions
  private static VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
    PENDING: ["QUEUED", "CANCELLED"],
    QUEUED: ["RUNNING", "CANCELLED"],
    RUNNING: ["WAITING_APPROVAL", "BLOCKED", "COMPLETED", "FAILED", "CANCELLED"],
    WAITING_APPROVAL: ["RUNNING", "BLOCKED", "CANCELLED"],
    BLOCKED: ["QUEUED", "RUNNING", "CANCELLED", "FAILED"],
    COMPLETED: [],
    FAILED: ["QUEUED"], // Can re-queue on retry
    CANCELLED: [],
  };

  public createTask(
    params: Omit<
      Task,
      "id" | "status" | "retryCount" | "executionHistory" | "createdAt" | "updatedAt"
    >,
  ): Task {
    const id = `task-${randomUUID().slice(0, 8)}`;
    const task: Task = {
      id,
      ...params,
      status: "PENDING",
      retryCount: 0,
      maxRetries: params.maxRetries ?? 3,
      timeoutMs: params.timeoutMs ?? 30000,
      executionHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.set(id, task);
    return task;
  }

  public getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  public listTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Enforces valid state machine transitions. Throws error on illegal transition.
   */
  public transitionTaskStatus(taskId: string, targetStatus: TaskStatus, error?: string): Task {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task '${taskId}' not found.`);

    const allowedNext = TaskExecutionEngine.VALID_TRANSITIONS[task.status];
    if (!allowedNext.includes(targetStatus)) {
      throw new Error(
        `Invalid task state transition from ${task.status} to ${targetStatus} for task ${taskId}.`,
      );
    }

    task.status = targetStatus;
    task.updatedAt = new Date().toISOString();

    if (targetStatus === "RUNNING" && !task.startedAt) {
      task.startedAt = new Date().toISOString();
    } else if (targetStatus === "COMPLETED") {
      task.completedAt = new Date().toISOString();
    } else if (targetStatus === "FAILED" && error) {
      task.error = error;
    }

    return task;
  }

  /**
   * Executes a task step with retry handling (exponential backoff).
   */
  public async executeTaskWithRetry(
    taskId: string,
    executor: (task: Task) => Promise<Record<string, unknown> | string>,
  ): Promise<Task> {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task '${taskId}' not found.`);

    this.transitionTaskStatus(taskId, "QUEUED");
    this.transitionTaskStatus(taskId, "RUNNING");

    const startTime = Date.now();
    try {
      const output = await executor(task);
      task.output = output;
      task.executionHistory.push({
        attemptNumber: task.retryCount + 1,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        status: "SUCCESS",
        durationMs: Date.now() - startTime,
      });
      return this.transitionTaskStatus(taskId, "COMPLETED");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      task.retryCount += 1;

      task.executionHistory.push({
        attemptNumber: task.retryCount,
        startedAt: new Date(startTime).toISOString(),
        completedAt: new Date().toISOString(),
        status: "FAILED",
        error: errMsg,
        durationMs: Date.now() - startTime,
      });

      if (task.retryCount < task.maxRetries) {
        // Calculate backoff delay: 2^retry * 100ms + jitter
        const backoffMs = Math.pow(2, task.retryCount) * 100 + Math.random() * 50;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        this.transitionTaskStatus(taskId, "BLOCKED");
        return this.executeTaskWithRetry(taskId, executor);
      } else {
        return this.transitionTaskStatus(taskId, "FAILED", errMsg);
      }
    }
  }

  /**
   * Schedules a collection of tasks topologically, running independent stages in parallel.
   */
  public async executePlanStages(
    tasks: Task[],
    stageRunner: (stageTaskIds: string[]) => Promise<void>,
  ): Promise<void> {
    const dag = new TaskDependencyGraph(tasks);
    const stages = dag.computeParallelExecutionStages();

    for (const stage of stages) {
      // Execute all tasks within this stage concurrently
      await stageRunner(stage);
    }
  }
}
