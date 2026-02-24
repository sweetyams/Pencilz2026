# Project Structure

## Directory Organization

```
/
├── src/                    # React application source
│   ├── pages/             # Public-facing page components
│   ├── cms/               # CMS admin interface components
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React context providers
│   ├── styles/            # Global CSS and Tailwind imports
│   ├── App.jsx            # Root component with routing
│   └── main.jsx           # Application entry point
├── public/
│   ├── data/              # JSON data storage
│   └── uploads/           # User-uploaded images
├── server.js              # Express API server
└── [config files]         # Vite, Tailwind, PostCSS configs
```

## Architecture Patterns

### Routing Structure
- **Public routes**: Wrapped in `<Layout>` component (includes Navigation + Footer)
- **CMS routes**: Separate from Layout, protected by `<ProtectedRoute>`
- All routing defined in `App.jsx` using React Router DOM v6

### Component Organization
- **Pages** (`/src/pages`): Full page components for public site
- **CMS** (`/src/cms`): Admin interface components (login, dashboard, forms)
- **Components** (`/src/components`): Shared components (Layout, Navigation, Footer, etc.)
- **Contexts** (`/src/contexts`): Global state management (AuthContext)

### Data Flow
- API calls to Express server at `http://localhost:3001/api/*`
- JSON files serve as database (`/public/data/*.json`)
- File uploads handled by Multer middleware
- CORS enabled for cross-origin requests

## Code Conventions

### Component Style
- Functional components with hooks (no class components)
- Arrow function exports: `const ComponentName = () => { ... }`
- Default exports for all components

### File Naming
- Components: PascalCase (e.g., `ProjectCard.jsx`)
- Utilities/configs: camelCase or kebab-case
- All React components use `.jsx` extension

### Styling
- Tailwind utility classes for all styling
- No CSS modules or styled-components
- Global styles in `src/styles/index.css`
- Design tokens configured in `tailwind.config.js`

### State Management
- React Context for global state (authentication)
- React Hook Form for form state
- Local component state with `useState` for UI state

## API Endpoints

All endpoints prefixed with `/api/`:

- **Projects**: GET, POST, PUT, DELETE `/api/projects`
- **News**: GET, POST, PUT, DELETE `/api/news`
- **Settings**: GET, PUT `/api/settings`
- **Pages**: GET, PUT `/api/pages/:pageName`
- **Upload**: POST `/api/upload` (multipart/form-data)

## Protected Routes

CMS routes require authentication via `<ProtectedRoute>` wrapper component that checks `AuthContext` state.
