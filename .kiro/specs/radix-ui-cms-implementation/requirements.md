# Requirements Document: Radix UI CMS Implementation

## 1. Executive Summary

Transform the Pencilz CMS into a modern, clean, and highly usable content management interface inspired by Attio's design principles. Replace all native HTML form elements with accessible Radix UI primitives while implementing thoughtful field grouping, clear visual hierarchy, and an intuitive user experience.

## 2. Business Objectives

### 2.1 Primary Goals
- Improve CMS usability and user experience for content administrators
- Establish a consistent, professional design system across all CMS interfaces
- Enhance accessibility compliance for form elements and interactions
- Reduce cognitive load through better information architecture and field grouping
- Create a scalable foundation for future CMS feature additions

### 2.2 Success Metrics
- Reduced time to complete common tasks (add project, edit settings)
- Improved form completion rates
- Zero accessibility violations in WCAG 2.1 AA compliance testing
- Positive user feedback on visual design and usability
- Maintainable codebase with reusable UI components

## 3. User Stories

### 3.1 Authentication
**As a** content administrator  
**I want to** sign in to the CMS with a clean, professional login page  
**So that** I feel confident in the platform's quality and security

**Acceptance Criteria:**
- Login page displays centered card with logo/brand
- Username and password fields have clear labels and icons
- Error messages are displayed inline with helpful context
- Loading state is shown during authentication
- Default credentials are displayed for reference
- Page is fully responsive on mobile devices

### 3.2 Dashboard Navigation
**As a** content administrator  
**I want to** navigate between different content sections easily  
**So that** I can quickly access the content I need to manage

**Acceptance Criteria:**
- Sidebar navigation is always visible on desktop
- Active section is clearly highlighted
- Navigation items have icons and labels
- Sign out button is easily accessible
- Layout is responsive (sidebar collapses on mobile)
- Navigation state persists during session

### 3.3 Project Management
**As a** content administrator  
**I want to** add and edit projects with well-organized form fields  
**So that** I can efficiently manage portfolio content without confusion

**Acceptance Criteria:**
- Form fields are grouped into logical sections (Basic Info, Media, SEO)
- Required fields are clearly marked
- Inline validation shows errors immediately
- Helper text provides guidance for each field
- Image upload shows preview and progress
- SEO section is collapsible to reduce clutter
- Character counters display for limited fields
- Save/Cancel actions are always visible (sticky footer)
- Form state is preserved if navigation is attempted

### 3.4 News & Insights Management
**As a** content administrator  
**I want to** create and edit news articles with a clean form interface  
**So that** I can publish content updates efficiently

**Acceptance Criteria:**
- Form includes title, category, excerpt, content, image, and date fields
- Fields are logically grouped and labeled
- Image upload supports drag-and-drop
- Date picker is accessible and easy to use
- Content textarea supports multi-line text with adequate height
- Validation prevents submission of incomplete articles

### 3.5 Settings Management
**As a** content administrator  
**I want to** manage site settings with clearly grouped configuration options  
**So that** I can update branding and navigation without confusion

**Acceptance Criteria:**
- Settings are organized into sections (Brand Identity, Navigation, Contact)
- Logo and icon uploads show current images with change option
- Services and About menu items are managed with add/remove controls
- Each menu item has name and link fields
- Description fields for megamenu content are provided
- All changes are saved together with single action
- Success confirmation is displayed after save

### 3.6 Home Page Configuration
**As a** content administrator  
**I want to** configure home page content including hero section and buttons  
**So that** I can control the main landing page experience

**Acceptance Criteria:**
- Hero image upload with preview
- Hero text field for main heading
- Dynamic hero buttons list with add/remove controls
- Each button has text, subtext, icon, and link fields
- SEO metadata fields are available in collapsible section
- Changes preview before saving (if possible)

### 3.7 Page Content Editing
**As a** content administrator  
**I want to** edit static page content (About, Services, FAQ, Terms, Privacy)  
**So that** I can keep informational pages up to date

**Acceptance Criteria:**
- Simple form with title and content fields
- Content textarea is large enough for substantial text
- Save/Cancel actions are clear
- Success message confirms save
- Changes are immediately reflected on public site

### 3.8 Delete Confirmations
**As a** content administrator  
**I want to** confirm destructive actions before they execute  
**So that** I don't accidentally delete important content

**Acceptance Criteria:**
- Delete button triggers confirmation dialog
- Dialog clearly states what will be deleted
- Dialog explains action is irreversible
- Cancel and Delete buttons are clearly differentiated
- Dialog can be dismissed with Escape key
- Focus is trapped within dialog when open

## 4. Functional Requirements

### 4.1 Shared UI Components

#### 4.1.1 Input Component
- Support text, email, password, url, date input types
- Display label with proper accessibility attributes
- Show error messages inline with icon
- Display helper text for guidance
- Support left and right icons
- Implement focus states with ring
- Support disabled state
- Auto-generate unique IDs for accessibility

#### 4.1.2 Textarea Component
- Support multi-line text input
- Display label and helper text
- Show character counter when maxLength is set
- Implement error state styling
- Support disabled state
- Allow vertical resizing only

#### 4.1.3 Button Component
- Support variants: primary, secondary, success, danger, ghost
- Support sizes: sm, md, lg
- Show loading spinner when loading prop is true
- Support left and right icons
- Implement disabled state
- Maintain consistent spacing and padding

#### 4.1.4 FileInput Component
- Support drag-and-drop file upload
- Show upload progress indicator
- Display image preview after upload
- Allow file type restrictions via accept prop
- Show error states for failed uploads
- Provide "Change Image" button when file is uploaded
- Support disabled state

#### 4.1.5 Card Component
- Provide container with border and shadow
- Support padding variants: none, sm, md, lg
- Optional hover effect for interactive cards
- Consistent border radius and styling

#### 4.1.6 FormSection Component
- Display section title and description
- Support collapsible sections for advanced fields
- Maintain consistent spacing between fields
- Provide visual separation between sections

#### 4.1.7 FieldGroup Component
- Support 1 or 2 column layouts
- Responsive (stack on mobile)
- Consistent gap spacing between fields

#### 4.1.8 AlertDialog Component
- Modal overlay with backdrop
- Trap focus within dialog
- Support danger and info variants
- Customizable title, description, and button text
- Dismissible with Escape key or Cancel button
- Animate in/out smoothly

### 4.2 CMS Pages

#### 4.2.1 CMSLogin
- Centered login card on gray background
- Username/email and password fields with icons
- Sign in button with loading state
- Display default credentials
- Show error messages inline
- Redirect to dashboard on success

#### 4.2.2 CMSDashboard
- Top navigation bar with logo and sign out
- Sidebar navigation with icons
- Main content area with max-width constraint
- Section-based content display (not tabs)
- List views for projects and news with cards
- Edit/Delete actions on each item
- "Add New" button for each section

#### 4.2.3 ProjectForm
- Grouped sections: Basic Information, Media, SEO
- All fields with proper labels and validation
- Image upload with preview
- Services as comma-separated input
- Collapsible SEO section
- Sticky action bar with Save/Cancel

#### 4.2.4 NewsForm
- Fields: title, category, excerpt, content, image, date
- Image upload with drag-and-drop
- Date picker for publication date
- Validation for all required fields
- Sticky action bar

#### 4.2.5 SettingsForm
- Sections: Brand Identity, Navigation, Contact
- Logo and icon uploads with previews
- Dynamic lists for services and about menu items
- Add/Remove controls for menu items
- Description fields for megamenu content
- Single save action for all settings

#### 4.2.6 HomePageForm
- Hero section configuration
- Dynamic hero buttons list
- Add/Remove controls for buttons
- Icon upload for each button
- Collapsible SEO section
- Preview of current hero image

#### 4.2.7 PageEditor
- Simple title and content fields
- Large textarea for content
- Save/Cancel actions
- Success confirmation

## 5. Non-Functional Requirements

### 5.1 Accessibility
- WCAG 2.1 AA compliance for all form elements
- Proper ARIA labels and descriptions
- Keyboard navigation support throughout
- Focus indicators clearly visible
- Screen reader compatible
- Color contrast ratios meet standards

### 5.2 Performance
- Form interactions feel instant (<100ms)
- Image uploads show progress
- No layout shift during loading
- Smooth animations (60fps)
- Optimized bundle size for UI components

### 5.3 Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### 5.4 Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Sidebar collapses to hamburger on mobile
- Forms stack to single column on mobile
- Touch-friendly tap targets (min 44x44px)

### 5.5 Maintainability
- Reusable UI components in separate directory
- Consistent naming conventions
- TypeScript interfaces for props (JSDoc comments for .jsx)
- Clear component documentation
- Minimal code duplication

## 6. Technical Constraints

### 6.1 Technology Stack
- React 18.3 (functional components only)
- Radix UI primitives for accessible components
- Tailwind CSS 3.4 for styling
- React Hook Form 7.50 for form management
- Vite 5.1 for build tooling

### 6.2 Integration Requirements
- Must work with existing Express API endpoints
- Maintain compatibility with current data structures
- No breaking changes to API contracts
- Support existing authentication flow
- Work with current file upload system (Multer)

### 6.3 Design Constraints
- Follow Attio-inspired design principles
- Use existing Tailwind configuration
- Maintain brand colors and typography
- Consistent spacing and rhythm throughout
- Subtle shadows and borders only

## 7. Dependencies

### 7.1 Required Packages
```json
{
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-alert-dialog": "^1.0.5"
}
```

### 7.2 Testing Dependencies (Minimal)
```json
{
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@testing-library/user-event": "^14.0.0",
  "jsdom": "^23.0.0"
}
```
Note: MSW and @vitest/ui are optional - can add later if needed

### 7.3 Existing Dependencies (No Changes)
- react
- react-dom
- react-router-dom
- react-hook-form
- tailwindcss
- framer-motion

## 8. Out of Scope

The following items are explicitly out of scope for this implementation:

- Rich text editor for content fields
- Image cropping or editing tools
- Bulk operations (delete multiple, bulk edit)
- Content versioning or revision history
- User role management or permissions
- Multi-language support
- Dark mode theme
- Real-time collaboration features
- Advanced SEO analysis tools
- Content scheduling or publishing workflows
- Media library or asset management
- Search functionality within CMS
- Analytics or usage tracking
- Export/import functionality

## 9. Assumptions

- Single administrator user (no multi-user considerations)
- Content is managed in English only
- Images are uploaded one at a time
- No need for content preview before publishing
- Browser localStorage is available for session management
- JavaScript is enabled in user's browser
- Stable internet connection for API calls
- File uploads are limited to 10MB per file

## 10. Risks and Mitigations

### 10.1 Risk: Learning Curve for Radix UI
**Mitigation:** Create comprehensive component documentation and examples

### 10.2 Risk: Breaking Existing Functionality
**Mitigation:** Thorough testing of all forms before deployment, maintain API compatibility

### 10.3 Risk: Performance Impact from New Components
**Mitigation:** Code splitting, lazy loading, bundle size monitoring

### 10.4 Risk: Accessibility Regressions
**Mitigation:** Automated accessibility testing, manual testing with screen readers

### 10.5 Risk: Mobile Usability Issues
**Mitigation:** Mobile-first development approach, testing on real devices

## 11. Future Enhancements

Potential features for future iterations:

- Rich text editor with formatting options
- Drag-and-drop reordering for projects and news
- Image gallery management
- Content duplication feature
- Keyboard shortcuts for common actions
- Undo/redo functionality
- Auto-save drafts
- Content search and filtering
- Batch operations
- Activity log/audit trail

## 12. Automated Testing Requirements (Streamlined)

### 12.1 Test Coverage Goals
- Minimum 60% code coverage for UI components (down from 80%)
- 100% coverage for critical user flows (login, save, delete)
- Basic form validation testing
- Environment configuration testing

### 12.2 Essential Tests Only

**Component Smoke Tests**
- Each component renders without errors
- Props are passed correctly
- Basic interactions work (click, type, upload)

**Form Integration Tests**
- Each form can submit data successfully
- Required field validation works
- File uploads complete successfully

**Data Persistence Tests**
- Existing fields are preserved when saving
- Form submissions include all expected fields
- No data loss during updates

**Environment Configuration Tests**
- API URLs use environment variables
- Tests work in both local and production
- No hardcoded localhost URLs

### 12.3 What We're NOT Testing (Initially)
- Exhaustive edge cases
- Every possible error scenario
- Visual regression testing
- Performance benchmarks
- Detailed accessibility audits (manual check is sufficient)
- Screen reader compatibility (can add later)

These can be added incrementally after the initial implementation is complete.
