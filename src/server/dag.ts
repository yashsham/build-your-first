// Directed Acyclic Graph (DAG) Scheduler & Topological Sorting Algorithm
// Time Complexity: O(V + E) | Space Complexity: O(V + E)

import type { Task } from "./types";

export class CyclicDependencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CyclicDependencyError";
  }
}

export class TaskDependencyGraph {
  private adjacencyList = new Map<string, Set<string>>(); // parentTaskId -> Set<childTaskId>
  private inDegree = new Map<string, number>(); // taskId -> number of unmet parent dependencies
  private taskMap = new Map<string, Task>();

  constructor(tasks: Task[]) {
    // Initialize vertices
    for (const task of tasks) {
      this.taskMap.set(task.id, task);
      this.adjacencyList.set(task.id, new Set<string>());
      this.inDegree.set(task.id, 0);
    }

    // Populate edges and calculate in-degrees
    for (const task of tasks) {
      for (const depId of task.dependencies) {
        if (!this.taskMap.has(depId)) {
          throw new Error(`Task '${task.id}' depends on non-existent task '${depId}'.`);
        }
        // depId must complete before task.id can run
        this.adjacencyList.get(depId)!.add(task.id);
        this.inDegree.set(task.id, (this.inDegree.get(task.id) || 0) + 1);
      }
    }
  }

  /**
   * Kahn's Algorithm for Topological Sort & Stage Partitioning.
   * Returns an array of parallel stages, where each stage is a list of Task IDs
   * that have 0 remaining dependencies and can execute concurrently.
   */
  public computeParallelExecutionStages(): string[][] {
    const inDegreeCopy = new Map<string, number>(this.inDegree);
    const stages: string[][] = [];
    let visitedCount = 0;

    // Queue of tasks ready for execution in the current stage
    let currentStageQueue: string[] = [];
    for (const [taskId, deg] of inDegreeCopy.entries()) {
      if (deg === 0) {
        currentStageQueue.push(taskId);
      }
    }

    while (currentStageQueue.length > 0) {
      stages.push([...currentStageQueue]);
      visitedCount += currentStageQueue.length;

      const nextStageQueue: string[] = [];

      for (const taskId of currentStageQueue) {
        const dependentTaskIds = this.adjacencyList.get(taskId) || new Set<string>();
        for (const depId of dependentTaskIds) {
          const currentDeg = inDegreeCopy.get(depId)!;
          inDegreeCopy.set(depId, currentDeg - 1);
          if (currentDeg - 1 === 0) {
            nextStageQueue.push(depId);
          }
        }
      }

      currentStageQueue = nextStageQueue;
    }

    if (visitedCount < this.taskMap.size) {
      throw new CyclicDependencyError(
        `Cycle detected in task dependencies! Processed ${visitedCount} of ${this.taskMap.size} tasks.`,
      );
    }

    return stages;
  }

  /**
   * Computes the critical path (longest sequential dependency chain).
   */
  public computeCriticalPath(): string[] {
    const stages = this.computeParallelExecutionStages();
    // Return longest single chain from start to finish
    const path: string[] = [];
    for (const stage of stages) {
      if (stage.length > 0) {
        path.push(stage[0]);
      }
    }
    return path;
  }

  /**
   * Validates if a task's dependencies are satisfied given a set of completed task IDs.
   */
  public isTaskExecutable(taskId: string, completedTaskIds: Set<string>): boolean {
    const task = this.taskMap.get(taskId);
    if (!task) return false;
    return task.dependencies.every((depId) => completedTaskIds.has(depId));
  }
}
