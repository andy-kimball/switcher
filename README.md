# Switcher

A VS Code extension for macOS that switches between windows of the same project's git worktrees using keyboard shortcuts.

## Worktree naming convention

Switcher expects worktree directories to follow this pattern:

```
/path/to/project       # worktree 1 (main)
/path/to/project.2     # worktree 2
/path/to/project.3     # worktree 3
```

Each worktree should be opened in its own VS Code window. Pressing Cmd+N (where N is 1-9) switches focus to the window whose title ends with the matching folder name.

## Install

Requires Node.js.

```bash
npm install
npx @vscode/vsce package
code --install-extension switcher-0.0.1.vsix
```

If `code` is not on your PATH, use the full path:

```bash
"/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code" \
  --install-extension switcher-0.0.1.vsix
```

## Keybindings

The extension does not ship default keybindings to avoid conflicts with VS Code's built-in Cmd+1-9 bindings (which switch editor groups). Add them manually to your user keybindings file. The bindings below are suggestions; use whatever keys you prefer:

**Cmd+K Cmd+S** > click the file icon (top right) to open `keybindings.json`, then add:

```json
[
  { "key": "cmd+1", "command": "switcher.switch", "args": 1 },
  { "key": "cmd+2", "command": "switcher.switch", "args": 2 },
  { "key": "cmd+3", "command": "switcher.switch", "args": 3 },
  { "key": "cmd+4", "command": "switcher.switch", "args": 4 },
  { "key": "cmd+5", "command": "switcher.switch", "args": 5 },
  { "key": "cmd+6", "command": "switcher.switch", "args": 6 },
  { "key": "cmd+7", "command": "switcher.switch", "args": 7 },
  { "key": "cmd+8", "command": "switcher.switch", "args": 8 },
  { "key": "cmd+9", "command": "switcher.switch", "args": 9 }
]
```

## macOS permissions

Switcher uses AppleScript via `osascript` to raise windows through System Events. macOS will prompt for accessibility permissions the first time you use it:

1. **"VS Code wants to control System Events"** - Click **OK** to allow. This lets the extension send AppleScript commands.
2. **Accessibility access** - If window switching doesn't work after allowing the first prompt, go to **System Settings > Privacy & Security > Accessibility** and ensure **Visual Studio Code** (or **Code Helper (Plugin)**) is enabled. You may need to toggle it off and on, or remove and re-add it, after updates.

Without these permissions, the `osascript` command will silently fail and nothing will happen when you press the shortcut.
