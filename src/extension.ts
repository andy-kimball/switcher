import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { exec } from "child_process";

// Worktree naming convention:
//   /path/to/project       → worktree 1 (main)
//   /path/to/project.2     → worktree 2
//   /path/to/project.3     → worktree 3

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("switcher.switch", (n: number) =>
      switchToWorktree(n)
    )
  );
}

export function deactivate(): void {}

function switchToWorktree(n: number): void {
  const wsPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!wsPath) {
    return;
  }

  const folder = path.basename(wsPath);
  const match = folder.match(/^(.+)\.\d+$/);
  const baseName = match ? match[1] : folder;
  const targetFolder = n === 1 ? baseName : `${baseName}.${n}`;

  if (targetFolder === folder) {
    return;
  }

  const processName = getProcessName();
  const escaped = escapeAppleScript(targetFolder);

  // Window titles end with the workspace folder name, so "ends with"
  // cleanly distinguishes "roachmgr" from "roachmgr.2".
  const script =
    `tell application "System Events"\n` +
    `  tell process "${processName}"\n` +
    `    repeat with w in every window\n` +
    `      if name of w ends with "${escaped}" then\n` +
    `        perform action "AXRaise" of w\n` +
    `        set frontmost to true\n` +
    `        return\n` +
    `      end if\n` +
    `    end repeat\n` +
    `  end tell\n` +
    `end tell`;

  exec(`osascript -e '${escapeShell(script)}'`);
}

// The extension host runs in "Code Helper (Plugin)", not the main process.
// Find the main binary name from the top-level .app bundle's Contents/MacOS/.
function getProcessName(): string {
  const m = process.execPath.match(/^(.+?\.app)\//);
  if (m) {
    try {
      const entries = fs.readdirSync(path.join(m[1], "Contents", "MacOS"));
      if (entries.length > 0) {
        return entries[0];
      }
    } catch {}
  }
  return "Electron";
}

function escapeAppleScript(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escapeShell(str: string): string {
  return str.replace(/'/g, "'\\''");
}
