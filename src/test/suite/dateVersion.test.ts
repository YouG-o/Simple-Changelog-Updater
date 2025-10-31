/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */


import * as assert from 'assert';
import { getTodayDate, extractVersion, findPreviousVersion, isValidVersion } from '../../utils/dateVersion';

suite('dateVersion Utils Test Suite', () => {
    
    test('getTodayDate should return date in YYYY-MM-DD format', () => {
        const date = getTodayDate();
        
        // Test format with regex
        assert.match(date, /^\d{4}-\d{2}-\d{2}$/);
        
        // Test that it's a valid date
        const parsed = new Date(date);
        assert.ok(!isNaN(parsed.getTime()));
    });

    test('extractVersion should extract version from changelog line', () => {
        assert.strictEqual(extractVersion('## [2.17.2] - 2025-10-30'), '2.17.2');
        assert.strictEqual(extractVersion('## [1.0.0] - 2025-01-01'), '1.0.0');
        assert.strictEqual(extractVersion('##[10.20.30] - 2025-10-30'), '10.20.30');
    });

    test('extractVersion should return null for invalid lines', () => {
        assert.strictEqual(extractVersion('## Unreleased'), null);
        assert.strictEqual(extractVersion('Some random text'), null);
        assert.strictEqual(extractVersion('## [v2.17.2] - 2025-10-30'), null); // 'v' prefix
        assert.strictEqual(extractVersion(''), null);
    });

    test('findPreviousVersion should find the version before current', () => {
        const changelog = `
## [Unreleased]

## [2.17.2] - 2025-10-30
### Added
- Feature A

## [2.17.1] - 2025-10-20
### Fixed
- Bug fix

## [2.17.0] - 2025-10-17
### Changed
- Something
        `;

        assert.strictEqual(findPreviousVersion(changelog, '2.17.2'), '2.17.1');
        assert.strictEqual(findPreviousVersion(changelog, '2.17.1'), '2.17.0');
    });

    test('findPreviousVersion should return null if no previous version', () => {
        const changelog = `
## [Unreleased]

## [1.0.0] - 2025-10-30
### Added
- Initial release
        `;

        assert.strictEqual(findPreviousVersion(changelog, '1.0.0'), null);
    });

    test('findPreviousVersion should return null if current version not found', () => {
        const changelog = `
## [2.17.2] - 2025-10-30
## [2.17.1] - 2025-10-20
        `;

        assert.strictEqual(findPreviousVersion(changelog, '3.0.0'), null);
    });

    test('isValidVersion should validate semantic versions', () => {
        assert.strictEqual(isValidVersion('1.0.0'), true);
        assert.strictEqual(isValidVersion('2.17.2'), true);
        assert.strictEqual(isValidVersion('10.20.30'), true);
        
        assert.strictEqual(isValidVersion('v1.0.0'), false);
        assert.strictEqual(isValidVersion('1.0'), false);
        assert.strictEqual(isValidVersion('1.0.0.0'), false);
        assert.strictEqual(isValidVersion('abc'), false);
        assert.strictEqual(isValidVersion(''), false);
    });
});