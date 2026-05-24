"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: "call" | "partial-call" | "result";
}

interface ToolLabel {
  action: string;
  path: string | null;
}

export function getToolLabel(toolName: string, args: Record<string, unknown>): ToolLabel {
  if (toolName === "str_replace_editor") {
    const command = args.command as string | undefined;
    const path = (args.path as string | undefined) ?? null;
    switch (command) {
      case "create":      return { action: "Creating", path };
      case "str_replace": return { action: "Editing",  path };
      case "insert":      return { action: "Editing",  path };
      case "view":        return { action: "Reading",  path };
    }
  }
  if (toolName === "file_manager") {
    const command = args.command as string | undefined;
    const path = (args.path as string | undefined) ?? null;
    const newPath = (args.new_path as string | undefined) ?? null;
    switch (command) {
      case "rename": return { action: "Renaming", path: newPath ?? path };
      case "delete": return { action: "Deleting", path };
    }
  }
  return { action: toolName, path: null };
}

function basename(path: string): string {
  return path.split("/").filter(Boolean).pop() ?? path;
}

export function ToolCallBadge({ toolName, args, state }: ToolCallBadgeProps) {
  const isDone = state === "result";
  const { action, path } = getToolLabel(toolName, args);
  const filename = path ? basename(path) : null;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" aria-hidden="true" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" aria-hidden="true" />
      )}
      <span className="text-neutral-700">
        {action}
        {filename && (
          <>
            {" "}
            <span
              className="font-mono font-medium text-neutral-900"
              title={path ?? undefined}
            >
              {filename}
            </span>
          </>
        )}
      </span>
    </div>
  );
}
