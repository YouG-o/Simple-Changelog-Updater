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
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

suite('createVersion Command Test Suite', () => {
    
    test('Command should create version entry from valid version line', async function() {
        // Increase timeout for this test as it involves file operations
        this.timeout(10000);

        // Create a temporary CHANGELOG.md file
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-test-'));
        const changelogPath = path.join(tmpDir, 'CHANGELOG.md');
        const content = '# Changelog\n\n## [Unreleased]\n\nv2.17.3\n\n## [2.17.2] - 2025-10-30';
        
        fs.writeFileSync(changelogPath, content);

        try {
            // Open the file
            const document = await vscode.workspace.openTextDocument(changelogPath);
            const editor = await vscode.window.showTextDocument(document);
            
            // Wait a bit for the editor to be fully ready
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Position cursor on the "v2.17.3" line (line 4)
            const position = new vscode.Position(4, 0);
            editor.selection = new vscode.Selection(position, position);

            // Execute the command
            await vscode.commands.executeCommand('simple-changelog-updater.createVersion');

            // Wait for the command to complete
            await new Promise(resolve => setTimeout(resolve, 200));

            // Check that the line was replaced
            const updatedText = editor.document.getText();
            const today = new Date().toISOString().split('T')[0];
            
            assert.ok(updatedText.includes(`## [2.17.3] - ${today}`), 'Should create version header with today\'s date');
            assert.ok(!updatedText.includes('v2.17.3\n'), 'Should replace original "v2.17.3" line');
        } finally {
            // Cleanup
            fs.unlinkSync(changelogPath);
            fs.rmdirSync(tmpDir);
        }
    });

    test('Command should show error for invalid version format', async () => {
        const document = await vscode.workspace.openTextDocument({
            language: 'markdown',
            content: '# Changelog\n\nv1.2\n'
        });

        const editor = await vscode.window.showTextDocument(document);
        const position = new vscode.Position(2, 0);
        editor.selection = new vscode.Selection(position, position);

        await vscode.commands.executeCommand('simple-changelog-updater.createVersion');

        // Wait a bit for potential changes
        await new Promise(resolve => setTimeout(resolve, 100));

        const updatedText = editor.document.getText();
        assert.ok(updatedText.includes('v1.2'), 'Should not modify document for invalid version');
    });

    test('Command should show error if not in CHANGELOG.md', async function() {
        this.timeout(10000);

        // Create a temporary regular markdown file
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'changelog-test-'));
        const mdPath = path.join(tmpDir, 'README.md');
        
        fs.writeFileSync(mdPath, 'v1.0.0');

        try {
            const document = await vscode.workspace.openTextDocument(mdPath);
            const editor = await vscode.window.showTextDocument(document);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const position = new vscode.Position(0, 0);
            editor.selection = new vscode.Selection(position, position);

            await vscode.commands.executeCommand('simple-changelog-updater.createVersion');

            await new Promise(resolve => setTimeout(resolve, 100));

            const updatedText = editor.document.getText();
            assert.strictEqual(updatedText, 'v1.0.0', 'Should not modify non-CHANGELOG files');
        } finally {
            fs.unlinkSync(mdPath);
            fs.rmdirSync(tmpDir);
        }
    });
});