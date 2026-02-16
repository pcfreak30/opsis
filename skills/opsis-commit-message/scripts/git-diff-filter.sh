#!/bin/bash
# Filter git diff to exclude binary files, minified files, and build artifacts
# Usage: git-diff-filter.sh [--staged|--unstaged] [COMMIT_REF]

# Parse arguments
MODE="commit"
COMMIT_REF="HEAD"

if [ "$1" = "--staged" ]; then
    MODE="staged"
    shift
elif [ "$1" = "--unstaged" ]; then
    MODE="unstaged"
    shift
fi

if [ -n "$1" ]; then
    COMMIT_REF="$1"
fi

# Filter patterns to exclude
EXCLUDE_PATTERNS=(
    '\.min\.js$'
    '\.min\.css$'
    '\.map$'
    '/build/'
    '/dist/'
    '/node_modules/'
    '/\.next/'
    '/\.turbo/'
    '/coverage/'
    '/\.cache/'
    '\.lock$'
    'pnpm-lock\.yaml'
    'package-lock\.json'
    'yarn\.lock'
    '\.png$'
    '\.jpg$'
    '\.jpeg$'
    '\.gif$'
    '\.svg$'
    '\.ico$'
    '\.webp$'
    '\.woff$'
    '\.woff2$'
    '\.ttf$'
    '\.eot$'
    '\.otf$'
)

# Get list of changed files based on mode
case "$MODE" in
    "staged")
        FILES=$(git diff --cached --name-only)
        HEADER="Staged changes"
        ;;
    "unstaged")
        FILES=$(git diff --name-only)
        HEADER="Unstaged changes"
        ;;
    "commit")
        FILES=$(git show --name-only --pretty=format: "$COMMIT_REF" | grep -v '^$' | grep -v '^commit ')
        HEADER="Commit: $(git show -s --format='%h %s' "$COMMIT_REF")"
        ;;
esac

# Filter files
FILTERED_FILES=$(echo "$FILES" | while read -r file; do
    skip=false
    for pattern in "${EXCLUDE_PATTERNS[@]}"; do
        if echo "$file" | grep -qE "$pattern"; then
            skip=true
            break
        fi
    done
    
    if [ "$skip" = false ]; then
        echo "$file"
    fi
done)

# Show header
echo "$HEADER"
echo ""

# Show commit info for commit mode
if [ "$MODE" = "commit" ]; then
    echo "Author: $(git show -s --format='%an <%ae>' "$COMMIT_REF")"
    echo "Date: $(git show -s --format='%ad' "$COMMIT_REF")"
    echo ""
fi

# Show stats for filtered files only
if [ -n "$FILTERED_FILES" ]; then
    echo "Stats (filtered):"
    echo "---"
    
    case "$MODE" in
        "staged")
            git diff --cached --stat -- "$FILTERED_FILES" 2>/dev/null
            ;;
        "unstaged")
            git diff --stat -- "$FILTERED_FILES" 2>/dev/null
            ;;
        "commit")
            git show --stat --pretty=format: "$COMMIT_REF" -- "$FILTERED_FILES" 2>/dev/null
            ;;
    esac
    
    echo ""
    echo "---"
    echo "Diff:"
    echo "---"
    
    # Use --diff-filter=AM to only show Added and Modified files (no deletions, no renames)
    case "$MODE" in
        "staged")
            git diff --cached --pretty=format: --diff-filter=AM --no-textconv -- "$FILTERED_FILES" 2>/dev/null | head -10000
            ;;
        "unstaged")
            git diff --pretty=format: --diff-filter=AM --no-textconv -- "$FILTERED_FILES" 2>/dev/null | head -10000
            ;;
        "commit")
            git show --pretty=format: --diff-filter=AM --no-textconv "$COMMIT_REF" -- "$FILTERED_FILES" 2>/dev/null | head -10000
            ;;
    esac
else
    echo "No non-binary/non-minified changes to display."
fi
