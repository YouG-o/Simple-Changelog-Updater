import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    files: 'out/test/**/*.test.js',
    version: 'stable',
    workspaceFolder: './',
    mocha: {
        ui: 'tdd',
        color: true,
        timeout: 20000
    }
});