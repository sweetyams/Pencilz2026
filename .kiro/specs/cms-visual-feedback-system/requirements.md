# Requirements Document

## Introduction

The CMS Visual Feedback System enables authenticated CMS users to provide contextual feedback on any page element by selecting DOM elements and attaching comments. These comments are stored as tasks that can be managed, prioritized, and implemented through both the CMS dashboard and Kiro project integration. The system also introduces multi-user support to replace the current single-user authentication model.

## Glossary

- **CMS**: Content Management System - the administrative interface for managing site content
- **Visual_Feedback_Mode**: An interactive mode where users can select DOM elements to attach comments
- **Task**: A stored comment with metadata including page URL, DOM selector, comment text, and creator
- **DOM_Selector**: A unique path identifying a specific element in the page structure
- **Comment_Dialog**: A UI component for entering feedback text after selecting an element
- **User**: An authenticated account with access to the CMS
- **Task_Manager**: The system component responsible for storing and retrieving tasks
- **User_Manager**: The system component responsible for user authentication and management
- **Footer_Component**: The existing React component that displays site footer content
- **API_Server**: The Express backend server handling data operations

## Requirements

### Requirement 1: Visual Feedback Mode Activation

**User Story:** As a CMS user, I want to enable visual feedback mode from any page, so that I can provide contextual feedback on specific page elements.

#### Acceptance Criteria

1. WHEN a user is authenticated in the CMS, THE Footer_Component SHALL display an "Add Comments" link
2. WHEN a user is not authenticated, THE Footer_Component SHALL NOT display the "Add Comments" link
3. WHEN an authenticated user clicks the "Add Comments" link, THE Visual_Feedback_Mode SHALL activate
4. WHEN Visual_Feedback_Mode is active, THE system SHALL display a visual indicator showing the mode is enabled
5. WHEN Visual_Feedback_Mode is active, THE system SHALL allow users to deactivate it via a cancel or close action

### Requirement 2: DOM Element Selection

**User Story:** As a CMS user in visual feedback mode, I want to select page elements by hovering and clicking, so that I can attach comments to specific UI components.

#### Acceptance Criteria

1. WHILE Visual_Feedback_Mode is active, WHEN a user hovers over a DOM element, THE system SHALL highlight that element visually
2. WHILE Visual_Feedback_Mode is active, WHEN a user clicks a highlighted element, THE system SHALL capture the DOM_Selector for that element
3. THE system SHALL generate a unique and stable DOM_Selector that can reliably identify the element
4. WHEN an element is selected, THE Visual_Feedback_Mode SHALL pause to prevent accidental additional selections
5. THE system SHALL exclude non-content elements from selection (html, body, script tags)

### Requirement 3: Comment Dialog and Task Creation

**User Story:** As a CMS user, I want to enter feedback text after selecting an element, so that I can create actionable tasks for improvements.

#### Acceptance Criteria

1. WHEN a DOM element is selected, THE Comment_Dialog SHALL appear
2. THE Comment_Dialog SHALL provide a text input field for entering feedback
3. THE Comment_Dialog SHALL display the selected element's context or preview
4. WHEN a user submits the Comment_Dialog with text, THE Task_Manager SHALL create a new task
5. WHEN a user cancels the Comment_Dialog, THE system SHALL discard the selection and return to Visual_Feedback_Mode
6. THE Task_Manager SHALL store the page URL, DOM_Selector, comment text, creator username, and creation timestamp
7. WHEN a task is successfully created, THE system SHALL provide visual confirmation to the user

### Requirement 4: Task Data Storage

**User Story:** As a developer, I want tasks stored in a structured format, so that they can be accessed by both the CMS and external tools.

#### Acceptance Criteria

1. THE Task_Manager SHALL store tasks in a JSON file at `/public/data/tasks.json`
2. THE Task_Manager SHALL assign a unique identifier to each task
3. FOR ALL tasks, THE Task_Manager SHALL store: task ID, page URL, DOM_Selector, comment text, creator username, creation timestamp, and status
4. THE Task_Manager SHALL initialize task status as "open" when created
5. THE Task_Manager SHALL support task statuses: "open", "in-progress", "completed", "archived"
6. THE Task_Manager SHALL maintain data integrity when multiple tasks are created in sequence

### Requirement 5: Task Management API

**User Story:** As a system integrator, I want RESTful API endpoints for task operations, so that tasks can be managed programmatically.

#### Acceptance Criteria

1. THE API_Server SHALL provide a GET endpoint at `/api/tasks` that returns all tasks
2. THE API_Server SHALL provide a POST endpoint at `/api/tasks` that creates a new task
3. THE API_Server SHALL provide a PUT endpoint at `/api/tasks/:id` that updates an existing task
4. THE API_Server SHALL provide a DELETE endpoint at `/api/tasks/:id` that removes a task
5. WHEN a task operation fails, THE API_Server SHALL return an appropriate HTTP error code and message
6. THE API_Server SHALL validate required fields before creating or updating tasks

### Requirement 6: CMS Task Dashboard

**User Story:** As a CMS user, I want to view and manage all tasks in the CMS, so that I can prioritize and track feedback implementation.

#### Acceptance Criteria

1. THE CMS SHALL provide a "Tasks" section in the dashboard navigation
2. WHEN a user navigates to the Tasks section, THE CMS SHALL display all tasks in a list or table format
3. THE CMS SHALL display task metadata: page URL, comment text, creator, creation date, and status
4. THE CMS SHALL provide filtering options by status (open, in-progress, completed, archived)
5. THE CMS SHALL allow users to update task status
6. THE CMS SHALL allow users to delete tasks
7. WHEN a user clicks on a task's page URL, THE CMS SHALL navigate to that page
8. THE CMS SHALL display the DOM_Selector path for each task for developer reference

### Requirement 7: Multi-User Authentication System

**User Story:** As an administrator, I want multiple users to access the CMS with individual credentials, so that we can track who created each task.

#### Acceptance Criteria

1. THE User_Manager SHALL replace the hardcoded single-user authentication with a user database
2. THE User_Manager SHALL store user data in a JSON file at `/public/data/users.json`
3. FOR ALL users, THE User_Manager SHALL store: user ID, username, hashed password, and creation timestamp
4. THE User_Manager SHALL create two initial users: "willem" and "yann" with secure passwords
5. WHEN a user logs in, THE User_Manager SHALL validate credentials against the stored user database
6. THE User_Manager SHALL use password hashing (bcrypt or similar) for secure password storage
7. THE User_Manager SHALL maintain the current session management approach using AuthContext

### Requirement 8: User Management API

**User Story:** As a system component, I want API endpoints for user operations, so that user accounts can be managed programmatically.

#### Acceptance Criteria

1. THE API_Server SHALL provide a GET endpoint at `/api/users` that returns all users (excluding password hashes)
2. THE API_Server SHALL provide a POST endpoint at `/api/users` that creates a new user with hashed password
3. THE API_Server SHALL provide a PUT endpoint at `/api/users/:id` that updates user information
4. THE API_Server SHALL provide a DELETE endpoint at `/api/users/:id` that removes a user
5. THE API_Server SHALL provide a POST endpoint at `/api/auth/login` that validates credentials and returns user session data
6. WHEN creating or updating a user, THE API_Server SHALL hash passwords before storage
7. WHEN a user operation fails, THE API_Server SHALL return an appropriate HTTP error code and message

### Requirement 9: CMS User Management Interface

**User Story:** As a CMS administrator, I want to manage user accounts through the CMS interface, so that I can add, edit, and remove users without direct database access.

#### Acceptance Criteria

1. THE CMS SHALL provide a "Users" section in the dashboard navigation
2. WHEN a user navigates to the Users section, THE CMS SHALL display all users in a list or table format
3. THE CMS SHALL display user information: username and creation date
4. THE CMS SHALL provide an "Add User" button that opens a user creation form
5. THE CMS SHALL provide edit and delete actions for each user
6. WHEN creating or editing a user, THE CMS SHALL require a username and password
7. WHEN creating or editing a user, THE CMS SHALL validate that the username is unique
8. THE CMS SHALL NOT display password hashes in the user list or edit forms
9. WHEN a user is successfully created, updated, or deleted, THE CMS SHALL provide visual confirmation

### Requirement 10: Feature Toggle

**User Story:** As a developer, I want to easily enable or disable the visual feedback feature, so that it can be controlled without code changes.

#### Acceptance Criteria

1. THE system SHALL provide a configuration setting for enabling/disabling the visual feedback feature
2. WHERE the feature is disabled, THE Footer_Component SHALL NOT display the "Add Comments" link
3. WHERE the feature is disabled, THE system SHALL NOT activate Visual_Feedback_Mode
4. THE configuration setting SHALL be stored in `/public/data/settings.json`
5. THE CMS SHALL provide a toggle control in the Settings section for the visual feedback feature
6. WHEN the toggle is changed, THE system SHALL immediately reflect the new state without requiring a page reload

### Requirement 11: Task Element Highlighting

**User Story:** As a CMS user viewing tasks, I want to see which element a task refers to, so that I can understand the context of the feedback.

#### Acceptance Criteria

1. WHEN viewing a task in the CMS dashboard, THE CMS SHALL provide a "View on Page" action
2. WHEN a user clicks "View on Page", THE system SHALL navigate to the task's page URL
3. WHEN the page loads, THE system SHALL highlight the element identified by the task's DOM_Selector
4. THE system SHALL scroll the highlighted element into view
5. IF the DOM_Selector cannot be found on the page, THE system SHALL display a warning message
6. THE highlight SHALL remain visible for at least 3 seconds or until the user dismisses it

### Requirement 12: DOM Selector Library Integration

**User Story:** As a developer, I want to use a proven library for DOM element selection, so that the feature is reliable and maintainable.

#### Acceptance Criteria

1. THE system SHALL integrate a DOM element selection library for Visual_Feedback_Mode
2. THE selected library SHALL support hover highlighting and click selection
3. THE selected library SHALL generate stable and unique DOM selectors
4. THE selected library SHALL be compatible with React 18.3 and the existing tech stack
5. THE system SHALL handle dynamic content and React component re-renders correctly

### Requirement 13: Comment UI Library Integration

**User Story:** As a developer, I want to use a proven library for the comment dialog UI, so that the interface is polished and accessible.

#### Acceptance Criteria

1. THE Comment_Dialog SHALL use a UI library or component that provides accessible modal dialogs
2. THE Comment_Dialog SHALL be keyboard accessible (Tab navigation, Enter to submit, Escape to cancel)
3. THE Comment_Dialog SHALL trap focus while open
4. THE Comment_Dialog SHALL be responsive and work on mobile devices
5. THE Comment_Dialog SHALL follow the existing design system (Tailwind CSS styling)

### Requirement 14: Data Migration

**User Story:** As a system administrator, I want existing authentication to migrate smoothly to the new multi-user system, so that the transition is seamless.

#### Acceptance Criteria

1. WHEN the system first initializes with the new User_Manager, THE system SHALL create the users.json file if it does not exist
2. THE system SHALL create the initial users "willem" and "yann" during first initialization
3. THE system SHALL create the tasks.json file if it does not exist
4. THE system SHALL initialize tasks.json with an empty array structure
5. THE system SHALL preserve existing settings.json data when adding the feature toggle setting

