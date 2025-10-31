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
import { getTodayDate } from '../utils/dateVersion';

/**
 * Provides completion items for changelog version entries
 */
export class ChangelogCompletionProvider implements vscode.CompletionItemProvider {
    
    /**
     * Provide completion items for changelog version pattern
     */
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
    ): Promise<vscode.CompletionItem[] | undefined> {
        
        const line = document.lineAt(position);
        const linePrefix = line.text.substring(0, position.character);
        
        console.log('[Changelog Updater] Checking line:', linePrefix);
        
        // Extract and validate version
        const version = extractVersionFromLine(linePrefix);
        
        if (!version) {
            console.log('[Changelog Updater] No valid version pattern detected');
            return undefined;
        }

        console.log('[Changelog Updater] Version detected:', version);
        
        const today = getTodayDate();
        
        // Create completion item
        const completionItem = new vscode.CompletionItem(
            `Create version ${version}`,
            vscode.CompletionItemKind.Snippet
        );
        
        // Use the same generation logic as the command
        const versionHeader = generateVersionHeader(version);
        completionItem.insertText = new vscode.SnippetString(versionHeader);
        
        completionItem.detail = 'Create new changelog version entry';
        completionItem.documentation = new vscode.MarkdownString(
            `Creates version header: ${versionHeader}`
        );
        
        // Make it appear at the top of suggestions
        completionItem.sortText = '0';
        completionItem.preselect = true;
        
        console.log('[Changelog Updater] Completion item created');
        
        return [completionItem];
    }
}