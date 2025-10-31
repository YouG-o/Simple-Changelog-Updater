/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { ChangelogCompletionProvider } from '../../providers/completionProvider';

suite('ChangelogCompletionProvider Test Suite', () => {
    
    let provider: ChangelogCompletionProvider;

    setup(() => {
        provider = new ChangelogCompletionProvider();
    });

    test('Should provide completion for valid version pattern', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: 'v1.2.3'
        });

        const position = new vscode.Position(0, 6);
        
        const completions = await provider.provideCompletionItems(document, position);
        
        assert.ok(completions, 'Should return completions');
        assert.strictEqual(completions.length, 1, 'Should return one completion');
        
        const item = completions[0];
        assert.strictEqual(item.label, 'Create version 1.2.3');
        assert.strictEqual(item.kind, vscode.CompletionItemKind.Snippet);
    });

    test('Should not provide completion for invalid version pattern', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: 'v1.2'
        });

        const position = new vscode.Position(0, 4);
        
        const completions = await provider.provideCompletionItems(document, position);
        
        assert.strictEqual(completions, undefined, 'Should not return completions for invalid version');
    });

    test('Should not provide completion in middle of line', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: 'Some text v1.2.3 more text'
        });

        const position = new vscode.Position(0, 16);
        
        const completions = await provider.provideCompletionItems(document, position);
        
        assert.strictEqual(completions, undefined, 'Should only trigger at start of line');
    });

    test('Completion should include today\'s date', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: 'v2.0.0'
        });

        const position = new vscode.Position(0, 6);
        
        const completions = await provider.provideCompletionItems(document, position);
        
        assert.ok(completions && completions.length > 0);
        
        const insertText = completions[0].insertText as vscode.SnippetString;
        const today = new Date().toISOString().split('T')[0];
        
        assert.ok(insertText.value.includes(today), 'Should include today\'s date');
        assert.ok(insertText.value.includes('## [2.0.0]'), 'Should include version');
    });
});