/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import { getTodayDate, isValidVersion } from './dateVersion';

/**
 * Extract version number from a line containing "vX.Y.Z"
 * @param lineText Line text to parse
 * @returns Version string or null if not found/invalid
 */
export function extractVersionFromLine(lineText: string): string | null {
    const trimmedText = lineText.trim();
    const versionMatch = trimmedText.match(/^v(\d+\.\d+\.\d+)$/);
    
    if (!versionMatch) {
        return null;
    }

    const version = versionMatch[1];
    
    // Validate version format
    if (!isValidVersion(version)) {
        return null;
    }

    return version;
}

/**
 * Generate the changelog version header line
 * @param version Version number (e.g., "2.17.3")
 * @returns Formatted version header (e.g., "## [2.17.3] - 2025-10-31")
 */
export function generateVersionHeader(version: string): string {
    const today = getTodayDate();
    return `## [${version}] - ${today}`;
}