# Architecture Overview

## Directory Structure

### Core Application
- `src/app/` - Next.js App Router with locale-based routing (`[locale]/`)
  - `(default)/` - Main app pages (landing, console, posts)
  - `(admin)/` - Admin dashboard pages  
  - `(docs)/` - Documentation pages
  - `api/` - API routes and endpoints

### Components Architecture
- `src/components/blocks/` - Large layout sections for landing pages
- `src/components/ui/` - Reusable Shadcn UI components
- `src/components/console/` - User console/dashboard components
- `src/components/dashboard/` - Admin dashboard components

### Data Layer
- `src/db/` - Drizzle ORM setup, schema, migrations
- `src/models/` - Data models for database entities  
- `src/services/` - Business logic and service layer

### AI Integration
- `src/aisdk/` - Custom AI SDK with video generation capabilities
- `src/aisdk/provider/` - Extensible provider system
- `src/aisdk/kling/` - Kling AI provider implementation

### Authentication & Security
- `src/auth/` - NextAuth.js configuration with multiple providers
- Custom user handling and session management
- Invite code system for user onboarding

### Internationalization
- `src/i18n/` - next-intl setup with locale routing
- `src/i18n/messages/` - Translation files (en.json, zh.json)
- `src/i18n/pages/` - Page-specific translations

### Configuration & Utils
- `src/lib/` - Utility functions and custom libraries
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions

## Database Schema (Multi-tenant SaaS)
- **users** - User management with OAuth providers and affiliate system
- **orders** - Stripe subscription and payment tracking  
- **credits** - Credit-based usage system
- **apikeys** - API key management for users
- **posts/categories** - Content management system
- **affiliates** - Referral/affiliate program
- **feedbacks** - User feedback collection

## API Architecture
- **RESTful endpoints** in `src/app/api/`
- **File upload handling** with FormData
- **Standardized responses**: `{code: 0|1, data?: any, msg?: string}`
- **Authentication middleware** via NextAuth
- **Rate limiting** and **credit validation**

## AI Provider System
- **Extensible architecture** for multiple AI providers
- **Type-safe interfaces** for different AI models
- **Provider-specific settings** and configurations
- **Video generation capabilities** via Kling provider

## Deployment Architecture
- **Standalone output** for containerization
- **Vercel-optimized** (primary target)
- **Cloudflare compatibility** (separate branch)
- **Environment-based configuration**
- **CDN integration** for static assets