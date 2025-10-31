/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import * as assert from 'assert';
import { getTodayDate, extractVersion, findPreviousVersion, findUnreleasedLinkLine, isValidVersion } from '../../utils/dateVersion';

suite('dateVersion Utils Test Suite', () => {
    
    test('getTodayDate should return date in YYYY-MM-DD format', () => {
        const date = getTodayDate();
        assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
    });

    test('extractVersion should extract version from changelog line', () => {
        assert.strictEqual(extractVersion('## [2.17.3] - 2025-10-30'), '2.17.3');
        assert.strictEqual(extractVersion('## [1.0.0] - 2024-01-01'), '1.0.0');
        assert.strictEqual(extractVersion('##[10.20.30] - 2024-01-01'), '10.20.30'); // No space after ##
    });

    test('extractVersion should return null for invalid lines', () => {
        assert.strictEqual(extractVersion('## Unreleased'), null);
        assert.strictEqual(extractVersion('Some random text'), null);
        assert.strictEqual(extractVersion(''), null);
    });

    test('findPreviousVersion should find the version before current', () => {
        const changelog = `## [Unreleased]
## [2.17.3] - 2025-10-31
## [2.17.2] - 2025-10-30
## [2.17.1] - 2025-10-29`;

        assert.strictEqual(findPreviousVersion(changelog, '2.17.3'), '2.17.2');
        assert.strictEqual(findPreviousVersion(changelog, '2.17.2'), '2.17.1');
    });

    test('findPreviousVersion should return null if no previous version', () => {
        const changelog = `## [Unreleased]
## [1.0.0] - 2025-10-30`;

        assert.strictEqual(findPreviousVersion(changelog, '1.0.0'), null);
    });

    test('findPreviousVersion should return null if current version not found', () => {
        const changelog = `## [Unreleased]
## [2.17.2] - 2025-10-30`;

        assert.strictEqual(findPreviousVersion(changelog, '2.17.3'), null);
    });

    test('findUnreleasedLinkLine should find [Unreleased] link line number', () => {
        const changelog = `# Changelog

## [Unreleased]

## [2.17.2] - 2025-10-30

[Unreleased]: https://github.com/user/repo/compare/v2.17.2...HEAD
[2.17.2]: https://github.com/user/repo/compare/v2.17.1...v2.17.2`;

        assert.strictEqual(findUnreleasedLinkLine(changelog), 6);
    });

    test('findUnreleasedLinkLine should return -1 if not found', () => {
        const changelog = `# Changelog

## [2.17.2] - 2025-10-30`;

        assert.strictEqual(findUnreleasedLinkLine(changelog), -1);
    });

    test('isValidVersion should validate semantic versions', () => {
        assert.strictEqual(isValidVersion('1.2.3'), true);
        assert.strictEqual(isValidVersion('0.0.1'), true);
        assert.strictEqual(isValidVersion('10.20.30'), true);
        
        assert.strictEqual(isValidVersion('1.2'), false);
        assert.strictEqual(isValidVersion('1.2.3.4'), false);
        assert.strictEqual(isValidVersion('v1.2.3'), false);
        assert.strictEqual(isValidVersion('abc'), false);
    });
});