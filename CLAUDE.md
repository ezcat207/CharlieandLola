# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `pnpm dev` - Start development server with turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Operations
- `pnpm db:generate` - Generate database migrations with Drizzle Kit
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio for database management
- `pnpm db:push` - Push schema changes directly to database

### Cloudflare Deployment
- `pnpm cf:preview` - Build and preview Cloudflare deployment
- `pnpm cf:deploy` - Build and deploy to Cloudflare
- `pnpm cf:upload` - Build and upload to Cloudflare

### Other Utilities
- `pnpm analyze` - Analyze bundle size
- `docker build -f Dockerfile -t cyberpunk-ai-generator:latest .` - Build Docker image

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS + Shadcn UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js (Google, GitHub, Google One Tap)
- **Payments**: Stripe integration with subscription support
- **AI/Video**: Custom AI SDK with Kling video generation provider
- **Internationalization**: next-intl with English/Chinese support
- **Deployment**: Vercel (main) or Cloudflare (cloudflare branch)

### Key Directory Structure

**Core Application**:
- `src/app/` - Next.js App Router with locale-based routing (`[locale]/`)
- `src/components/` - React components split into `blocks/` (landing page sections) and `ui/` (reusable components)
- `src/aisdk/` - Custom AI SDK with video generation capabilities

**Data & Services**:
- `src/db/` - Drizzle ORM setup with PostgreSQL schema and migrations
- `src/models/` - Data models for database entities
- `src/services/` - Business logic layer

**Configuration & Utilities**:
- `src/auth/` - NextAuth.js configuration with multiple providers
- `src/i18n/` - Internationalization setup with locale routing
- `src/lib/` - Utility functions and custom libraries

### Database Schema
Multi-tenant SaaS structure with:
- `users` - User management with OAuth providers and affiliate system
- `orders` - Stripe subscription and payment tracking
- `credits` - Credit-based usage system
- `apikeys` - API key management for users
- `posts`/`categories` - Content management system
- `affiliates` - Referral/affiliate program
- `feedbacks` - User feedback collection

### Authentication Flow
- Supports Google OAuth, GitHub OAuth, and Google One Tap
- Custom user handling in `src/auth/handler.ts`
- Automatic user creation with invite code system
- Session management with JWT tokens

### AI SDK Integration
Custom AI SDK located in `src/aisdk/` with:
- Video generation capabilities via Kling provider
- Extensible provider system for multiple AI services
- Type-safe model interfaces and settings

### Internationalization
- Route-based localization with `[locale]` segments
- Separate translation files for different page sections
- Theme and locale toggles in UI components

### Component Architecture
- **Blocks**: Large layout sections for landing pages (`src/components/blocks/`)
- **UI**: Reusable Shadcn UI components (`src/components/ui/`)
- **Layout**: Admin dashboard and console layouts with sidebars
- **Forms**: Type-safe forms with React Hook Form and Zod validation

### Environment Setup
Copy `.env.example` to `.env.development` and configure:
- **REQUIRED**: `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- Database connection (`DATABASE_URL`) 
- OAuth provider credentials
- Stripe keys for payments
- Other optional service API keys

**Critical**: The cyberpunk image generator requires a valid OpenAI API key to function.

### Deployment Notes
- **Vercel**: Default deployment target
- **Cloudflare**: Use `cloudflare` branch with `wrangler.toml` configuration
- **Docker**: Dockerfile included for containerized deployment