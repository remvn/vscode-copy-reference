import * as assert from "assert";
import { formatReference } from "../format";

suite("formatReference", () => {
    test("no selection returns bare path", () => {
        assert.strictEqual(formatReference("src/index.ts"), "@src/index.ts");
    });

    test("empty selection returns bare path", () => {
        assert.strictEqual(
            formatReference("src/index.ts", {
                startLine: 4,
                startCol: 0,
                endLine: 4,
                endCol: 0,
            }),
            "@src/index.ts",
        );
    });

    test("single-line selection returns L<n>", () => {
        assert.strictEqual(
            formatReference("src/index.ts", {
                startLine: 4,
                startCol: 2,
                endLine: 4,
                endCol: 10,
            }),
            "@src/index.ts#L5",
        );
    });

    test("multi-line selection returns L<a>-<b>", () => {
        assert.strictEqual(
            formatReference("src/index.ts", {
                startLine: 4,
                startCol: 0,
                endLine: 9,
                endCol: 5,
            }),
            "@src/index.ts#L5-10",
        );
    });

    test("selection ending at col 0 of next line trims end by one", () => {
        assert.strictEqual(
            formatReference("src/index.ts", {
                startLine: 4,
                startCol: 0,
                endLine: 9,
                endCol: 0,
            }),
            "@src/index.ts#L5-9",
        );
    });

    test("backslashes are normalized to forward slashes", () => {
        assert.strictEqual(
            formatReference("src\\utils\\helper.ts"),
            "@src/utils/helper.ts",
        );
    });

    test("plain format returns path without mention prefix", () => {
        assert.strictEqual(
            formatReference("src/index.ts", undefined, "plain"),
            "src/index.ts",
        );
    });

    test("plain format returns colon line reference", () => {
        assert.strictEqual(
            formatReference(
                "src/index.ts",
                {
                    startLine: 4,
                    startCol: 2,
                    endLine: 4,
                    endCol: 10,
                },
                "plain",
            ),
            "src/index.ts:5",
        );
    });

    test("plain format returns colon line range", () => {
        assert.strictEqual(
            formatReference(
                "src/index.ts",
                {
                    startLine: 4,
                    startCol: 0,
                    endLine: 9,
                    endCol: 5,
                },
                "plain",
            ),
            "src/index.ts:5-10",
        );
    });

    test("markdown format wraps path in backticks", () => {
        assert.strictEqual(
            formatReference("src/index.ts", undefined, "markdown"),
            "`src/index.ts`",
        );
    });

    test("markdown format wraps line reference in backticks", () => {
        assert.strictEqual(
            formatReference(
                "src/index.ts",
                {
                    startLine: 4,
                    startCol: 2,
                    endLine: 4,
                    endCol: 10,
                },
                "markdown",
            ),
            "`src/index.ts:5`",
        );
    });

    test("markdown format wraps line range in backticks", () => {
        assert.strictEqual(
            formatReference(
                "src/index.ts",
                {
                    startLine: 4,
                    startCol: 0,
                    endLine: 9,
                    endCol: 5,
                },
                "markdown",
            ),
            "`src/index.ts:5-10`",
        );
    });
});
