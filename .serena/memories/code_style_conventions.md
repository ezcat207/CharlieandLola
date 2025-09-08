# Code Style & Conventions

## TypeScript Configuration
- **Strict mode enabled** in TypeScript
- **ES2017 target** 
- **ESNext modules** with bundler resolution
- Path aliases: `@/*` maps to `./src/*`

## React Patterns
- **Functional components** with hooks (no class components observed)
- **React 19** patterns with strict mode disabled
- **useState, useRef** hooks extensively used
- **Async/await** for API calls

## File Naming
- **kebab-case** for directories and component files
- **PascalCase** for React component names
- **camelCase** for variables and functions
- **snake_case** for database fields

## Component Structure  
- Components organized in `src/components/`
- **blocks/** - Large layout sections for pages
- **ui/** - Reusable Shadcn UI components  
- **Export default function** pattern for main components

## API Routes
- Located in `src/app/api/`
- Use Next.js 15 App Router conventions
- **route.ts** files for API endpoints
- **FormData** for file uploads
- **JSON responses** with standardized format: `{code, data, msg}`

## Database Schema
- **Drizzle ORM** with PostgreSQL
- **snake_case** for table and column names
- **UUIDs** for public identifiers, **integers** for internal IDs
- **timestamp with timezone** for dates
- **Proper foreign key relationships**

## Styling
- **Tailwind CSS v4** with PostCSS
- **Utility-first** approach
- **Responsive design** with mobile-first
- **Dark/light mode** support
- **Custom CSS variables** in theme.css

## State Management
- **React hooks** for local state
- **Context API** for app-wide state (`src/contexts/`)
- **No external state library** (Redux, Zustand, etc.)

## Error Handling
- **Try-catch blocks** for async operations
- **Console.error** for debugging
- **User-friendly error messages**
- **Fallback behaviors** for failed operations

## Import Patterns
- **Absolute imports** using `@/` alias
- **Named exports** for utilities
- **Default exports** for components
- **Grouped imports**: external libs, internal modules, types