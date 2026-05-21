export interface Selection {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
}

export function formatReference(relPath: string, sel?: Selection): string {
    const normalized = relPath.replace(/\\/g, "/");

    if (
        !sel ||
        (sel.startLine === sel.endLine && sel.startCol === sel.endCol)
    ) {
        return `@${normalized}`;
    }

    const start = sel.startLine + 1;

    // If the selection ends at column 0 of the next line, treat it as ending
    // on the previous line (matches triple-click / shift-down full-line selection).
    const effectiveEndLine = sel.endCol === 0 ? sel.endLine - 1 : sel.endLine;
    const end = effectiveEndLine + 1;

    if (start === end) {
        return `@${normalized}#L${start}`;
    }

    return `@${normalized}#L${start}-${end}`;
}
