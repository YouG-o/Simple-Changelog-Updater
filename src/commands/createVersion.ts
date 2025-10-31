/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import * as vscode from 'vscode';
import { extractVersionFromLine, generateVersionHeader } from '../utils/versionCreator';

/**
 * Command to create a changelog version entry from the current line
 * Triggered by Cmd+Shift+V (or Ctrl+Shift+V on Windows/Linux)
 */
export async function createVersionFromLine() {
    const editor = vscode.window.activeTextEditor;
    
    if (!editor) {
        vscode.window.showErrorMessage('No active editor');
        return;
    }

    // Check if it's a CHANGELOG.md file
    if (!editor.document.fileName.endsWith('CHANGELOG.md')) {
        vscode.window.showErrorMessage('This command only works in CHANGELOG.md files');
        return;
    }

    const position = editor.selection.active;
    const line = editor.document.lineAt(position);
    const lineText = line.text;

    console.log('[Changelog Updater] Command triggered on line:', lineText);

    // Extract and validate version
    const version = extractVersionFromLine(lineText);
    
    if (!version) {
        vscode.window.showErrorMessage('Invalid format. Please write "vX.Y.Z" (e.g., v2.17.3) on the line and try again.');
        return;
    }

    console.log('[Changelog Updater] Version detected:', version);

    // Generate version header
    const versionEntry = generateVersionHeader(version);

    // Replace the current line with the version entry
    await editor.edit(editBuilder => {
        editBuilder.replace(line.range, versionEntry);
    });

    // Move cursor to the end of the line
    const newPosition = new vscode.Position(
        position.line,
        versionEntry.length
    );
    editor.selection = new vscode.Selection(newPosition, newPosition);

    console.log('[Changelog Updater] Version entry created successfully');
    vscode.window.showInformationMessage(`Created version ${version}`);

    // TODO: Update links in the future
}