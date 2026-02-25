# Implementation Guide: Radix UI CMS

## Overview

This spec provides a complete plan for implementing Radix UI in the Pencilz CMS with an Attio-inspired design, including comprehensive automated testing.

## Spec Documents

1. **design.md** - Technical design with component architecture, UI patterns, and code examples
2. **requirements.md** - Business requirements, user stories, and acceptance criteria
3. **tasks.md** - 16 phases with 200+ granular implementation tasks
4. **IMPLEMENTATION_GUIDE.md** (this file) - Getting started guide

## Getting Started

### Step 1: Review the Spec

Read through the documents in this order:
1. `requirements.md` - Understand what we're building and why
2. `design.md` - See the technical approach and component designs
3. `tasks.md` - Review the implementation plan

### Step 2: Start Implementation

You have two options:

**Option A: Execute All Tasks Automatically**
```bash
# This will execute all tasks in sequence
kiro execute-spec radix-ui-cms-implementation
```

**Option B: Execute Tasks Manually**
Open `tasks.md` and work through each phase sequentially. Mark tasks as complete as you finish them.

### Step 3: Run Tests

After implementing components and forms, run the test suite:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Key Features of This Implementation

### 1. Automated Testing
- **200+ test cases** covering all components and forms
- **Data persistence tests** ensure existing content is never lost
- **Environment-aware tests** work in local and production without manual changes
- **API mocking** with MSW for reliable, fast tests
- **Accessibility tests** ensure WCAG 2.1 AA compliance

### 2. Environment Configuration
Tests and components use environment variables to manage URLs:

```javascript
// src/config.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
```

**Local development:**
```bash
# .env.local
VITE_API_URL=http://localhost:3001
```

**Production:**
```bash
# .env.production
VITE_API_URL=https://your-production-api.com
```

### 3. Data Persistence Testing
Special tests verify that:
- Existing project fields are preserved when adding new fields
- Existing news fields are preserved
- Existing settings fields are preserved
- Form submissions include all fields (old and new)
- API responses maintain backward compatibility

### 4. Clean, Modern Design
- Attio-inspired aesthetic with thoughtful spacing and typography
- Sidebar navigation (not tabs) for better organization
- Field grouping with sections (Basic Info, Media, SEO)
- Collapsible advanced sections to reduce cognitive load
- Drag-and-drop file uploads with previews
- Inline validation with helpful error messages
- Character counters for limited fields
- Sticky action bars for easy access to Save/Cancel

## Implementation Phases

### Phase 1-2: Setup (Est. 2-3 hours)
- Install dependencies (Radix UI, testing libraries)
- Configure Vitest and testing infrastructure
- Set up API mocks with MSW
- Create environment configuration

### Phase 3: Shared UI Components (Est. 4-6 hours)
- Build 8 reusable components (Input, Textarea, Button, etc.)
- Write comprehensive tests for each component
- Ensure accessibility compliance

### Phase 4-10: Form Refactoring (Est. 12-16 hours)
- Refactor 7 CMS forms with new components
- Implement field grouping and sections
- Write tests for each form
- Verify data persistence

### Phase 11-15: Testing (Est. 6-8 hours)
- Integration tests for complete user flows
- Data persistence and migration tests
- Accessibility audit
- Visual and responsive testing
- Performance and error handling tests

### Phase 16: Polish & Documentation (Est. 2-3 hours)
- Final visual review
- Documentation
- Test coverage report
- Implementation summary

**Total Estimated Time: 26-36 hours**

## Testing Strategy

### Unit Tests
Each UI component has its own test file:
- `Input.test.jsx` - Tests rendering, validation, error states, icons
- `Textarea.test.jsx` - Tests character counter, validation
- `Button.test.jsx` - Tests all variants, loading states
- `FileInput.test.jsx` - Tests upload, drag-drop, preview
- `AlertDialog.test.jsx` - Tests open/close, focus trap, keyboard

### Integration Tests
Test complete user flows:
- Login → Dashboard → Add Project → Save
- Login → Dashboard → Edit Project → Save
- Login → Dashboard → Delete Project → Confirm

### Data Persistence Tests
Verify existing data is never lost:
```javascript
// Example test
test('existing project fields are preserved when adding new fields', async () => {
  const existingProject = {
    id: '1',
    title: 'Old Project',
    category: 'Design',
    // ... existing fields
  }
  
  // Simulate form submission with new fields
  const updatedProject = {
    ...existingProject,
    metaTitle: 'New SEO Title', // new field
  }
  
  // Verify all old fields are still present
  expect(updatedProject).toHaveProperty('title')
  expect(updatedProject).toHaveProperty('category')
  // ... check all existing fields
})
```

### Environment Tests
Verify configuration works in all environments:
```javascript
test('API URL uses environment variable', () => {
  expect(API_URL).toBe(import.meta.env.VITE_API_URL || 'http://localhost:3001')
})
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run server  # Terminal 1 - API server
npm run dev     # Terminal 2 - Vite dev server

# Run tests
npm run test              # Run all tests once
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Run with coverage report
npm run test:ui           # Run with Vitest UI

# Build for production
npm run build
npm run preview
```

## Troubleshooting

### Tests Failing with API Errors
- Ensure MSW handlers are properly configured in `src/test/mocks/handlers.js`
- Check that test setup file is imported in `vitest.config.js`

### Environment Variables Not Working
- Verify `.env.local` file exists in project root
- Restart Vite dev server after changing environment variables
- Check that variables are prefixed with `VITE_`

### File Upload Tests Failing
- Ensure `jsdom` is configured in Vitest
- Mock `FileReader` API if needed
- Check that MSW upload handler returns correct response format

### Accessibility Tests Failing
- Run `npm install --save-dev @axe-core/react` if using axe
- Ensure all inputs have associated labels
- Check that error messages have proper ARIA attributes

## Next Steps

1. **Review the spec documents** to understand the full scope
2. **Set up your environment** with the required dependencies
3. **Start with Phase 1** (Setup & Foundation) in `tasks.md`
4. **Work through each phase sequentially** - don't skip ahead
5. **Run tests frequently** to catch issues early
6. **Mark tasks as complete** as you finish them

## Questions or Issues?

If you encounter any issues during implementation:
1. Check the design document for component examples
2. Review the requirements document for acceptance criteria
3. Look at the test examples in the tasks document
4. Ensure environment variables are properly configured

Good luck with the implementation! 🚀
