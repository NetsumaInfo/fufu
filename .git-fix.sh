#!/bin/bash
# Script to fix Git conflicts - to be run manually on server

echo "🔧 Fixing Git conflicts..."

# Force reset to match remote
if [ -d .git ]; then
    git fetch origin main
    git reset --hard origin/main
    echo "✅ Git reset completed"
else
    echo "❌ Not a git repository"
    exit 1
fi

# Pull latest changes
git pull origin main

echo "✅ Repository synchronized!"
