# Copy Reference

A VS Code extension to copy file references in a format compatible with AI tools and code editors.

## Features

Copy a file or line reference to the clipboard in `@path/to/file` format:

- **File reference** — copy the path to any file: `@src/index.ts`
- **Line reference** — select a single line and copy: `@src/index.ts#L42`
- **Range reference** — select multiple lines and copy: `@src/index.ts#L10-20`

### How to use

**From the editor context menu** — right-click anywhere in an open file and select **Copy Reference**. If you have text selected, the line range is included automatically.

**From the explorer context menu** — right-click any file in the file explorer and select **Copy Reference**.

**Keyboard shortcut** — with the cursor in an editor:

| Platform | Shortcut |
|----------|----------|
| Windows / Linux | `Ctrl+Alt+C` |
| macOS | `Cmd+Alt+C` |

A status bar message confirms what was copied.

## Requirements

VS Code 1.120.0 or later.
