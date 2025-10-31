/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Extract version number from a line like "## [2.17.2] - 2025-10-30"
 * @param line Line to parse
 * @returns Version string or null if not found
 */
export function extractVersion(line: string): string | null {
    const match = line.match(/##\s*\[(\d+\.\d+\.\d+)\]/);
    return match ? match[1] : null;
}

/**
 * Find the previous version in the changelog content
 * @param text Full changelog text
 * @param currentVersion Current version to search from
 * @returns Previous version string or null if not found
 */
export function findPreviousVersion(text: string, currentVersion: string): string | null {
    const lines = text.split('\n');
    let foundCurrent = false;
    
    for (const line of lines) {
        const version = extractVersion(line);
        
        if (version === currentVersion) {
            foundCurrent = true;
            continue;
        }
        
        if (foundCurrent && version) {
            return version;
        }
    }
    
    return null;
}

/**
 * Validate if a string is a valid semantic version (X.Y.Z)
 * @param version Version string to validate
 * @returns true if valid, false otherwise
 */
export function isValidVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(version);
}