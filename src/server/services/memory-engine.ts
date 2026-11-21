// Persistent Memory Engine (Markdown-First)
// Atomic Mutex-Guarded File Operations, Regex Secret Redaction & Provenance Tracking

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export interface MemoryProvenanceEntry {
  timestamp: string;
  authorAgentId: string;
  rationale: string;
  section?: string;
  relatedTaskId?: string;
}

export class PersistentMemoryEngine {
  private baseDir: string;
  private writeLocks = new Map<string, Promise<void>>();

  constructor(baseDir = "data/workspaces") {
    this.baseDir = baseDir;
  }

  private SECRET_PATTERNS: RegExp[] = [
    /\b(sk|pk|rk|tvly|ak|ghp|gho|xox[abp])[-_][A-Za-z0-9_-]{12,}\b/g,
    /\bAKIA[0-9A-Z]{16}\b/g,
    /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
    /\b(password|passwd|secret|api[_-]?key|token)\s*[:=]\s*\S+/gi,
  ];

  public redactSecrets(content: string): string {
    let clean = content;
    for (const pattern of this.SECRET_PATTERNS) {
      clean = clean.replace(pattern, (match) => `«REDACTED_${match.length}_CHARS»`);
    }
    return clean;
  }

  public getAgentMemoryPath(agentId: string): string {
    const cleanId = agentId.replace(/[^a-zA-Z0-9_-]/g, "");
    return join(this.baseDir, cleanId, "MEMORY.md");
  }

  public getRoomContextPath(roomId: string): string {
    const cleanId = roomId.replace(/[^a-zA-Z0-9_-]/g, "");
    return join("data/rooms", cleanId, "CONTEXT.md");
  }

  /**
   * Reads raw Markdown content from an agent or room memory file.
   */
  public readMemory(filePath: string): string {
    if (!existsSync(filePath)) return "";
    return readFileSync(filePath, "utf-8");
  }

  /**
   * Reads a bounded slice of memory formatted for prompt injection (first maxLines / maxBytes).
   */
  public readMemoryForPrompt(
    filePath: string,
    maxLines = 200,
    maxBytes = 16384,
  ): { content: string; isTruncated: boolean } {
    const full = this.readMemory(filePath);
    if (!full) return { content: "", isTruncated: false };

    const lines = full.split("\n").slice(0, maxLines);
    let slice = lines.join("\n");
    let isTruncated = lines.length < full.split("\n").length;

    if (Buffer.byteLength(slice, "utf-8") > maxBytes) {
      slice = Buffer.from(slice, "utf-8").subarray(0, maxBytes).toString("utf-8");
      isTruncated = true;
    }

    return { content: slice.trim(), isTruncated };
  }

  /**
   * Mutex-guarded atomic write. Redacts sensitive credentials, writes to a .tmp file,
   * then renames atomically. Prevents partial corruption under concurrent agent writes.
   */
  public async writeMemory(filePath: string, rawContent: string): Promise<string> {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Wait on existing lock for this file
    const currentLock = this.writeLocks.get(filePath) || Promise.resolve();
    let releaseLock: () => void = () => {};
    const newLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.writeLocks.set(filePath, newLock);

    await currentLock;

    try {
      const sanitized = this.redactSecrets(rawContent);
      const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
      writeFileSync(tmpPath, sanitized, "utf-8");
      renameSync(tmpPath, filePath);
      return sanitized;
    } finally {
      releaseLock();
      this.writeLocks.delete(filePath);
    }
  }

  /**
   * Appends a memory note with timestamp and provenance metadata.
   */
  public async appendMemoryNote(
    filePath: string,
    note: string,
    provenance: MemoryProvenanceEntry,
  ): Promise<string> {
    const dateStr = provenance.timestamp.slice(0, 10);
    const line = `- ${note.trim()} _(Added by @${provenance.authorAgentId} on ${dateStr} - Rationale: ${provenance.rationale})_`;
    const existing = this.readMemory(filePath).trimEnd();

    let newContent = "";
    if (provenance.section) {
      const sectionHeader = `## ${provenance.section.trim()}`;
      if (existing.includes(sectionHeader)) {
        newContent = existing.replace(sectionHeader, `${sectionHeader}\n${line}`);
      } else {
        newContent = `${existing}\n\n${sectionHeader}\n${line}\n`;
      }
    } else {
      newContent = `${existing}\n${line}\n`;
    }

    return this.writeMemory(filePath, newContent.trim());
  }
}
