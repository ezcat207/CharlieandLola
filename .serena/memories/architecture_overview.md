# Architecture Overview

## Directory Structure

### Core Application
```
src/app/                    # Next.js App Router
├── [locale]/              # Internationalized routes  
├── api/                   # API routes
│   └── generate-cyberpunk/    # Main image generation endpoint
└── globals.css            # Global styles

src/components/            # React Components
├── blocks/                # Landing page sections
│   └── imagen-wrapper/        # Main image generation interface
└── ui/                    # Reusable Shadcn UI components

src/aisdk/                 # Custom AI SDK
└── providers/             # AI provider implementations
```

### Data Layer
```
src/db/                    # Database configuration
├── schema/                # Drizzle schema definitions
├── migrations/            # Database migrations
└── config.ts              # Drizzle configuration

src/models/                # Data models and types
src/services/              # Business logic layer
```

### Configuration & Utilities  
```
src/auth/                  # NextAuth.js configuration
├── handler.ts             # Custom user handling
└── providers/             # OAuth provider configs

src/i18n/                  # Internationalization
├── messages/              # Translation files
└── pages/                 # Page-specific translations

src/lib/                   # Utility functions
src/hooks/                 # Custom React hooks
src/contexts/              # React context providers
```

## Database Schema

### Core Entities
- **users**: User accounts with OAuth provider info and affiliate tracking
- **orders**: Stripe subscription and payment records
- **credits**: Usage tracking and credit consumption
- **apikeys**: User API key management
- **posts/categories**: Content management system
- **affiliates**: Referral and affiliate program
- **feedbacks**: User feedback collection

### Relationships
- Users have many orders (payment history)
- Users have credit transactions (usage tracking)  
- Users can have API keys for external access
- Affiliate system tracks user referrals

## Authentication Flow

### OAuth Integration
1. **Google OAuth**: Primary authentication method
2. **GitHub OAuth**: Secondary provider  
3. **Google One Tap**: Streamlined sign-in experience

### User Management
- **Automatic Registration**: New users created on first OAuth login
- **Invite Code System**: Support for referral tracking
- **Session Management**: JWT-based sessions via NextAuth.js

## AI Integration Architecture

### Image Generation Pipeline
1. **Upload Handling**: Multi-file upload with validation (max 5 images, 10MB limit)
2. **Image Processing**: Convert to base64 for API submission
3. **AI Provider**: Google Gemini 2.5 Flash Image Preview
4. **Style Application**: Charlie and Lola cartoon transformation
5. **Storage**: Optional cloud storage with fallback to data URLs
6. **Response**: Tiered access based on user authentication

### API Pool Management
- **Key Rotation**: Multiple API keys for load distribution
- **Failure Handling**: Automatic key marking and retry logic
- **Quota Management**: Rate limiting and usage tracking

## Internationalization Architecture

### Route Structure
```
/[locale]/                 # Language-specific routes
├── en/                    # English content
└── zh/                    # Chinese content
```

### Translation Management
- **Message Files**: Structured JSON for different page sections
- **Component Integration**: useTranslations hook throughout components
- **Dynamic Content**: Runtime translation with parameter substitution

## Payment and Credit System

### Stripe Integration
- **Subscription Management**: Recurring payment processing
- **Webhook Handling**: Real-time payment status updates
- **Plan Management**: Multiple subscription tiers

### Credit System  
- **Usage Tracking**: Per-generation credit consumption
- **Free Tier**: Limited access with registration requirements
- **Premium Features**: Higher quotas and priority processing

## Deployment Architecture

### Vercel (Primary)
- **Zero-config Deployment**: Automatic builds and deployments
- **Serverless Functions**: API routes as serverless functions
- **CDN**: Global content delivery network
- **Environment Variables**: Secure configuration management

### Cloudflare (Alternative)
- **Workers**: Serverless compute platform
- **R2 Storage**: Object storage integration
- **Custom Configuration**: wrangler.toml setup required