# Product Overview

Pencilz is a React-based website with an integrated CMS for managing content. The platform serves two primary user groups:

- **Public visitors**: Browse projects, news, services, and informational pages
- **Administrators**: Manage content through a simple CMS interface

## Core Features

- Project portfolio management with image uploads
- News/blog content management
- Editable page content for static pages (About, Services, FAQ, etc.)
- Global settings management (logo, company info)
- Simple authentication system for CMS access
- Responsive design with Tailwind CSS
- Smooth animations via Framer Motion

## Authentication

Default CMS credentials: `admin` / `admin123`

## Data Storage

Content is stored in JSON files under `/public/data/`:
- `projects.json` - Project portfolio items
- `news.json` - News articles
- `pages.json` - Editable page content
- `settings.json` - Global site settings

Uploaded images are stored in `/public/uploads/`
