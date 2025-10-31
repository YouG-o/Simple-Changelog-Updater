/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

/**
 * Extract the base repository URL from an [Unreleased] link
 * Example: "[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD"
 * Returns: "https://github.com/user/repo"
 */
export function extractRepoUrl(unreleasedLink: string): string | null {
    const match = unreleasedLink.match(/\[Unreleased\]:\s*(https?:\/\/[^\/]+\/[^\/]+\/[^\/]+)/);
    return match ? match[1] : null;
}

/**
 * Extract version number from a version comparison link
 * Example: "[2.17.2]: https://github.com/user/repo/compare/v2.17.1...v2.17.2"
 * Returns: "2.17.2"
 */
export function extractVersionFromLink(linkLine: string): string | null {
    const match = linkLine.match(/^\[(\d+\.\d+\.\d+)\]:/);
    return match ? match[1] : null;
}