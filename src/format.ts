export interface Selection {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
}

export type ReferenceFormat = "mention" | "plain" | "markdown";

export function formatReference(
    relPath: string,
    sel?: Selection,
    format: ReferenceFormat = "mention",
): string {
    const normalized = relPath.replace(/\\/g, "/");
    let lineRange: string | undefined;

    if (sel && !(sel.startLine === sel.endLine && sel.startCol === sel.endCol)) {
        const start = sel.startLine + 1;

        // If the selection ends at column 0 of the next line, treat it as ending
        // on the previous line (matches triple-click / shift-down full-line selection).
        const effectiveEndLine = sel.endCol === 0 ? sel.endLine - 1 : sel.endLine;
        const end = effectiveEndLine + 1;

        lineRange = start === end ? `${start}` : `${start}-${end}`;
    }

    if (format === "mention") {
        return lineRange ? `@${normalized}#L${lineRange}` : `@${normalized}`;
    }

    const plain = lineRange ? `${normalized}:${lineRange}` : normalized;

    if (format === "markdown") {
        return `\`${plain}\``;
    }

    return plain;
}
