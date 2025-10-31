/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import * as assert from 'assert';
import { extractRepoUrl } from '../../utils/linkUpdater';

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
});