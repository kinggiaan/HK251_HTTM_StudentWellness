# 🔀 Git Workflow

## 📋 Branching Strategy

### Branch Types

```
master (main)
├── develop
│   ├── feature/student-dashboard
│   ├── feature/ml-integration
│   ├── bugfix/login-error
│   ├── hotfix/critical-security
│   └── refactor/api-services
```

**Branch Naming:**
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical production fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `test/description` - Test additions

**Examples:**
```bash
feature/student-risk-assessment
bugfix/dashboard-loading-error
hotfix/security-vulnerability
refactor/auth-service
docs/api-documentation
test/e2e-login
```

---

## 🚀 Standard Workflow

### 1. Start New Work

```bash
# Update main branch
git checkout master
git pull origin master

# Create feature branch
git checkout -b feature/student-dashboard

# Verify you're on the new branch
git branch
```

### 2. Make Changes

```bash
# Check status
git status

# Stage specific files
git add src/components/StudentCard.tsx
git add src/services/api.ts

# Or stage all changes
git add .

# Commit with meaningful message
git commit -m "feat(dashboard): add student risk assessment card"
```

### 3. Push Changes

```bash
# First push (set upstream)
git push -u origin feature/student-dashboard

# Subsequent pushes
git push
```

### 4. Keep Branch Updated

```bash
# Update local master
git checkout master
git pull origin master

# Go back to feature branch
git checkout feature/student-dashboard

# Merge latest changes from master
git merge master

# Or use rebase (keeps cleaner history)
git rebase master
```

### 5. Create Pull Request

1. Push your branch to GitHub
2. Go to repository on GitHub
3. Click "Pull requests" → "New pull request"
4. Select your branch
5. Fill in PR template:
   - Title: Clear description of changes
   - Description: What, why, how
   - Screenshots: If UI changes
   - Testing: How to test
   - Related issues: Link to issues
6. Request reviewers
7. Submit PR

### 6. After PR Approved

```bash
# Delete local branch
git branch -d feature/student-dashboard

# Delete remote branch
git push origin --delete feature/student-dashboard

# Update master
git checkout master
git pull origin master
```

---

## 📝 Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Formatting (no code change)
- **refactor**: Code restructuring
- **test**: Adding tests
- **chore**: Maintenance

### Examples

```bash
# Simple commit
git commit -m "feat(dashboard): add student risk chart"

# Commit with body
git commit -m "fix(api): handle 404 errors in student endpoint

Previously, 404 errors would crash the application.
Now they are caught and displayed as user-friendly messages."

# Commit with breaking change
git commit -m "feat(auth): change JWT token format

BREAKING CHANGE: JWT tokens now include user roles.
All existing tokens will be invalidated."

# Multiple files
git commit -m "refactor(services): extract API client

- Create api.service.ts
- Add interceptors for auth
- Update all service files to use new client"
```

---

## 🔍 Review Your Changes Before Committing

```bash
# View unstaged changes
git diff

# View staged changes
git diff --cached

# View changes in specific file
git diff src/components/StudentCard.tsx

# View commit history
git log --oneline

# View last 5 commits
git log --oneline -5

# View changes in last commit
git show
```

---

## ↩️ Undoing Changes

### Discard Uncommitted Changes

```bash
# Discard changes in specific file
git restore src/components/StudentCard.tsx

# Discard all changes
git restore .

# Unstage file (keep changes)
git restore --staged src/components/StudentCard.tsx
```

### Undo Last Commit

```bash
# Undo commit, keep changes staged
git reset --soft HEAD~1

# Undo commit, keep changes unstaged
git reset HEAD~1

# Undo commit, discard changes ⚠️ DANGEROUS
git reset --hard HEAD~1
```

### Revert Committed Changes

```bash
# Create new commit that undoes previous commit
git revert <commit_hash>

# Revert last commit
git revert HEAD
```

---

## 🔀 Merging vs Rebasing

### When to Merge

Use merge for:
- Feature branches into master
- Pulling latest changes from master
- Team collaboration

```bash
git checkout feature/student-dashboard
git merge master
```

### When to Rebase

Use rebase for:
- Cleaning up local commits
- Keeping linear history
- Before creating PR

```bash
git checkout feature/student-dashboard
git rebase master

# If conflicts occur:
# 1. Fix conflicts in files
# 2. Stage resolved files
git add .
# 3. Continue rebase
git rebase --continue

# Or abort rebase
git rebase --abort
```

---

## 🐛 Handling Merge Conflicts

### Step-by-Step Resolution

1. **Identify conflicts:**
```bash
git status
# Shows files with conflicts
```

2. **Open conflicted file:**
```typescript
<<<<<<< HEAD
const oldCode = 'your current code';
=======
const newCode = 'incoming code';
>>>>>>> feature/student-dashboard
```

3. **Resolve conflict:**
```typescript
// Choose one version or combine both
const finalCode = 'resolved code';
```

4. **Mark as resolved:**
```bash
git add src/components/StudentCard.tsx
```

5. **Complete merge:**
```bash
git commit
# Or if rebasing:
git rebase --continue
```

---

## 🏷️ Working with Tags

### Creating Tags

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v1.0.0 <commit_hash> -m "Release version 1.0.0"
```

### Pushing Tags

```bash
# Push specific tag
git push origin v1.0.0

# Push all tags
git push origin --tags
```

### Listing Tags

```bash
# List all tags
git tag

# List tags matching pattern
git tag -l "v1.*"
```

### Deleting Tags

```bash
# Delete local tag
git tag -d v1.0.0

# Delete remote tag
git push origin --delete v1.0.0
```

---

## 🔐 Git Hooks with Husky

### Pre-commit Hook

Automatically run checks before commit:

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run linter
npm run lint

# Run formatter
npm run format

# Run type check
npm run type-check
```

### Pre-push Hook

Run tests before push:

```bash
# .husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run tests
npm test
```

---

## 📊 Useful Git Commands

### Status & Information

```bash
# Show status
git status

# Show current branch
git branch

# Show all branches (including remote)
git branch -a

# Show remote repositories
git remote -v

# Show commit history
git log --oneline --graph --all
```

### Stashing

```bash
# Save current changes
git stash

# Save with message
git stash save "work in progress on dashboard"

# List stashes
git stash list

# Apply most recent stash
git stash apply

# Apply specific stash
git stash apply stash@{0}

# Apply and remove stash
git stash pop

# Delete stash
git stash drop stash@{0}

# Clear all stashes
git stash clear
```

### Cleaning

```bash
# Show what will be deleted
git clean -n

# Delete untracked files
git clean -f

# Delete untracked files and directories
git clean -fd

# Delete ignored files too
git clean -fdx
```

---

## 🚨 Emergency Procedures

### Accidentally Committed to Wrong Branch

```bash
# 1. Copy commit hash
git log --oneline

# 2. Switch to correct branch
git checkout correct-branch

# 3. Cherry-pick the commit
git cherry-pick <commit_hash>

# 4. Switch back to wrong branch
git checkout wrong-branch

# 5. Remove the commit
git reset --hard HEAD~1
```

### Need to Fix Last Commit

```bash
# Change commit message
git commit --amend -m "new message"

# Add forgotten files to last commit
git add forgotten-file.ts
git commit --amend --no-edit
```

### Pushed Broken Code

```bash
# 1. Fix the code locally
# 2. Commit the fix
git commit -m "fix: resolve critical bug"

# 3. Push immediately
git push

# Or if you need to undo:
# 1. Revert the bad commit
git revert <bad_commit_hash>

# 2. Push the revert
git push
```

---

## 📋 Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Added student risk assessment card
- Updated API service to handle 404 errors
- Added loading states to dashboard

## Screenshots
(If applicable)

## How to Test
1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Navigate to `/dashboard`
4. Verify risk assessment card displays correctly

## Checklist
- [ ] Code follows project coding standards
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No merge conflicts

## Related Issues
Closes #123
Related to #456
```

---

## 🎯 Best Practices

### DO ✅

- Commit often with clear messages
- Pull before starting new work
- Keep commits focused (one logical change per commit)
- Review your changes before committing
- Write descriptive branch names
- Delete merged branches
- Use `.gitignore` properly

### DON'T ❌

- Commit directly to master
- Commit large binary files
- Commit sensitive data (passwords, API keys)
- Push broken code
- Force push to shared branches (`git push -f`)
- Commit `node_modules/` or `.env` files
- Use generic commit messages ("update", "fix")

---

## 📚 Related Documentation

- [Coding Standards](./CODING_STANDARDS.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Quick Start](./QUICKSTART.md)
