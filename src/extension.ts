import * as vscode from 'vscode';
import { formatReference, Selection } from './format';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'copy-reference.copy',
        async (uri?: vscode.Uri) => {
            let targetUri: vscode.Uri | undefined = uri;
            let sel: Selection | undefined;

            if (!targetUri) {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    return;
                }
                targetUri = editor.document.uri;
                const s = editor.selection;
                sel = {
                    startLine: s.start.line,
                    startCol: s.start.character,
                    endLine: s.end.line,
                    endCol: s.end.character,
                };
            }

            const relPath = vscode.workspace.asRelativePath(targetUri, false);
            const ref = formatReference(relPath, sel);

            await vscode.env.clipboard.writeText(ref);
            vscode.window.setStatusBarMessage(`Copied: ${ref}`, 3000);
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
