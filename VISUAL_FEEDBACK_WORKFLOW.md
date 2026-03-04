# Visual Feedback System - Complete Workflow

## Overview

The Visual Feedback System allows users to create tasks by selecting elements on the live site, and developers to fix those tasks using Kiro AI assistant.

## Workflow

### 1. Creating Tasks (Production or Local)

**On the live site or locally:**
1. Log in to CMS with credentials (willem/willem123 or yann/yann123)
2. Navigate to any public page
3. Click "Add Comments" in the footer
4. Click any element on the page
5. Enter a comment describing the issue (min 10 characters)
6. Submit - task is created with:
   - Screenshot of the element
   - CSS selector
   - Page URL
   - Viewport/browser metadata
   - Creator username

### 2. Syncing Tasks (Production → Local)

**If tasks were created on production:**

#### Option A: Using the CMS UI
1. Open local CMS → Tasks page
2. Click "Sync from Production" button
3. Enter production URL (e.g., `https://pencilz.vercel.app`)
4. Tasks are downloaded and saved locally

#### Option B: Using the CLI Script
```bash
node scripts/sync-tasks-from-production.js https://pencilz.vercel.app
```

### 3. Fixing Tasks with Kiro

**In your local development environment:**

1. Open the CMS Tasks page
2. Find the task you want to fix
3. Click the "🤖 Fix" button - this copies the command
4. Paste in Kiro chat (e.g., "Fix task #A3B9K2")
5. Kiro automatically:
   - Reads `public/data/tasks.json`
   - Finds task by its 6-character ID (e.g., #A3B9K2)
   - Loads all task details (comment, selector, screenshot, metadata)
   - Makes the necessary code changes
   - Marks task as completed with "Fixed by Kiro" note

### 4. Reviewing and Deploying

1. Review Kiro's changes
2. Test locally
3. Commit to git
4. Deploy to production
5. Task status can be updated in CMS (open → in-progress → completed)

## Task Data Structure

```json
{
  "id": "A3B9K2",
  "pageUrl": "http://localhost:5173/",
  "selector": "div.footer > p.text-sm",
  "comment": "Increase padding here",
  "creator": "willem",
  "status": "open",
  "createdAt": "2026-03-03T23:45:00Z",
  "updatedAt": "2026-03-03T23:45:00Z",
  "screenshot": "/uploads/feedback-1234567890.png",
  "metadata": {
    "viewport": { "width": 1920, "height": 1080 },
    "screen": { "width": 1920, "height": 1080 },
    "devicePixelRatio": 2,
    "userAgent": "Mozilla/5.0...",
    "scrollPosition": { "x": 0, "y": 500 }
  }
}
```

Task IDs are 6-character alphanumeric codes (e.g., A3B9K2, X7Y2M9) that are:
- Easy to reference and communicate
- Unique across local and production environments
- Collision-resistant (36^6 = 2.1 billion possible combinations)

## API Endpoints

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task (status, fixedBy, fixedAt)
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/export` - Export all tasks (for syncing)
- `POST /api/tasks/import` - Import tasks (for syncing)

## Task Statuses

- `open` - New task, not started
- `in-progress` - Currently being worked on
- `completed` - Fixed and verified
- `archived` - Closed/no longer relevant

## Kiro Integration

### Agent Hook

The `cms-task-context` hook automatically triggers when you mention a task ID:
- Detects patterns: "fix task #A3B9K2", "task A3B9K2", "work on task #X7Y2M9"
- Reads `public/data/tasks.json`
- Finds task by its 6-character ID
- Provides full context to Kiro

### Automatic Status Updates

When Kiro fixes a task, it automatically:
1. Updates task status to "completed"
2. Appends " - Fixed by Kiro: [description of changes]" to the comment
3. Sets the `updatedAt` timestamp
4. Makes the API call using curl or fetch

Example:
```bash
curl -X PUT http://localhost:3001/api/tasks/{taskId} \
  -H "Content-Type: application/json" \
  -d '{"status": "completed", "comment": "Original comment - Fixed by Kiro: Changed mb-8 to mb-4"}'
```

## Best Practices

1. **Sync regularly** - Pull production tasks before starting work
2. **Clear descriptions** - Write specific, actionable comments
3. **Use screenshots** - Visual context helps Kiro understand the issue
4. **Update status** - Keep task status current for team visibility
5. **Test fixes** - Always verify Kiro's changes before deploying

## Troubleshooting

### Tasks not syncing
- Check production URL is correct
- Verify `/api/tasks/export` endpoint is accessible
- Check CORS settings if cross-origin

### Kiro can't find task
- Ensure `public/data/tasks.json` exists locally
- Verify task ID matches exactly (case-sensitive: #A3B9K2 not #a3b9k2)
- Check hook is enabled in `.kiro/hooks/`

### Screenshot not loading
- Verify image exists in `/public/uploads/`
- Check image URL in task data
- Ensure upload endpoint is working

## Security Notes

- Tasks contain user-generated content - sanitize before display
- Screenshots are publicly accessible in `/public/uploads/`
- Consider adding authentication to `/api/tasks/export` in production
- Task metadata includes user agent - be mindful of privacy
