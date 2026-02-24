# Tech Stack

## Frontend
- **React 18.3** - UI framework
- **React Router DOM 6.22** - Client-side routing
- **Vite 5.1** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS + Autoprefixer** - CSS processing
- **Framer Motion 11** - Animation library
- **React Hook Form 7.50** - Form management

## Backend
- **Express 4.18** - API server
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Node.js with ES modules** - Runtime environment

## Development Setup

The project requires **two servers running simultaneously**:

1. **API Server** (port 3001) - Handles data operations and file uploads
2. **Vite Dev Server** (port 5173) - Serves the React application

## Common Commands

```bash
# Install dependencies
npm install

# Start API server (terminal 1)
npm run server

# Start dev server (terminal 2)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

## Build Configuration

- **Module type**: ES modules (`"type": "module"` in package.json)
- **Vite config**: Standard React plugin setup
- **Tailwind**: Scans all JSX/TSX files in src and index.html
- **PostCSS**: Configured for Tailwind processing

## Design System

Customize design tokens in `tailwind.config.js`:
- Colors: `theme.extend.colors`
- Typography: `theme.extend.fontFamily` and `theme.fontSize`
- Border radius: `theme.extend.borderRadius`

## File Upload Configuration

- Allowed types: JPEG, PNG, GIF, WebP, SVG
- Storage: `public/uploads/` directory
- Naming: Timestamp prefix for uniqueness
- Access: Static file serving via Express
