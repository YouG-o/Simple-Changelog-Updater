/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */


import * as assert from 'assert';
import { parseGitHubUrl } from '../../utils/gitUtils';

suite('gitUtils Test Suite', () => {
    
    test('parseGitHubUrl should parse SSH URL', () => {
        const config = `
[remote "origin"]
    url = git@github.com:YouG-o/Simple-Changelog-Updater.git
    fetch = +refs/heads/*:refs/remotes/origin/*
        `;
        
        const url = parseGitHubUrl(config);
        assert.strictEqual(url, 'https://github.com/YouG-o/Simple-Changelog-Updater');
    });

    test('parseGitHubUrl should parse HTTPS URL', () => {
        const config = `
[remote "origin"]
    url = https://github.com/YouG-o/Simple-Changelog-Updater.git
    fetch = +refs/heads/*:refs/remotes/origin/*
        `;
        
        const url = parseGitHubUrl(config);
        assert.strictEqual(url, 'https://github.com/YouG-o/Simple-Changelog-Updater');
    });

    test('parseGitHubUrl should handle HTTPS URL without .git', () => {
        const config = `
[remote "origin"]
    url = https://github.com/YouG-o/Simple-Changelog-Updater
    fetch = +refs/heads/*:refs/remotes/origin/*
        `;
        
        const url = parseGitHubUrl(config);
        assert.strictEqual(url, 'https://github.com/YouG-o/Simple-Changelog-Updater');
    });

    test('parseGitHubUrl should return null for non-GitHub URLs', () => {
        const config = `
[remote "origin"]
    url = https://gitlab.com/user/repo.git
    fetch = +refs/heads/*:refs/remotes/origin/*
        `;
        
        const url = parseGitHubUrl(config);
        assert.strictEqual(url, null);
    });

    test('parseGitHubUrl should return null for empty config', () => {
        const url = parseGitHubUrl('');
        assert.strictEqual(url, null);
    });
});