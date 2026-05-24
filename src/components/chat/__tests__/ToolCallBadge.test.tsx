import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCallBadge, getToolLabel } from "../ToolCallBadge";

// --- getToolLabel unit tests ---

describe("getToolLabel", () => {
  describe("str_replace_editor", () => {
    it("returns Creating for create command", () => {
      expect(getToolLabel("str_replace_editor", { command: "create", path: "/App.jsx" }))
        .toEqual({ action: "Creating", path: "/App.jsx" });
    });

    it("returns Editing for str_replace command", () => {
      expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "/components/Card.jsx" }))
        .toEqual({ action: "Editing", path: "/components/Card.jsx" });
    });

    it("returns Editing for insert command", () => {
      expect(getToolLabel("str_replace_editor", { command: "insert", path: "/utils.ts" }))
        .toEqual({ action: "Editing", path: "/utils.ts" });
    });

    it("returns Reading for view command", () => {
      expect(getToolLabel("str_replace_editor", { command: "view", path: "/index.tsx" }))
        .toEqual({ action: "Reading", path: "/index.tsx" });
    });

    it("returns toolName and null path for unknown command", () => {
      expect(getToolLabel("str_replace_editor", { command: "unknown" }))
        .toEqual({ action: "str_replace_editor", path: null });
    });
  });

  describe("file_manager", () => {
    it("returns Renaming with new_path for rename command", () => {
      expect(getToolLabel("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" }))
        .toEqual({ action: "Renaming", path: "/new.jsx" });
    });

    it("falls back to path if new_path is missing for rename", () => {
      expect(getToolLabel("file_manager", { command: "rename", path: "/old.jsx" }))
        .toEqual({ action: "Renaming", path: "/old.jsx" });
    });

    it("returns Deleting for delete command", () => {
      expect(getToolLabel("file_manager", { command: "delete", path: "/utils.ts" }))
        .toEqual({ action: "Deleting", path: "/utils.ts" });
    });
  });

  it("returns toolName and null path for an unknown tool", () => {
    expect(getToolLabel("some_other_tool", {}))
      .toEqual({ action: "some_other_tool", path: null });
  });
});

// --- ToolCallBadge rendering tests ---

describe("ToolCallBadge", () => {
  it("shows Creating and filename for str_replace_editor create", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/App.jsx" }}
        state="result"
      />
    );
    expect(screen.getByText("Creating")).toBeTruthy();
    expect(screen.getByText("App.jsx")).toBeTruthy();
  });

  it("shows Editing and filename for str_replace_editor str_replace", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "str_replace", path: "/components/Card.jsx" }}
        state="result"
      />
    );
    expect(screen.getByText("Editing")).toBeTruthy();
    expect(screen.getByText("Card.jsx")).toBeTruthy();
  });

  it("shows Deleting and filename for file_manager delete", () => {
    render(
      <ToolCallBadge
        toolName="file_manager"
        args={{ command: "delete", path: "/old.jsx" }}
        state="result"
      />
    );
    expect(screen.getByText("Deleting")).toBeTruthy();
    expect(screen.getByText("old.jsx")).toBeTruthy();
  });

  it("shows Renaming and the new filename for file_manager rename", () => {
    render(
      <ToolCallBadge
        toolName="file_manager"
        args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
        state="result"
      />
    );
    expect(screen.getByText("Renaming")).toBeTruthy();
    expect(screen.getByText("new.jsx")).toBeTruthy();
  });

  it("sets title attribute to full path on the filename span", () => {
    render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/components/Button.tsx" }}
        state="result"
      />
    );
    expect(screen.getByText("Button.tsx").getAttribute("title")).toBe("/components/Button.tsx");
  });

  it("shows a spinner when state is not result", () => {
    const { container } = render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/App.jsx" }}
        state="call"
      />
    );
    expect(container.querySelector(".animate-spin")).toBeTruthy();
  });

  it("does not show a spinner when state is result", () => {
    const { container } = render(
      <ToolCallBadge
        toolName="str_replace_editor"
        args={{ command: "create", path: "/App.jsx" }}
        state="result"
      />
    );
    expect(container.querySelector(".animate-spin")).toBeNull();
  });

  it("renders the action label without a filename when path is missing", () => {
    render(
      <ToolCallBadge
        toolName="some_other_tool"
        args={{}}
        state="result"
      />
    );
    expect(screen.getByText("some_other_tool")).toBeTruthy();
  });
});
