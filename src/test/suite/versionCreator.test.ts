/* 
 * Copyright (C) 2025-present YouGo (https://github.com/youg-o)
 * This program is licensed under the GNU Affero General Public License v3.0.
 * You may redistribute it and/or modify it under the terms of the license.
 * 
 * Attribution must be given to the original author.
 * This program is distributed without any warranty; see the license for details.
 */

import * as assert from 'assert';
import { extractVersionFromLine, generateVersionHeader } from '../../utils/versionCreator';

suite('versionCreator Utils Test Suite', () => {
    
    suite('extractVersionFromLine', () => {
        test('Should extract valid version from "vX.Y.Z"', () => {
            assert.strictEqual(extractVersionFromLine('v1.2.3'), '1.2.3');
            assert.strictEqual(extractVersionFromLine('v2.17.2'), '2.17.2');
            assert.strictEqual(extractVersionFromLine('v10.20.30'), '10.20.30');
        });

        test('Should handle whitespace around version', () => {
            assert.strictEqual(extractVersionFromLine('  v1.2.3  '), '1.2.3');
            assert.strictEqual(extractVersionFromLine('\tv2.0.0\t'), '2.0.0');
        });

        test('Should return null for invalid formats', () => {
            assert.strictEqual(extractVersionFromLine('v1.2'), null);
            assert.strictEqual(extractVersionFromLine('1.2.3'), null);
            assert.strictEqual(extractVersionFromLine('version 1.2.3'), null);
            assert.strictEqual(extractVersionFromLine('v1.2.3.4'), null);
            assert.strictEqual(extractVersionFromLine(''), null);
            assert.strictEqual(extractVersionFromLine('vX.Y.Z'), null);
        });

        test('Should return null if version not at start of line', () => {
            assert.strictEqual(extractVersionFromLine('Some text v1.2.3'), null);
            assert.strictEqual(extractVersionFromLine('## v1.2.3'), null);
        });
    });

    suite('generateVersionHeader', () => {
        test('Should generate correct version header format', () => {
            const header = generateVersionHeader('1.2.3');
            const today = new Date().toISOString().split('T')[0];
            
            assert.strictEqual(header, `## [1.2.3] - ${today}`);
        });

        test('Should generate header with today\'s date', () => {
            const header = generateVersionHeader('2.17.3');
            
            assert.ok(header.startsWith('## [2.17.3] - '));
            assert.match(header, /## \[2\.17\.3\] - \d{4}-\d{2}-\d{2}/);
        });

        test('Should work with different version numbers', () => {
            const versions = ['0.0.1', '1.0.0', '10.20.30', '99.99.99'];
            
            versions.forEach(version => {
                const header = generateVersionHeader(version);
                assert.ok(header.includes(`## [${version}]`));
                assert.match(header, /\d{4}-\d{2}-\d{2}$/);
            });
        });
    });
});