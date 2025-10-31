<div align="center">

![Extension icon](https://raw.githubusercontent.com/YouG-o/Simple-Changelog-Updater/main/assets/icons/icon.png)

###

# Simple Changelog Updater

<br>

</div>

## Features

- 🚀 Create version entries with a keyboard shortcut
- 📅 Automatically adds today's date
- ✅ Validates semantic versioning (vX.Y.Z)
- 🔗 Automatically updates changelog links ([Unreleased] and version comparison links)
- 📝 Works only in CHANGELOG.md files

## Usage

1. Open your `CHANGELOG.md` file
2. Type a version number in the format `vX.Y.Z` (e.g., `v2.17.3`)
3. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux)
4. The extension will:
   - Replace the line with: `## [2.17.3] - 2025-10-31`
   - Update `[Unreleased]` link to compare against the new version
   - Add a new version comparison link (e.g., `[2.17.3]: .../compare/v2.17.2...v2.17.3`)

## Demo

![Demo](https://raw.githubusercontent.com/YouG-o/Simple-Changelog-Updater/main/assets/demo.gif)

*Press `Cmd+Shift+V` on a version line to automatically create the version entry and update links*

### Customizing the Keyboard Shortcut

Don't like the default shortcut? You can change it:

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Search for "Preferences: Open Keyboard Shortcuts"
3. Search for "Changelog: Create Version from Line"
4. Click the pencil icon and set your preferred shortcut

## Requirements

- VSCode 1.105.0 or higher
- Markdown language support

## Known Issues

- Autocompletion feature is not yet functional (use the keyboard shortcut instead)

<div align="center">

# LICENSE

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE)

</div>