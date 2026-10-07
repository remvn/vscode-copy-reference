import * as assert from "assert";
import * as vscode from "vscode";
import { formatReference, ReferenceFormat } from "../format";

suite("Extension Test Suite", () => {
    let previousFormat: string | undefined;
    let previousClipboard: string;

    suiteSetup(async () => {
        await vscode.extensions
            .getExtension("remvn.vscode-copy-reference")!
            .activate();
    });

    setup(async () => {
        previousFormat = vscode.workspace
            .getConfiguration("copyReference")
            .inspect<string>("format")?.globalValue;
        previousClipboard = await vscode.env.clipboard.readText();
    });

    teardown(async () => {
        await vscode.workspace
            .getConfiguration("copyReference")
            .update(
                "format",
                previousFormat,
                vscode.ConfigurationTarget.Global,
            );
        await vscode.env.clipboard.writeText(previousClipboard);
    });

    for (const format of [
        "mention",
        "plain",
        "markdown",
    ] as ReferenceFormat[]) {
        test(`Copies multiple Explorer references in ${format} format`, async () => {
            await vscode.workspace
                .getConfiguration("copyReference")
                .update("format", format, vscode.ConfigurationTarget.Global);
            const uris = [
                vscode.Uri.file("/copy-reference/src/file1.js"),
                vscode.Uri.file("/copy-reference/src/file2.js"),
            ];

            for (const command of [
                "copy-reference.copyRel",
                "copy-reference.copyAbs",
            ]) {
                await vscode.commands.executeCommand(command, uris[1], uris);
                const expected = uris
                    .map((uri) =>
                        formatReference(
                            command.endsWith("copyRel")
                                ? vscode.workspace.asRelativePath(uri, false)
                                : uri.fsPath,
                            undefined,
                            format,
                        ),
                    )
                    .join(" ");
                assert.strictEqual(
                    await vscode.env.clipboard.readText(),
                    expected,
                );
            }
        });
    }

    test("Explorer references omit editor selections; editor commands retain them", async () => {
        await vscode.workspace
            .getConfiguration("copyReference")
            .update("format", "mention", vscode.ConfigurationTarget.Global);
        const document = await vscode.workspace.openTextDocument({
            content: "first line\nsecond line\n",
        });
        const editor = await vscode.window.showTextDocument(document);
        editor.selection = new vscode.Selection(0, 0, 1, 5);
        const path = vscode.workspace.asRelativePath(document.uri, false);

        await vscode.commands.executeCommand(
            "copy-reference.copyRel",
            document.uri,
            [document.uri],
        );
        assert.strictEqual(await vscode.env.clipboard.readText(), `@${path}`);

        await vscode.commands.executeCommand("copy-reference.copyRel");
        assert.strictEqual(
            await vscode.env.clipboard.readText(),
            `@${path}#L1-2`,
        );
        await vscode.commands.executeCommand(
            "workbench.action.revertAndCloseActiveEditor",
        );
    });
});
