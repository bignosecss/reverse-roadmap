#!/bin/bash

# Git branch deletion script
# Deletes both local and remote branches

set -e  # Exit on any error

# Function to display usage
usage() {
    echo "Usage: $0 <branch-name>"
    echo "Deletes both local and remote branches with the given name"
    exit 1
}

# Check if branch name is provided
if [ $# -eq 0 ]; then
    echo "Error: No branch name provided"
    usage
fi

BRANCH_NAME="$1"

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)

# Check if we're on the branch we want to delete
if [ "$BRANCH_NAME" = "$CURRENT_BRANCH" ]; then
    echo "Error: You are currently on the branch '$BRANCH_NAME'. Please switch to another branch first."
    exit 1
fi

# Check if local branch exists
LOCAL_EXISTS=$(git branch --list | grep -w "$BRANCH_NAME" | wc -l)

# Check if remote branch exists
REMOTE_EXISTS=$(git ls-remote --heads origin "$BRANCH_NAME" | wc -l)

if [ "$LOCAL_EXISTS" -eq 0 ] && [ "$REMOTE_EXISTS" -eq 0 ]; then
    echo "Branch '$BRANCH_NAME' does not exist locally or remotely. Nothing to delete."
    exit 0
fi

echo "Branch to delete: $BRANCH_NAME"
echo "Exists locally: $([ "$LOCAL_EXISTS" -eq 1 ] && echo "Yes" || echo "No")"
echo "Exists remotely: $([ "$REMOTE_EXISTS" -eq 1 ] && echo "Yes" || echo "No")"

# Confirm deletion
read -p "Do you want to proceed with deletion? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ] && [ "$CONFIRM" != "y" ]; then
    echo "Deletion cancelled."
    exit 0
fi

# Delete local branch if it exists
if [ "$LOCAL_EXISTS" -eq 1 ]; then
    echo "Deleting local branch: $BRANCH_NAME"
    git branch -D "$BRANCH_NAME"
    echo "✓ Local branch deleted successfully"
fi

# Delete remote branch if it exists
if [ "$REMOTE_EXISTS" -eq 1 ]; then
    echo "Deleting remote branch: $BRANCH_NAME on origin"
    git push origin --delete "$BRANCH_NAME"
    echo "✓ Remote branch deleted successfully"
fi

echo "Branch '$BRANCH_NAME' deletion completed."