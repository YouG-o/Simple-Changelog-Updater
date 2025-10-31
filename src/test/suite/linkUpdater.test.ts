/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import * as assert from 'assert';
import { extractRepoUrl, extractVersionFromLink } from '../../utils/linkUpdater';

suite('linkUpdater Utils Test Suite', () => {
    
    suite('extractRepoUrl', () => {
        test('Should extract repo URL from [Unreleased] link', () => {
            const link = '[Unreleased]: https://github.com/YouG-o/Simple-Changelog-Updater/compare/v2.17.2...HEAD';
            const repoUrl = extractRepoUrl(link);
            assert.strictEqual(repoUrl, 'https://github.com/YouG-o/Simple-Changelog-Updater');
        });

        test('Should handle different URL formats', () => {
            const link1 = '[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD';
            const link2 = '[Unreleased]:https://github.com/user/repo/compare/v1.0.0...HEAD'; // No space
            
            assert.strictEqual(extractRepoUrl(link1), 'https://github.com/user/repo');
            assert.strictEqual(extractRepoUrl(link2), 'https://github.com/user/repo');
        });

        test('Should return null for invalid format', () => {
            assert.strictEqual(extractRepoUrl('[Unreleased]: invalid'), null);
            assert.strictEqual(extractRepoUrl('Not a link'), null);
            assert.strictEqual(extractRepoUrl(''), null);
        });
    });

    suite('extractVersionFromLink', () => {
        test('Should extract version from version link', () => {
            const link = '[2.17.2]: https://github.com/user/repo/compare/v2.17.1...v2.17.2';
            const version = extractVersionFromLink(link);
            assert.strictEqual(version, '2.17.2');
        });

        test('Should handle different version formats', () => {
            assert.strictEqual(extractVersionFromLink('[1.0.0]: https://github.com/user/repo/compare/v0.9.0...v1.0.0'), '1.0.0');
            assert.strictEqual(extractVersionFromLink('[10.20.30]: https://example.com/compare/v10.20.29...v10.20.30'), '10.20.30');
        });

        test('Should return null for invalid format', () => {
            assert.strictEqual(extractVersionFromLink('[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD'), null);
            assert.strictEqual(extractVersionFromLink('Not a link'), null);
            assert.strictEqual(extractVersionFromLink(''), null);
            assert.strictEqual(extractVersionFromLink('[v2.0.0]: https://example.com'), null); // "v" prefix not allowed
        });

        test('Should extract version at start of line only', () => {
            assert.strictEqual(extractVersionFromLink('[1.2.3]: https://github.com/user/repo/compare/v1.2.2...v1.2.3'), '1.2.3');
            assert.strictEqual(extractVersionFromLink('  [1.2.3]: https://example.com'), null); // Indented
        });
    });
});