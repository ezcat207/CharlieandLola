# Technology Stack

## Frontend Framework
- **Next.js 15** with App Router and TypeScript
- **React 19** with strict mode disabled
- **Tailwind CSS v4** for styling
- **Shadcn/ui** components library

## Backend & API
- **Next.js API Routes** for backend functionality
- **NextAuth.js v5 beta** for authentication
- **Drizzle ORM** for database operations
- **PostgreSQL** as primary database

## AI & Image Generation
- **Custom AI SDK** (`src/aisdk/`) with video generation capabilities
- **OpenAI API** for image generation (required)
- **Kie.ai Flux** for enhanced cyberpunk generation
- **Multiple AI providers**: OpenAI, DeepSeek, Replicate, OpenRouter

## Authentication
- Google OAuth
- GitHub OAuth  
- Google One Tap login
- JWT-based session management

## Payments & Billing
- **Stripe** integration with subscription support
- **Creem** payment provider (alternative)
- Credit-based usage system

## Storage & CDN
- **AWS S3-compatible storage** for image uploads
- Required for image-to-image transformations

## Internationalization
- **next-intl** for i18n
- English and Chinese language support
- Locale-based routing (`[locale]/`)

## Development Tools
- **TypeScript** with strict mode
- **ESLint** via next lint
- **Tailwind PostCSS** 
- **Fumadocs** for documentation
- **Bundle Analyzer** for performance

## Deployment
- **Vercel** (primary deployment target)
- **Cloudflare** (alternative via cloudflare branch)
- **Docker** support included
- Standalone output mode