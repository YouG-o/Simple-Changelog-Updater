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
    return new Date().toISOString().split('T')[0];
}

/**
 * Extract version number from a changelog version line
 * Example: "## [2.17.3] - 2025-10-30" -> "2.17.3"
 */
export function extractVersion(line: string): string | null {
    const match = line.match(/##\s*\[(\d+\.\d+\.\d+)\]/);
    return match ? match[1] : null;
}

/**
 * Find the previous version before the current one in the changelog
 * @param text Full changelog content
 * @param currentVersion Current version to find the previous version of
 * @returns Previous version number or null if not found
 */
export function findPreviousVersion(text: string, currentVersion: string): string | null {
    const lines = text.split('\n');
    let foundCurrent = false;

    for (const line of lines) {
        const version = extractVersion(line);
        if (!version) continue;

        if (version === currentVersion) {
            foundCurrent = true;
            continue;
        }

        // Return the first version found after we've seen the current version
        if (foundCurrent) {
            return version;
        }
    }

    return null;
}

/**
 * Find the line number of the [Unreleased] link
 * @param text Full changelog content
 * @returns Line number (0-indexed) or -1 if not found
 */
export function findUnreleasedLinkLine(text: string): number {
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('[Unreleased]:')) {
            return i;
        }
    }
    
    return -1;
}

/**
 * Validate a version string against semantic versioning format
 * @param version Version string to validate (e.g., "2.17.3")
 * @returns true if valid semantic version
 */
export function isValidVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+$/.test(version);
}