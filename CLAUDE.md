# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vite plugin (`vite-plugin-build-console`) that displays build information in the console after a successful build. It shows build time, package size, environment variables, and automatically creates a ZIP archive of the build output.

## Commands

### Development
- `pnpm dev` - Run the playground demo (vue-ts-build in playground/)
- `pnpm build:test` - Build the playground demo to test the plugin
- `pnpm build` - Build the plugin using unbuild
- `pnpm start` - Run src/index.ts directly with tsx

### Testing & Quality
- `pnpm test` - Run vitest tests
- `pnpm lint` - Lint the codebase with eslint
- `pnpm lint:fix` - Auto-fix eslint issues
- `pnpm typecheck` - Run TypeScript type checking

### Release & Publishing
- `pnpm commit` - Stage all changes, run lint:fix, and use commitizen for conventional commits
- `pnpm release` - Create a standard version release (uses standard-version)
- `pnpm release:patch` - Create a patch release
- `pnpm release:minor` - Create a minor release
- `pnpm release:major` - Create a major release
- `pnpm release:beta` - Create a beta prerelease
- `pnpm release:origin` - Bump version and publish to npm (uses bumpp)

### Workspace Structure
This is a pnpm workspace monorepo with:
- Root: The plugin source code
- `playground/`: A Vue 3 + TypeScript test application demonstrating the plugin

## Architecture

### Plugin Structure
The plugin implements Vite's plugin API hooks in `src/index.ts`:

1. **configResolved**: Captures the resolved Vite config, specifically `build.outDir`
2. **buildStart**: Records the start time when build command is executed
3. **closeBundle**: Runs after build completes, performs:
   - Calculates build duration
   - Computes folder size of the output directory
   - Filters and displays environment variables (from config.env)
   - Creates a formatted console output using boxen and gradient-string
   - Zips the build output with naming: `{projectName}-{version}.zip` or custom name

### Key Functions

**calcFolderSize()**: Asynchronously calculates the size of a directory using `get-folder-size` and formats it with `bytes-formatter`.

**packFolder()**: Creates a ZIP archive of the build output. Naming options:
- With `packFullName`: Uses the full custom name
- With `packPre`: Uses format `{packPre}-{projectName}-{version}.zip`
- Default: Uses format `{projectName}-{version}.zip`

The ZIP is written to `{outDirPath}/{packName}`, where `outDirPath` defaults to 'dist'.

**consoleBuildInfo()**: The main exported function that returns a Vite plugin object. Accepts `BuildConsoleOptions`:
- `envString?: string[]` - Whitelist of environment variable keys to display
- `showPluginVersion?: boolean` - Whether to show the plugin version in output

### Environment Variable Handling
The plugin displays environment variables from `config.env` (Vite's env object, typically from .env files). If `envString` is provided, only those specific variables are shown; otherwise all are displayed.

### Build Output
The plugin uses unbuild with configuration in `build.config.ts`:
- Entry: `src/index`
- Declaration: node16
- Output: `dist/index.mjs` and `dist/index.d.mts`

### Testing Strategy
The playground/ directory contains a minimal Vue 3 + TypeScript application that uses the plugin via workspace protocol (`workspace:*`). This allows testing the plugin during development without publishing.
