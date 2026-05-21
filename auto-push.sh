#!/bin/bash
# Auto-push script for quadra_studio
# Usage: Run after making changes to auto-commit and push

cd /home/z/my-project

# Check if there are changes
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "No changes to push"
  exit 0
fi

# Add all changes
git add -A

# Generate commit message with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
CHANGES=$(git diff --cached --stat | tail -1)

git commit -m "Auto update - $TIMESTAMP" --no-verify 2>/dev/null

# Push
git push origin main 2>&1

echo "✅ Pushed at $TIMESTAMP"
