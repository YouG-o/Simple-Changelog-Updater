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
import { findUnreleasedLinkLine, findPreviousVersion } from '../utils/dateVersion';
import { extractRepoUrl } from '../utils/linkUpdater';

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

    // Get full document text BEFORE any modifications
    const fullText = editor.document.getText();

    // Find [Unreleased] link line BEFORE modifications
    const unreleasedLineNum = findUnreleasedLinkLine(fullText);
    console.log('[Changelog Updater] [Unreleased] link found at line:', unreleasedLineNum);

    // Prepare all data BEFORE editing
    const versionEntry = generateVersionHeader(version);
    let repoUrl: string | null = null;
    let previousVersion: string | null = null;
    let newUnreleasedLink: string | null = null;
    let versionLink: string | null = null;

    if (unreleasedLineNum !== -1) {
        const unreleasedLine = editor.document.lineAt(unreleasedLineNum);
        console.log('[Changelog Updater] [Unreleased] line content:', unreleasedLine.text);
        
        repoUrl = extractRepoUrl(unreleasedLine.text);
        console.log('[Changelog Updater] Extracted repo URL:', repoUrl);
        
        if (repoUrl) {
            newUnreleasedLink = `[Unreleased]: ${repoUrl}/compare/v${version}...HEAD`;
            console.log('[Changelog Updater] New [Unreleased] link:', newUnreleasedLink);
            
            previousVersion = findPreviousVersion(fullText, version);
            console.log('[Changelog Updater] Previous version:', previousVersion);
            
            if (previousVersion) {
                versionLink = `[${version}]: ${repoUrl}/compare/v${previousVersion}...v${version}`;
                console.log('[Changelog Updater] New version link:', versionLink);
            }
        }
    }

    // Now perform all edits in a single transaction
    const success = await editor.edit(editBuilder => {
        // 1. Replace the version line
        editBuilder.replace(line.range, versionEntry);
        console.log('[Changelog Updater] Replaced version line');

        // 2. Update [Unreleased] link if prepared
        if (unreleasedLineNum !== -1 && newUnreleasedLink) {
            const unreleasedLine = editor.document.lineAt(unreleasedLineNum);
            editBuilder.replace(unreleasedLine.range, newUnreleasedLink);
            console.log('[Changelog Updater] Replaced [Unreleased] link');

            // 3. Add new version link after [Unreleased] if prepared
            if (versionLink) {
                const insertPosition = new vscode.Position(unreleasedLineNum + 1, 0);
                editBuilder.insert(insertPosition, versionLink + '\n');
                console.log('[Changelog Updater] Inserted version link');
            }
        }
    });

    if (!success) {
        console.error('[Changelog Updater] Edit failed');
        vscode.window.showErrorMessage('Failed to update changelog');
        return;
    }

    // Move cursor to the end of the version line
    const newPosition = new vscode.Position(
        position.line,
        versionEntry.length
    );
    editor.selection = new vscode.Selection(newPosition, newPosition);

    console.log('[Changelog Updater] Version entry created successfully');
    
    if (unreleasedLineNum !== -1 && newUnreleasedLink) {
        vscode.window.showInformationMessage(`Created version ${version} and updated links`);
    } else {
        vscode.window.showInformationMessage(`Created version ${version}`);
    }
}