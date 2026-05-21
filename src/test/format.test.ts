import * as assert from 'assert';
import { formatReference } from '../format';

suite('formatReference', () => {
    test('no selection returns bare path', () => {
        assert.strictEqual(formatReference('src/index.ts'), '@src/index.ts');
    });

    test('empty selection returns bare path', () => {
        assert.strictEqual(
            formatReference('src/index.ts', { startLine: 4, startCol: 0, endLine: 4, endCol: 0 }),
            '@src/index.ts'
        );
    });

    test('single-line selection returns L<n>', () => {
        assert.strictEqual(
            formatReference('src/index.ts', { startLine: 4, startCol: 2, endLine: 4, endCol: 10 }),
            '@src/index.ts#L5'
        );
    });

    test('multi-line selection returns L<a>-<b>', () => {
        assert.strictEqual(
            formatReference('src/index.ts', { startLine: 4, startCol: 0, endLine: 9, endCol: 5 }),
            '@src/index.ts#L5-10'
        );
    });

    test('selection ending at col 0 of next line trims end by one', () => {
        assert.strictEqual(
            formatReference('src/index.ts', { startLine: 4, startCol: 0, endLine: 9, endCol: 0 }),
            '@src/index.ts#L5-9'
        );
    });

    test('backslashes are normalized to forward slashes', () => {
        assert.strictEqual(formatReference('src\\utils\\helper.ts'), '@src/utils/helper.ts');
    });
});
