import * as vscode from "vscode";
import { formatReference, ReferenceFormat, Selection } from "./format";

// Copy references using the supplied path resolver for relative or absolute paths.
async function copyFormattedReference(
    // URI clicked in the Explorer or editor context menu.
    uri: vscode.Uri | undefined,
    // All URIs selected in the Explorer, when invoked from there.
    selectedUris: vscode.Uri[] | undefined,
    getPath: (uri: vscode.Uri) => string,
) {
    // Prefer the clicked resource, then the first selected Explorer resource.
    let targetUri: vscode.Uri | undefined = uri ?? selectedUris?.[0];
    let sel: Selection | undefined;
    const editor = vscode.window.activeTextEditor;

    // Keyboard shortcuts may supply no URI, so fall back to the active editor.
    if (!targetUri) {
        if (!editor) {
            return;
        }
        targetUri = editor.document.uri;
    }

    // Explorer copy whole-file references. Only include the editor's
    // selection when copying its own document without an Explorer selection.
    const explorerUris = selectedUris?.length ? selectedUris : undefined;
    if (
        !explorerUris &&
        editor &&
        editor.document.uri.toString() === targetUri.toString()
    ) {
        const s = editor.selection;
        sel = {
            startLine: s.start.line,
            startCol: s.start.character,
            endLine: s.end.line,
            endCol: s.end.character,
        };
    }

    const format = vscode.workspace
        .getConfiguration("copyReference")
        .get<ReferenceFormat>("format", "mention");

    const ref = (explorerUris ?? [targetUri])
        .map((resource) => formatReference(getPath(resource), sel, format))
        .join(" ");

    await vscode.env.clipboard.writeText(ref);
    // Confirm message status bar
    vscode.window.setStatusBarMessage(`Copied: ${ref}`, 3000);
}

export function activate(context: vscode.ExtensionContext) {
    const copyReference = vscode.commands.registerCommand(
        "copy-reference.copyRel",
        // Explorer supplies the clicked URI and all selected URIs.
        async (uri?: vscode.Uri, selectedUris?: vscode.Uri[]) =>
            copyFormattedReference(uri, selectedUris, (targetUri) =>
                vscode.workspace.asRelativePath(targetUri, false),
            ),
    );

    const copyAbsolutePath = vscode.commands.registerCommand(
        "copy-reference.copyAbs",
        async (uri?: vscode.Uri, selectedUris?: vscode.Uri[]) =>
            copyFormattedReference(
                uri,
                selectedUris,
                (targetUri) => targetUri.fsPath,
            ),
    );

    context.subscriptions.push(copyReference, copyAbsolutePath);
}

export function deactivate() {}
