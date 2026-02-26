# Implementation Tasks: Ark UI CMS Implementation (Streamlined)

## Phase 1: Setup (30 min)

- [x] 1. Install Dependencies
  - [x] 1.1 Install Ark UI packages: `npm install @ark-ui/react`
  - [x] 1.2 Install testing packages: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
  - [x] 1.3 Create vitest.config.js with basic setup
  - [x] 1.4 Update package.json with test script: `"test": "vitest"`
  - [x] 1.5 Create src/components/ui/ directory

## Phase 2: Core UI Components (2-3 hours)

- [x] 2. Build Essential Components
  - [x] 2.1 Create Input component (src/components/ui/Input.jsx) with label, error, helper text
  - [x] 2.2 Create Textarea component (src/components/ui/Textarea.jsx) with character counter
  - [x] 2.3 Create Button component (src/components/ui/Button.jsx) with variants and loading
  - [x] 2.4 Create FileInput component (src/components/ui/FileInput.jsx) with drag-drop
  - [x] 2.5 Create AlertDialog component (src/components/ui/AlertDialog.jsx)
  - [x] 2.6 Create Card component (src/components/ui/Card.jsx)
  - [x] 2.7 Create FormSection component (src/components/ui/FormSection.jsx) with collapsible
  - [x] 2.8 Write basic smoke tests for each component (one test file per component)

## Phase 3: Login & Dashboard (1-2 hours)

- [x] 3. Update Login and Dashboard
  - [x] 3.1 Refactor CMSLogin with new Input and Button components
  - [x] 3.2 Add centered card layout and icons
  - [x] 3.3 Refactor CMSDashboard with sidebar navigation (replace tabs)
  - [x] 3.4 Replace confirm() with AlertDialog for delete actions
  - [x] 3.5 Update project/news cards with Card component
  - [x] 3.6 Write basic test for login flow

## Phase 4: Forms Refactor (3-4 hours)

- [x] 4. Update All Forms
  - [x] 4.1 Refactor ProjectForm with grouped sections (Basic Info, Media, SEO collapsible)
  - [x] 4.2 Refactor NewsForm with new components
  - [x] 4.3 Refactor SettingsForm with sections (Brand, Navigation, Contact)
  - [x] 4.4 Refactor HomePageForm with sections (Hero, CTAs, SEO collapsible)
  - [x] 4.5 Refactor PageEditor with new components
  - [x] 4.6 Write one integration test per form (submit and verify data)

## Phase 5: Essential Testing (1-2 hours)

- [x] 5. Critical Tests Only
  - [x] 5.1 Create test utilities (renderWithProviders, mock API responses)
  - [x] 5.2 Test data persistence: existing fields preserved when saving
  - [x] 5.3 Test environment config: API_URL uses env variable
  - [x] 5.4 Test form validation: required fields enforced
  - [x] 5.5 Test file uploads: image upload and preview works
  - [x] 5.6 Run accessibility audit with browser DevTools (manual)

## Phase 6: Polish & Deploy (1 hour)

- [x] 6. Final Touches
  - [x] 6.1 Test on mobile viewport (responsive check)
  - [x] 6.2 Test keyboard navigation (Tab through forms)
  - [x] 6.3 Remove console.logs and unused imports
  - [x] 6.4 Run `npm run build` and verify no errors
  - [x] 6.5 Create .env.example with VITE_API_URL
  - [x] 6.6 Update README with new testing commands

## Simplified Testing Approach

### What We're Testing
1. **Component smoke tests** - Each component renders without crashing
2. **Form integration tests** - Each form can submit data successfully
3. **Data persistence** - Existing fields aren't lost when saving
4. **Environment config** - API URLs work in local and production
5. **Basic accessibility** - Manual check with keyboard and DevTools

### What We're Skipping (for now)
- Exhaustive unit tests for every prop combination
- Visual regression testing
- Performance testing
- Detailed error scenario testing
- Screen reader testing (can add later if needed)

## Quick Test Setup

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
})
```

```javascript
// src/test/setup.js
import '@testing-library/jest-dom'
```

```javascript
// src/config.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
```

## Estimated Timeline

- **Phase 1**: 30 minutes (setup)
- **Phase 2**: 2-3 hours (components)
- **Phase 3**: 1-2 hours (login/dashboard)
- **Phase 4**: 3-4 hours (forms)
- **Phase 5**: 1-2 hours (testing)
- **Phase 6**: 1 hour (polish)

**Total: 8-12 hours** (down from 26-36 hours)

## Notes

- Focus on getting it working first, perfect later
- Write tests as you go, not all at the end
- Use existing form logic, just swap out UI components
- Keep React Hook Form integration as-is
- Manual testing is fine for edge cases
- Can add more comprehensive tests later if needed
