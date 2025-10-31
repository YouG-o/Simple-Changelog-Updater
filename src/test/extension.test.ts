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

suite('Extension Integration Test Suite', () => {
    
    vscode.window.showInformationMessage('Starting extension integration tests');

    test('Extension should be present', () => {
        const extension = vscode.extensions.getExtension('YouGo.simple-changelog-updater');
        assert.ok(extension, 'Extension should be installed');
    });

    test('Extension should activate', async () => {
        const extension = vscode.extensions.getExtension('YouGo.simple-changelog-updater');
        assert.ok(extension);
        
        await extension.activate();
        assert.strictEqual(extension.isActive, true, 'Extension should be active');
    });

    test('Completion provider should be registered for markdown files', async () => {
        // Create a temporary markdown file
        const document = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '# Test\n\nv1.0.0'
        });

        // Trigger completion
        const position = new vscode.Position(2, 6); // After "v1.0.0"
        const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
            'vscode.executeCompletionItemProvider',
            document.uri,
            position
        );

        // For now, just check that the command doesn't fail
        // We'll add more specific tests later
        assert.ok(completions !== undefined);
    });
});
