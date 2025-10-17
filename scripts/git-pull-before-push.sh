#!/bin/bash

# Git Pull Before Push Script
# This script automatically pulls the latest changes before pushing

set -e

echo "🔄 Checking for remote changes..."

# Get the current branch name
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if there are any remote changes
git fetch origin

# Check if the local branch is behind the remote
BEHIND=$(git rev-list --count HEAD..origin/$CURRENT_BRANCH 2>/dev/null || echo "0")
AHEAD=$(git rev-list --count origin/$CURRENT_BRANCH..HEAD 2>/dev/null || echo "0")

echo "📊 Local commits ahead: $AHEAD"
echo "📊 Remote commits behind: $BEHIND"

if [ "$BEHIND" -gt 0 ]; then
    echo "⚠️  Local branch is behind remote. Pulling latest changes..."
    
    # Check if there are uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        echo "💾 Stashing uncommitted changes..."
        git stash push -m "Auto-stash before pull $(date)"
        STASHED=true
    else
        STASHED=false
    fi
    
    # Pull the latest changes
    git pull origin $CURRENT_BRANCH
    
    # Restore stashed changes if any
    if [ "$STASHED" = true ]; then
        echo "🔄 Restoring stashed changes..."
        git stash pop || {
            echo "⚠️  Warning: Could not restore stashed changes. Please resolve conflicts manually."
            echo "   Use 'git stash list' to see your stashed changes."
        }
    fi
    
    echo "✅ Successfully pulled latest changes"
else
    echo "✅ Local branch is up to date with remote"
fi

# Check if there are any merge conflicts
if [ -f .git/MERGE_HEAD ]; then
    echo "⚠️  Warning: Merge in progress. Please resolve conflicts before pushing."
    exit 1
fi

echo "🚀 Ready to push changes!"
