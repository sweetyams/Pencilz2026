# Implementation Plan: CMS Visual Feedback System

## Overview

This implementation plan transforms the Pencilz CMS into a collaborative feedback platform by adding visual element selection, task management, and multi-user authentication. The plan follows a 9-phase approach that builds incrementally from backend infrastructure through frontend UI to testing and deployment.

## Tasks

- [x] 1. Set up backend infrastructure and data storage
  - [x] 1.1 Install bcryptjs dependency for password hashing
    - Run: `npm install bcryptjs`
    - _Requirements: 7.6_
  
  - [x] 1.2 Create initial data files with proper structure
    - Create `/public/data/users.json` with willem and yann users (passwords: willem123, yann123)
    - Create `/public/data/tasks.json` with empty tasks array
    - Add `visualFeedbackEnabled: true` to `/public/data/settings.json`
    - _Requirements: 7.2, 7.4, 4.1, 10.4, 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [x] 1.3 Implement User API endpoints in server.js
    - Add bcryptjs import and helper functions: `readUsers()`, `writeUsers()`, `hashPassword()`, `verifyPassword()`
    - Implement GET /api/users (exclude passwordHash from response)
    - Implement POST /api/users (hash password before storage, validate unique username)
    - Implement PUT /api/users/:id (hash password if provided)
    - Implement DELETE /api/users/:id
    - Implement POST /api/auth/login (verify credentials with bcrypt)
    - _Requirements: 7.1, 7.3, 7.5, 7.6, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [x] 1.4 Implement Task API endpoints in server.js
    - Add helper functions: `readTasks()`, `writeTasks()`
    - Implement GET /api/tasks
    - Implement POST /api/tasks (validate required fields: pageUrl, selector, comment, creator)
    - Implement PUT /api/tasks/:id (validate status enum: open, in-progress, completed, archived)
    - Implement DELETE /api/tasks/:id
    - _Requirements: 4.2, 4.3, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_
  
  - [x] 1.5 Update Settings API to support feature toggle
    - Modify PUT /api/settings to accept and persist `visualFeedbackEnabled` boolean field
    - _Requirements: 10.1, 10.4_

- [x] 2. Update authentication system for multi-user support
  - [x] 2.1 Update AuthContext to use new authentication API
    - Change state from boolean to user object: `{ id, username }`
    - Update login method to call POST /api/auth/login
    - Store full user object on successful login
    - Update logout to clear user object
    - _Requirements: 7.7_
  
  - [x] 2.2 Update Login component to use new AuthContext
    - Update to use new AuthContext API
    - Display appropriate error messages for failed login
    - _Requirements: 7.5_
  
  - [ ]* 2.3 Test authentication with new user credentials
    - Verify login with willem/willem123
    - Verify login with yann/yann123
    - Verify failed login with invalid credentials

- [x] 3. Checkpoint - Verify backend and authentication
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Build user management interface
  - [x] 4.1 Install Headless UI dependency
    - Run: `npm install @headlessui/react`
    - _Requirements: 13.1_
  
  - [x] 4.2 Create UserDashboard component
    - Create `src/cms/UserDashboard.jsx`
    - Implement user list table displaying username and creation date
    - Implement "Add User" button and form modal using Headless UI Dialog
    - Implement edit user functionality with form modal
    - Implement delete user with confirmation dialog
    - Add form validation (unique username, password min 8 chars)
    - Add success/error toast notifications
    - Ensure password hashes are never displayed
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9_
  
  - [ ]* 4.3 Write property test for user management
    - **Property 9: User Data Completeness**
    - **Property 11: User CRUD Operations**
    - **Validates: Requirements 7.3, 7.6, 8.2, 8.3, 8.4, 9.5, 9.6, 9.7**
  
  - [x] 4.4 Add Users route to CMS navigation
    - Add "Users" link to CMS dashboard navigation
    - Add route in `App.jsx`: `/cms/users` → `<UserDashboard />`
    - _Requirements: 9.1_

- [x] 5. Build task management dashboard
  - [x] 5.1 Create TaskDashboard component
    - Create `src/cms/TaskDashboard.jsx`
    - Implement task list table with columns: Page, Comment, Creator, Date, Status, Actions
    - Implement status filter tabs (all, open, in-progress, completed, archived)
    - Implement status update dropdown for each task
    - Implement delete task with confirmation dialog
    - Implement "View on Page" link with URL parameter
    - Display DOM selector path for developer reference
    - Add success/error toast notifications
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8_
  
  - [ ]* 5.2 Write property tests for task management
    - **Property 3: Task Data Persistence**
    - **Property 4: Task Status Transitions**
    - **Property 5: Task Deletion**
    - **Property 8: Task Filtering**
    - **Validates: Requirements 4.1, 4.5, 4.6, 5.1, 5.3, 5.4, 6.4**
  
  - [x] 5.3 Add Tasks route to CMS navigation
    - Add "Tasks" link to CMS dashboard navigation
    - Add route in `App.jsx`: `/cms/tasks` → `<TaskDashboard />`
    - _Requirements: 6.1_

- [x] 6. Checkpoint - Verify CMS dashboards
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement visual feedback mode
  - [x] 7.1 Install DOM inspector dependency
    - Run: `npm install @highlight-run/react-dom-inspector`
    - _Requirements: 12.1, 12.4_
  
  - [x] 7.2 Create VisualFeedbackMode component
    - Create `src/components/VisualFeedbackMode.jsx`
    - Integrate @highlight-run/react-dom-inspector for element selection
    - Implement hover highlighting with visual indicator
    - Implement click selection and selector generation
    - Add visual indicator showing mode is active
    - Add cancel/close functionality
    - Exclude non-content elements (html, body, script, style tags)
    - Prevent default click behavior during active mode
    - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 12.2, 12.3, 12.5_
  
  - [ ]* 7.3 Write property test for element selection
    - **Property 1: Element Selection and Highlighting**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.5**
  
  - [x] 7.4 Create CommentDialog component
    - Create `src/components/CommentDialog.jsx`
    - Use Headless UI Dialog component for modal
    - Display selected element context (selector path)
    - Implement textarea for comment input (min 10 chars, max 1000 chars)
    - Add character counter
    - Implement submit handler (POST /api/tasks with pageUrl, selector, comment, creator)
    - Implement cancel handler
    - Add keyboard accessibility (Tab navigation, Enter to submit, Escape to cancel)
    - Add loading and error states
    - Auto-focus textarea on open
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.7, 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 7.5 Write property tests for task creation
    - **Property 2: Task Creation Completeness**
    - **Property 6: API Error Handling**
    - **Validates: Requirements 3.4, 3.6, 4.2, 4.3, 4.4, 5.5, 5.6**
  
  - [x] 7.6 Update Footer component to enable visual feedback mode
    - Import AuthContext to check authentication state
    - Fetch visualFeedbackEnabled from settings on mount
    - Conditionally render "Add Comments" link (only when authenticated AND feature enabled)
    - Implement click handler to activate Visual Feedback Mode
    - Pass current user to Visual Feedback Mode
    - _Requirements: 1.1, 1.2, 1.3, 10.2, 10.3_
  
  - [x] 7.7 Create app-level state management for Visual Feedback Mode
    - Add state in `App.jsx` or create new context for Visual Feedback Mode
    - Manage mode activation/deactivation
    - Pass state to Footer and VisualFeedbackMode components
    - Ensure mode deactivates after task creation
    - _Requirements: 1.3, 1.5, 3.5_

- [ ] 8. Implement task highlighting on pages
  - [ ] 8.1 Create TaskHighlight component
    - Create `src/components/TaskHighlight.jsx`
    - Accept selector and duration props (default 3000ms)
    - Query DOM for selector on component mount
    - Add highlight CSS class to matched element
    - Scroll element into view with smooth behavior
    - Remove highlight after duration
    - Show warning toast if element not found
    - _Requirements: 11.3, 11.4, 11.5, 11.6_
  
  - [ ]* 8.2 Write property test for task highlighting
    - **Property 15: Task Element Highlighting on Page**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
  
  - [ ] 8.3 Update TaskDashboard "View on Page" links
    - Modify links to include task ID in URL parameter
    - Example: `/projects?highlightTask=task-id-123`
    - _Requirements: 11.1, 11.2_
  
  - [ ] 8.4 Update page components to support task highlighting
    - Check for `highlightTask` URL parameter on mount in all public page components
    - Fetch task data if parameter present
    - Render TaskHighlight component with task's selector
    - _Requirements: 11.2, 11.3_

- [x] 9. Add feature toggle to CMS settings
  - [x] 9.1 Update Settings component with feature toggle
    - Add toggle control for "Enable Visual Feedback" in `src/cms/Settings.jsx`
    - Bind to `visualFeedbackEnabled` in settings
    - Update on toggle change (PUT /api/settings)
    - _Requirements: 10.1, 10.5_
  
  - [ ]* 9.2 Write property test for feature toggle
    - **Property 14: Feature Toggle Control**
    - **Validates: Requirements 10.2, 10.3**
  
  - [ ]* 9.3 Test feature toggle functionality
    - Disable feature, verify "Add Comments" link hidden
    - Enable feature, verify link appears
    - Verify no page reload required

- [x] 10. Checkpoint - Verify complete feature integration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Write comprehensive test suite
  - [ ] 11.1 Install testing dependencies
    - Run: `npm install --save-dev fast-check @testing-library/react @testing-library/user-event vitest @vitest/ui jsdom supertest`
    - _Requirements: Testing Strategy_
  
  - [ ]* 11.2 Write unit tests for frontend components
    - Test VisualFeedbackMode: rendering, hover, click, cleanup
    - Test CommentDialog: rendering, validation, submit, cancel, keyboard
    - Test TaskDashboard: loading, filtering, status update, delete
    - Test UserDashboard: loading, create, edit, delete, validation
    - Test Footer: conditional rendering based on auth and feature toggle
    - Test TaskHighlight: element query, scroll, highlight, warning
    - Target 80%+ code coverage
  
  - [ ]* 11.3 Write unit tests for backend API endpoints
    - Test Task API: GET, POST, PUT, DELETE with valid/invalid data
    - Test User API: GET, POST, PUT, DELETE with valid/invalid data
    - Test Auth API: login success/failure, password hashing
    - Test Settings API: feature toggle persistence
    - Target 90%+ code coverage
  
  - [ ]* 11.4 Write property-based tests for all correctness properties
    - **Property 1**: Element Selection and Highlighting
    - **Property 2**: Task Creation Completeness
    - **Property 3**: Task Data Persistence
    - **Property 4**: Task Status Transitions
    - **Property 5**: Task Deletion
    - **Property 6**: API Error Handling
    - **Property 7**: Task Metadata Display
    - **Property 8**: Task Filtering
    - **Property 9**: User Data Completeness
    - **Property 10**: User Authentication
    - **Property 11**: User CRUD Operations
    - **Property 12**: Password Hash Security
    - **Property 13**: User Operation Confirmation
    - **Property 14**: Feature Toggle Control
    - **Property 15**: Task Element Highlighting on Page
    - **Property 16**: Comment Dialog Keyboard Accessibility
    - **Property 17**: Settings Data Preservation
    - Configure 100 iterations per property test
    - Add property reference comments to each test
  
  - [ ]* 11.5 Write integration tests for end-to-end flows
    - Test complete task creation flow (login → enable mode → select → comment → verify)
    - Test complete user management flow (login → create user → login as new user)
    - Test feature toggle flow (disable → verify hidden → enable → verify shown)
    - Test task highlighting flow (create task → view on page → verify highlight)

- [ ] 12. Final checkpoint and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation follows the 9-phase plan from the design document
- All new components follow existing code conventions (functional components, Tailwind styling, arrow function exports)
- Backend changes are additive - no modifications to existing API endpoints
- Authentication migration requires users to log in again with new credentials (willem/willem123 or yann/yann123)
