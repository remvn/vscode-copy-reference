import * as vscode from "vscode";
import { formatReference, ReferenceFormat, Selection } from "./format";

async function copyFormattedReference(
    uri: vscode.Uri | undefined,
    getPath: (uri: vscode.Uri) => string,
) {
    let targetUri: vscode.Uri | undefined = uri;
    let sel: Selection | undefined;
    const editor = vscode.window.activeTextEditor;

    if (!targetUri) {
        if (!editor) {
            return;
        }
        targetUri = editor.document.uri;
    }

    if (editor && editor.document.uri.toString() === targetUri.toString()) {
        const s = editor.selection;
        sel = {
            startLine: s.start.line,
            startCol: s.start.character,
            endLine: s.end.line,
            endCol: s.end.character,
        };
    }

    const path = getPath(targetUri);
    const format = vscode.workspace
        .getConfiguration("copyReference")
        .get<ReferenceFormat>("format", "mention");
    const ref = formatReference(path, sel, format);

    await vscode.env.clipboard.writeText(ref);
    vscode.window.setStatusBarMessage(`Copied: ${ref}`, 3000);
}

export function activate(context: vscode.ExtensionContext) {
    const copyReference = vscode.commands.registerCommand(
        "copy-reference.copyRel",
        // uri is provided when invoked from the context menu, undefined when invoked via keyboard shortcut
        async (uri?: vscode.Uri) =>
            copyFormattedReference(uri, (targetUri) =>
                vscode.workspace.asRelativePath(targetUri, false),
            ),
    );

    const copyAbsolutePath = vscode.commands.registerCommand(
        "copy-reference.copyAbs",
        async (uri?: vscode.Uri) =>
            copyFormattedReference(uri, (targetUri) => targetUri.fsPath),
    );

    context.subscriptions.push(copyReference, copyAbsolutePath);
}

export function deactivate() {}
