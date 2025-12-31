# Scripts

This directory contains utility scripts for the monorepo.

## delete-branch.js

A script to safely delete both local and remote Git branches.

### Usage

```bash
# Run via npm/pnpm script (recommended)
pnpm delete-branch <branch-name>

# Or run directly with node
node scripts/delete-branch.js <branch-name>

# Or run the shell script directly
./scripts/delete-branch.sh <branch-name>
```

### Features

- Prompts for confirmation before deletion
- Checks if the branch exists locally and/or remotely
- Prevents deletion of the currently active branch
- Provides clear output about what's happening
- Handles both local (`git branch -D`) and remote (`git push origin --delete`) deletion

### Examples

```bash
# Delete a branch named 'feature/new-ui'
pnpm delete-branch feature/new-ui

# Delete a branch when called without arguments (prompts for branch name)
pnpm delete-branch
```
