# Copy Reference

A VS Code extension to copy file references in a format compatible with AI tools and code editors.

## Features

Copy a file or line reference to the clipboard in `@path/to/file` format:

- **File reference** — copy the path to any file: `@src/index.ts`
- **Line reference** — select a single line and copy: `@src/index.ts#L42`
- **Range reference** — select multiple lines and copy: `@src/index.ts#L10-20`
- **Multiple file references** — select multiple files in the Explorer and copy: `@src/file1.js @src/file2.js`

### How to use

**From the editor context menu** — right-click anywhere in an open file and select **Copy Reference**. If you have text selected, the line range is included automatically.

**From the explorer context menu** — select one or more files, right-click the selection, and select **Copy Reference (Rel)** or **Copy Reference (Abs)**. Multiple references are separated by spaces and use your configured format. With `markdown`, for example: `` `src/file1.js` `src/file2.js` ``. Explorer references contain paths only, even if a selected file is open with text selected in the editor.

**Keyboard shortcut** — with the cursor in an editor:

| Platform | Shortcut |
|----------|----------|
| Windows / Linux | `Ctrl+Alt+C` |
| macOS | `Cmd+Alt+C` |

A status bar message confirms what was copied.

## Settings

`copyReference.format` controls the copied reference format:

| Value | Example |
|-------|---------|
| `mention` | `@src/index.js#L10-20` |
| `plain` | `src/index.js:10-20` |
| `markdown` | `` `src/index.js:10-20` `` |

## Requirements

VS Code 1.120.0 or later.
