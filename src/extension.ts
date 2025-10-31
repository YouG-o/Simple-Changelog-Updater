/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import * as vscode from 'vscode';
import { ChangelogCompletionProvider } from './providers/completionProvider';
import { createVersionFromLine } from './commands/createVersion';

/**
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Simple Changelog Updater is now active');

    // Register completion provider for CHANGELOG.md files only
    const provider = vscode.languages.registerCompletionItemProvider(
        { language: 'markdown', pattern: '**/CHANGELOG.md' },
        new ChangelogCompletionProvider()
    );

    // Register manual command to create version from current line
    const createVersionCommand = vscode.commands.registerCommand(
        'simple-changelog-updater.createVersion',
        createVersionFromLine
    );

    context.subscriptions.push(provider, createVersionCommand);
}

/**
 * Called when the extension is deactivated
 */
export function deactivate() {}