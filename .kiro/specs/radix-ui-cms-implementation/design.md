# Design Document: Radix UI CMS Implementation

## 1. Overview

This design document outlines the implementation of Radix UI primitives to replace existing native HTML form elements across all CMS components in the Pencilz application. The goal is to create a clean, modern CMS experience inspired by Attio's design principles - emphasizing clarity, usability, and thoughtful grouping of related fields. The redesign will enhance accessibility, improve user experience, and establish a consistent design system.

## 2. High-Level Design

### 2.1 Component Architecture

```
CMS Application
├── CMSLogin (Entry Point)
│   ├── Radix Label
│   ├── Custom Input (text, password)
│   └── Radix Button
│
├── CMSDashboard (Main Container)
│   ├── Radix Tabs (Navigation)
│   │   ├── Projects Tab
│   │   ├── News Tab
│   │   ├── Pages Tab
│   │   ├── Home Page Tab
│   │   └── Settings Tab
│   │
│   ├── Radix Alert Dialog (Delete Confirmations)
│   └── Radix Dialog (Edit Forms)
│
├── ProjectForm
│   ├── Radix Label
│   ├── Custom Input (text, url)
│   ├── Custom Textarea
│   ├── Custom File Input
│   └── Radix Button
│
├── NewsForm
│   ├── Radix Label
│   ├── Custom Input (text, date)
│   ├── Custom Textarea
│   ├── Custom File Input
│   └── Radix Button
│
├── SettingsForm
│   ├── Radix Label
│   ├── Custom Input (text, email, url)
│   ├── Custom Textarea
│   ├── Custom File Input
│   ├── Radix Button
│   └── Dynamic Lists (Services, About Items)
│
├── HomePageForm
│   ├── Radix Label
│   ├── Custom Input (text, url)
│   ├── Custom Textarea
│   ├── Custom File Input
│   ├── Radix Button
│   └── Dynamic Hero Buttons List
│
└── PageEditor
    ├── Radix Label
    ├── Custom Input (text)
    ├── Custom Textarea
    └── Radix Button
```

### 2.2 Radix UI Primitives Mapping

| Current Element | Radix UI Replacement | Package | Notes |
|----------------|---------------------|---------|-------|
| `<label>` | `<Label>` | @radix-ui/react-label | Proper accessibility with htmlFor |
| `<button>` | Custom styled button | N/A | Use Radix patterns for variants |
| Tab navigation | `<Tabs>` | @radix-ui/react-tabs | Replace border-based tabs |
| `confirm()` | `<AlertDialog>` | @radix-ui/react-alert-dialog | Delete confirmations |
| `alert()` | `<AlertDialog>` | @radix-ui/react-alert-dialog | Success/error messages |
| Form modals | `<Dialog>` | @radix-ui/react-dialog | Edit forms (optional enhancement) |
| `<input>` | Custom Input component | N/A | Styled with Tailwind, Radix patterns |
| `<textarea>` | Custom Textarea component | N/A | Styled with Tailwind, Radix patterns |
| File input | Custom FileInput component | N/A | Enhanced with preview |

### 2.3 Design System Tokens (Attio-Inspired)

```javascript
// Color Palette - Clean, Modern
const colors = {
  // Primary
  primary: {
    50: '#f5f5f5',
    100: '#e5e5e5',
    500: '#737373',
    600: '#525252',
    900: '#171717'      // Near black for text
  },
  
  // Accent
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',     // Blue for interactive elements
    600: '#2563eb'
  },
  
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  
  // Neutrals
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5'
  },
  
  border: {
    light: '#f0f0f0',
    default: '#e5e5e5',
    strong: '#d4d4d4'
  },
  
  text: {
    primary: '#171717',
    secondary: '#737373',
    tertiary: '#a3a3a3',
    inverse: '#ffffff'
  }
}

// Typography - Clean hierarchy
const typography = {
  heading: {
    h1: 'text-2xl font-semibold text-gray-900',
    h2: 'text-xl font-semibold text-gray-900',
    h3: 'text-lg font-semibold text-gray-900',
    h4: 'text-base font-semibold text-gray-900'
  },
  body: {
    large: 'text-base text-gray-700',
    default: 'text-sm text-gray-700',
    small: 'text-xs text-gray-600'
  },
  label: 'text-sm font-medium text-gray-700'
}

// Spacing - Consistent rhythm
const spacing = {
  section: 'space-y-8',        // Between major sections
  group: 'space-y-6',          // Between field groups
  field: 'space-y-4',          // Between individual fields
  inline: 'gap-3',             // Inline elements
  compact: 'gap-2'             // Compact inline elements
}

// Shadows - Subtle depth
const shadows = {
  card: 'shadow-sm',
  elevated: 'shadow-md',
  modal: 'shadow-xl'
}

// Border Radius - Soft, modern
const radius = {
  small: 'rounded-md',
  default: 'rounded-lg',
  large: 'rounded-xl'
}

// Layout
const layout = {
  maxWidth: 'max-w-4xl',       // Form max width
  sidebarWidth: 'w-64',        // Sidebar navigation
  contentPadding: 'p-8',       // Main content padding
  cardPadding: 'p-6'           // Card padding
}
```

### 2.4 Field Grouping Strategy

Forms will be organized into logical sections with clear visual hierarchy:

```
Form Structure:
├── Section Header (with description)
│   ├── Field Group 1
│   │   ├── Primary Fields (required, prominent)
│   │   └── Secondary Fields (optional, subtle)
│   │
│   ├── Field Group 2
│   │   └── Related fields grouped together
│   │
│   └── Advanced Section (collapsible)
│       └── SEO, metadata, technical fields
│
└── Action Bar (sticky bottom)
    ├── Cancel (secondary)
    └── Save (primary)
```

**Grouping Examples:**

**Project Form:**
- Basic Information (title, category, description)
- Media (image upload with preview)
- Details (services, link)
- SEO & Metadata (collapsible section)

**Settings Form:**
- Brand Identity (logo, company name, location)
- Navigation (services menu, about menu)
- Contact Information (email)
- Advanced (button icons, hamburger icon)

**Home Page Form:**
- Hero Section (image, text)
- Call-to-Actions (hero buttons)
- SEO & Metadata (collapsible section)

### 2.4 Data Flow

```
User Interaction
    ↓
Radix UI Component (Accessible, Styled)
    ↓
React Hook Form (Validation, State Management)
    ↓
Form Submit Handler
    ↓
API Call (Express Backend)
    ↓
Redis/JSON Storage
    ↓
UI Update (Success/Error Feedback)
```

### 2.5 Login Page Design (Attio-Inspired)

```
┌─────────────────────────────────────────┐
│                                         │
│              [Logo/Brand]               │
│                                         │
│         Welcome to Pencilz CMS          │
│      Sign in to manage your content     │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  Email or Username          │     │
│    │  [input field]              │     │
│    └─────────────────────────────┘     │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  Password                   │     │
│    │  [input field]              │     │
│    └─────────────────────────────┘     │
│                                         │
│    ┌─────────────────────────────┐     │
│    │      Sign In                │     │
│    └─────────────────────────────┘     │
│                                         │
│    Default: admin / admin123            │
│                                         │
└─────────────────────────────────────────┘

Design Features:
- Centered card with subtle shadow
- Generous whitespace
- Clear visual hierarchy
- Soft, rounded corners
- Minimal distractions
- Subtle brand presence
```

### 2.6 Dashboard Layout (Attio-Inspired)

```
┌──────────────────────────────────────────────────────┐
│  [Logo]  Pencilz CMS                    [User Menu]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────┐  ┌──────────────────────────────┐  │
│  │            │  │                              │  │
│  │ Projects   │  │  Projects                    │  │
│  │ News       │  │  ─────────────────────────   │  │
│  │ Pages      │  │                              │  │
│  │ Home       │  │  [+ New Project]             │  │
│  │ Settings   │  │                              │  │
│  │            │  │  ┌────────────────────────┐  │  │
│  │            │  │  │ [Image]  Project 1     │  │  │
│  │            │  │  │ Category • Link        │  │  │
│  │            │  │  │          [Edit][Delete]│  │  │
│  │            │  │  └────────────────────────┘  │  │
│  │            │  │                              │  │
│  │            │  │  ┌────────────────────────┐  │  │
│  │            │  │  │ [Image]  Project 2     │  │  │
│  │            │  │  │ Category • Link        │  │  │
│  │            │  │  │          [Edit][Delete]│  │  │
│  │            │  │  └────────────────────────┘  │  │
│  │            │  │                              │  │
│  └────────────┘  └──────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘

Design Features:
- Sidebar navigation (always visible)
- Clean content area with cards
- Consistent spacing and alignment
- Subtle borders and shadows
- Action buttons aligned right
- Clear visual hierarchy
```

## 3. Low-Level Design

### 3.1 Shared Components

#### 3.1.1 FormSection Component

```typescript
// src/components/ui/FormSection.jsx
interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  collapsible?: boolean
  defaultOpen?: boolean
}

const FormSection = ({ 
  title, 
  description, 
  children, 
  collapsible = false,
  defaultOpen = true 
}: FormSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  if (collapsible) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="text-left">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div className="p-6 space-y-4 bg-white">
            {children}
          </div>
        )}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

export default FormSection
```

#### 3.1.2 FieldGroup Component

```typescript
// src/components/ui/FieldGroup.jsx
interface FieldGroupProps {
  children: React.ReactNode
  columns?: 1 | 2
}

const FieldGroup = ({ children, columns = 1 }: FieldGroupProps) => {
  return (
    <div className={`grid gap-4 ${columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
      {children}
    </div>
  )
}

export default FieldGroup
```

#### 3.1.3 Card Component

```typescript
// src/components/ui/Card.jsx
interface CardProps {
  children: React.ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const Card = ({ children, padding = 'md', hover = false }: CardProps) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  return (
    <div className={`
      bg-white border border-gray-200 rounded-lg shadow-sm
      ${paddingClasses[padding]}
      ${hover ? 'hover:shadow-md transition-shadow' : ''}
    `}>
      {children}
    </div>
  )
}

export default Card
```

#### 3.1.4 Input Component

#### 3.1.4 Input Component

```typescript
// src/components/ui/Input.jsx
import * as Label from '@radix-ui/react-label'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <Label.Root 
            htmlFor={inputId}
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            {label}
          </Label.Root>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`
              w-full px-3 py-2.5 border rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              transition-colors
              ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className || ''}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-gray-500 text-xs mt-1.5">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
```

#### 3.1.5 Textarea Component

#### 3.1.5 Textarea Component

```typescript
// src/components/ui/Textarea.jsx
import * as Label from '@radix-ui/react-label'
import { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  showCount?: boolean
  maxLength?: number
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCount, maxLength, className, id, value, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const currentLength = value?.toString().length || 0
    
    return (
      <div className="w-full">
        {label && (
          <Label.Root 
            htmlFor={textareaId}
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            {label}
          </Label.Root>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={`
            w-full px-3 py-2.5 border rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            resize-vertical transition-colors
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
            ${className || ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        <div className="flex justify-between items-start mt-1.5">
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="text-red-600 text-xs flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={`${textareaId}-helper`} className="text-gray-500 text-xs">
                {helperText}
              </p>
            )}
          </div>
          {showCount && maxLength && (
            <p className="text-xs text-gray-500 ml-2">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
export default Textarea
```

#### 3.1.6 Button Component

#### 3.1.6 Button Component

```typescript
// src/components/ui/Button.jsx
import { forwardRef } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, className, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
    
    const variants = {
      primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900',
      secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-400'
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2'
    }
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : leftIcon}
        {children}
        {rightIcon && !loading && rightIcon}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
```

#### 3.1.7 FileInput Component

#### 3.1.7 FileInput Component

```typescript
// src/components/ui/FileInput.jsx
import * as Label from '@radix-ui/react-label'
import { useState, useRef } from 'react'
import Button from './Button'

interface FileInputProps {
  label?: string
  accept?: string
  onUpload: (file: File) => Promise<string>
  value?: string
  onChange?: (url: string) => void
  disabled?: boolean
  helperText?: string
  error?: string
}

const FileInput = ({ 
  label, 
  accept = 'image/*', 
  onUpload, 
  value, 
  onChange,
  disabled,
  helperText,
  error
}: FileInputProps) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = `file-${Math.random().toString(36).substr(2, 9)}`
  
  const handleFileChange = async (file: File) => {
    if (!file) return
    
    setUploading(true)
    try {
      const url = await onUpload(file)
      setPreview(url)
      onChange?.(url)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }
  
  return (
    <div className="w-full">
      {label && (
        <Label.Root 
          htmlFor={inputId}
          className="block text-sm font-medium mb-2 text-gray-700"
        >
          {label}
        </Label.Root>
      )}
      
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${error ? 'border-red-300' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          disabled={disabled || uploading}
          className="hidden"
        />
        
        {preview ? (
          <div className="space-y-3">
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
              disabled={uploading}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span>
              {' '}or drag and drop
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF, SVG up to 10MB</p>
          </div>
        )}
        
        {uploading && (
          <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="text-gray-500 text-xs mt-1.5">{helperText}</p>
      )}
    </div>
  )
}

export default FileInput
```

#### 3.1.8 AlertDialog Component

```typescript
// src/components/ui/AlertDialog.jsx
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import Button from './Button'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  variant?: 'danger' | 'info'
}

const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'danger'
}: AlertDialogProps) => {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialogPrimitive.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <AlertDialogPrimitive.Title className="text-lg font-bold mb-2">
            {title}
          </AlertDialogPrimitive.Title>
          <AlertDialogPrimitive.Description className="text-sm text-gray-600 mb-6">
            {description}
          </AlertDialogPrimitive.Description>
          <div className="flex gap-2 justify-end">
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant="secondary" size="md">
                {cancelText}
              </Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button 
                variant={variant} 
                size="md"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  )
}

export default AlertDialog
```

### 3.2 Component Implementations

#### 3.2.1 CMSLogin with Radix UI (Attio-Inspired)

```typescript
// src/cms/CMSLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const CMSLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Simulate async login
    setTimeout(() => {
      if (login(username, password)) {
        navigate('/cms')
      } else {
        setError('Invalid credentials. Please try again.')
        setLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Pencilz CMS</h1>
          <p className="text-sm text-gray-600">Sign in to manage your content</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email or Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoFocus
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              error={error}
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            
            <Button 
              type="submit" 
              variant="primary" 
              size="lg"
              className="w-full"
              loading={loading}
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Default credentials: <span className="font-medium text-gray-700">admin</span> / <span className="font-medium text-gray-700">admin123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CMSLogin
```

#### 3.2.2 CMSDashboard with Radix Tabs

### 3.3 React Hook Form Integration

```typescript
// Example: ProjectForm with React Hook Form + Radix UI
import { useForm, Controller } from 'react-hook-form'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import FileInput from '../components/ui/FileInput'

const ProjectForm = ({ project, onSave, onCancel }) => {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: project
  })

  const handleImageUpload = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    return data.url
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Controller
        name="title"
        control={control}
        rules={{ required: 'Title is required' }}
        render={({ field }) => (
          <Input
            {...field}
            label="Title"
            error={errors.title?.message}
          />
        )}
      />
      
      <Controller
        name="description"
        control={control}
        rules={{ required: 'Description is required' }}
        render={({ field }) => (
          <Textarea
            {...field}
            label="Description"
            rows={3}
            error={errors.description?.message}
          />
        )}
      />
      
      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <FileInput
            label="Project Image"
            accept="image/*"
            onUpload={handleImageUpload}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      
      <div className="flex gap-2">
        <Button type="submit" variant="primary">Save</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  )
}
```

## 4. Migration Strategy

### 4.1 Phase 1: Setup & Shared Components
1. Install Radix UI packages
2. Create shared UI components (Input, Textarea, Button, FileInput, AlertDialog)
3. Set up component directory structure

### 4.2 Phase 2: Simple Components
1. CMSLogin - Replace inputs and button
2. PageEditor - Replace inputs, textarea, buttons

### 4.3 Phase 3: Complex Forms
1. ProjectForm - Replace all form elements
2. NewsForm - Replace all form elements
3. SettingsForm - Replace all form elements + dynamic lists
4. HomePageForm - Replace all form elements + dynamic lists

### 4.4 Phase 4: Dashboard
1. CMSDashboard - Replace tabs
2. CMSDashboard - Replace alert/confirm dialogs
3. CMSDashboard - Replace action buttons

### 4.5 Phase 5: Testing & Refinement
1. Test all forms with React Hook Form
2. Test accessibility with screen readers
3. Test keyboard navigation
4. Refine styling and animations

## 5. Package Dependencies

```json
{
  "dependencies": {
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-dialog": "^1.0.5"
  }
}
```

## 6. Accessibility Considerations

- All inputs have proper labels with `htmlFor` attributes
- Error messages are associated with inputs via `aria-describedby`
- Focus states are clearly visible with ring utilities
- Keyboard navigation works for all interactive elements
- Alert dialogs trap focus and can be dismissed with Escape
- Tabs can be navigated with arrow keys
- All buttons have descriptive text or aria-labels

## 7. Styling Approach

- Use Tailwind CSS utility classes for all styling
- Maintain existing color scheme (black primary, gray secondary)
- Use Radix UI data attributes for state-based styling
- Implement focus rings for accessibility
- Add smooth transitions for interactive states
- Keep responsive design patterns from existing implementation

## 8. Testing Strategy

- Manual testing of all form submissions
- Test file uploads with various file types
- Test form validation with React Hook Form
- Test delete confirmations with AlertDialog
- Test tab navigation in CMSDashboard
- Test keyboard navigation throughout CMS
- Test with screen reader (VoiceOver/NVDA)
- Test responsive behavior on mobile devices


#### 3.2.3 ProjectForm with Field Grouping (Attio-Inspired)

```typescript
// src/cms/ProjectForm.jsx - Well-organized form with grouped fields
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { API_URL } from '../config'
import Card from '../components/ui/Card'
import FormSection from '../components/ui/FormSection'
import FieldGroup from '../components/ui/FieldGroup'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import FileInput from '../components/ui/FileInput'
import Button from '../components/ui/Button'

const ProjectForm = ({ project, onSave, onCancel }) => {
  const { control, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      ...project,
      services: Array.isArray(project.services) 
        ? project.services.join(', ') 
        : project.services || ''
    }
  })

  const handleImageUpload = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) throw new Error('Upload failed')
    const data = await response.json()
    return data.url
  }

  return (
    <Card padding="none">
      {/* Form Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {project.id ? 'Edit Project' : 'New Project'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Add project details, media, and SEO information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSave)}>
        <div className="px-6 py-6 space-y-8">
          {/* Basic Information Section */}
          <FormSection 
            title="Basic Information"
            description="Essential details about the project"
          >
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Project title is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Project Title"
                  placeholder="e.g., Humanrace Website Redesign"
                  error={errors.title?.message}
                  helperText="This will be displayed as the main project heading"
                />
              )}
            />
            
            <FieldGroup columns={2}>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Category"
                    placeholder="e.g., E-commerce, Branding"
                    error={errors.category?.message}
                  />
                )}
              />
              
              <Controller
                name="link"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Project Link"
                    type="url"
                    placeholder="https://example.com"
                    helperText="Optional external link to the live project"
                  />
                )}
              />
            </FieldGroup>
            
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Description"
                  rows={4}
                  placeholder="Describe the project, your role, and key achievements..."
                  error={errors.description?.message}
                  helperText="Provide a compelling overview of the project"
                />
              )}
            />
            
            <Controller
              name="services"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Services Provided"
                  placeholder="Design, Development, Branding"
                  helperText="Comma-separated list of services"
                />
              )}
            />
          </FormSection>

          {/* Media Section */}
          <FormSection 
            title="Project Media"
            description="Upload images and visual assets"
          >
            <Controller
              name="image"
              control={control}
              rules={{ required: !project.image ? 'Project image is required' : false }}
              render={({ field }) => (
                <FileInput
                  label="Featured Image"
                  accept="image/*"
                  onUpload={handleImageUpload}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.image?.message}
                  helperText="Recommended: 1200x800px, JPG or PNG"
                />
              )}
            />
          </FormSection>

          {/* SEO & Metadata Section (Collapsible) */}
          <FormSection 
            title="SEO & Metadata"
            description="Optimize for search engines and social sharing"
            collapsible
            defaultOpen={false}
          >
            <Controller
              name="metaTitle"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Meta Title"
                  placeholder="Project title for search engines"
                  maxLength={60}
                  helperText="50-60 characters recommended. Appears in search results and browser tabs."
                />
              )}
            />
            
            <Controller
              name="metaDescription"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Meta Description"
                  rows={2}
                  placeholder="Brief description for search results"
                  maxLength={160}
                  showCount
                  helperText="150-160 characters recommended. Appears below the title in search results."
                />
              )}
            />
            
            <Controller
              name="metaKeywords"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Keywords"
                  placeholder="web design, branding, shopify"
                  helperText="Comma-separated keywords relevant to this project"
                />
              )}
            />
            
            <Controller
              name="ogImage"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Social Share Image (OG Image)"
                  placeholder="Leave blank to use project image"
                  helperText="1200x630px recommended. Used when sharing on social media."
                />
              )}
            />
          </FormSection>
        </div>

        {/* Sticky Action Bar */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
          >
            {project.id ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default ProjectForm
```

**Key Design Features:**
- Clear visual hierarchy with section headers and descriptions
- Logical grouping of related fields (Basic Info, Media, SEO)
- Two-column layout for related fields (category + link)
- Collapsible advanced sections (SEO) to reduce cognitive load
- Inline validation with helpful error messages
- Character counters for fields with limits
- Helper text providing context and best practices
- Sticky action bar at bottom with clear primary/secondary actions
- Loading states on submit button
- Consistent spacing and padding throughout
