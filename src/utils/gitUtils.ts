/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Extract GitHub repository URL from .git/config
 * @param changelogPath Path to the changelog file
 * @returns GitHub repository URL or null if not found
 */
export async function extractGitHubRepo(changelogPath: string): Promise<string | null> {
    try {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(changelogPath));
        if (!workspaceFolder) {
            return null;
        }
        
        const gitConfigPath = path.join(workspaceFolder.uri.fsPath, '.git', 'config');
        
        if (!fs.existsSync(gitConfigPath)) {
            return null;
        }
        
        const configContent = fs.readFileSync(gitConfigPath, 'utf-8');
        
        return parseGitHubUrl(configContent);
    } catch (error) {
        console.error('Error extracting GitHub repo:', error);
        return null;
    }
}

/**
 * Parse GitHub URL from git config content
 * @param configContent Content of .git/config file
 * @returns GitHub repository URL or null if not found
 */
export function parseGitHubUrl(configContent: string): string | null {
    // Match GitHub URLs (SSH or HTTPS)
    // Use \s to match whitespace/newline and stop at the first whitespace
    const sshMatch = configContent.match(/git@github\.com:([^/\s]+\/[^.\s]+)\.git/);
    const httpsMatch = configContent.match(/https:\/\/github\.com\/([^/\s]+\/[^.\s]+?)(\.git)?(?=\s|$)/);
    
    const repoPath = sshMatch?.[1] || httpsMatch?.[1];
    
    if (repoPath) {
        return `https://github.com/${repoPath.replace(/\.git$/, '')}`;
    }
    
    return null;
}