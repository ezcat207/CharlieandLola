# Charlie & Lola AI Template

🎨 **Professional AI SaaS Template** - Ship any AI startup with unified theme system and enterprise-grade architecture.

![Charlie & Lola Preview](preview.png)

> This template was originally built for Charlie & Lola AI character generator but has been architected as a reusable template for any AI SaaS project.

## ✨ Features

- 🎨 **Unified Theme System** - Professional design tokens and consistent styling
- 🌍 **Multi-language Support** - English/Chinese with next-intl
- 🔐 **Complete Authentication** - Google, GitHub, Credentials + Google One Tap
- 💳 **Payment Integration** - Stripe with subscription management
- 🏗️ **Enterprise Architecture** - Scalable configuration management
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **High Performance** - Next.js 15 with optimal loading

## 🚀 Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd your-ai-project
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment**
```bash
cp .env.example .env.development
```

4. **Run development server**
```bash
pnpm dev
```

## 🎨 Customization Guide

When creating a new AI SaaS project using this template, you need to customize these key areas:

### 1. **Brand Identity & Theme**

#### **Theme Colors** (`src/app/theme.css`)
```css
:root {
  /* Update brand colors */
  --primary: oklch(0.9 0.15 85);    /* Your main brand color */
  --secondary: oklch(0.8 0.08 200); /* Secondary brand color */
  --accent: oklch(0.8 0.15 60);     /* Accent color */
  
  /* Custom brand colors */
  --brand-yellow: oklch(0.9 0.15 85);
  --brand-blue: oklch(0.8 0.08 200);
  --brand-orange: oklch(0.8 0.15 60);
  /* Add your brand colors here */
}
```

#### **Design Tokens** (`src/lib/design-system/tokens.ts`)
```typescript
export const designTokens = {
  colors: {
    primary: {
      // Update with your brand colors
      main: 'oklch(0.9 0.15 85)',
      secondary: 'oklch(0.8 0.08 200)',
      // Add your color palette
    }
  }
}
```

### 2. **Content & SEO**

#### **Landing Page Content** (`src/i18n/pages/landing/`)
- `en.json` - English content
- `zh.json` - Chinese content

**Key sections to update:**
```json
{
  "hero": {
    "title": "Your AI App Title",
    "description": "Your app description...",
    "buttons": [...],
    "highlight_text": "Your Key Feature"
  },
  "branding": {
    "title": "Your Brand Features",
    "items": [...your features...]
  },
  "seo": {
    "title": "Your App Name | Keywords",
    "description": "SEO description for your app",
    "keywords": "your, seo, keywords"
  }
}
```

#### **SEO Configuration** (Multiple files)
- `src/app/[locale]/(default)/page.tsx` - Meta tags and OpenGraph
- `src/app/sitemap.ts` - Sitemap generation
- `src/app/robots.txt` - Search engine directives
- `public/.well-known/web-identity` - FedCM configuration

### 3. **App Configuration**

#### **Global Config** (`src/lib/config/app-config.ts`)
```typescript
const defaultConfig: AppConfig = {
  // Update app info
  baseUrl: process.env.NEXT_PUBLIC_WEB_URL || 'https://yourapp.com',
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.yourapp.com',
  
  // Update business logic
  credits: {
    newUserBonus: 30,        // Welcome credits
    imageGenerationCost: 10, // Cost per generation
    maxFreeGenerations: 5,   // Free tier limit
  },
  
  // Enable/disable features
  features: {
    imageGeneration: true,    // Your main feature
    creditSystem: true,       // Payment system
    socialSharing: true,      // Social features
    // Add your features here
  }
}
```

#### **Environment Variables** (`.env.development`, `.env.production`)
```bash
# App Identity
NEXT_PUBLIC_WEB_URL="https://yourapp.com"
NEXT_PUBLIC_PROJECT_NAME="Your AI App"

# Authentication
AUTH_URL="https://yourapp.com/api/auth"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-secret"

# AI Services
OPENAI_API_KEY="your-openai-key"
KIEAI_API_KEY="your-ai-service-key"

# Payment
STRIPE_PUBLIC_KEY="your-stripe-public-key"
STRIPE_PRIVATE_KEY="your-stripe-private-key"

# Storage
STORAGE_DOMAIN="https://your-cdn-domain.com"
STORAGE_BUCKET="your-bucket"
```

### 4. **AI Functionality**

#### **AI API Integration** (`src/app/api/generate-*/route.ts`)
- Update AI service endpoints
- Modify prompt templates
- Adjust model parameters
- Update generation logic

#### **AI Models Configuration** (`src/components/blocks/imagen-wrapper/`)
- Update model options
- Modify style options
- Adjust generation parameters
- Update UI components

### 5. **Database & Models**

#### **Database Schema** (`src/db/schema/`)
- Update table structures for your use case
- Modify user model fields
- Add new tables for your features
- Update relationships

#### **API Routes** (`src/app/api/`)
- Customize generation endpoints
- Update user management
- Modify payment flows
- Add new API features

### 6. **UI Components**

#### **Reusable Components** (`src/components/`)
- Update logo and branding elements
- Modify button styles and variants
- Customize form components
- Update icon sets

#### **Block Components** (`src/components/blocks/`)
- Customize hero sections
- Update feature cards
- Modify pricing tables
- Update testimonials

### 7. **Internationalization**

#### **Messages** (`src/i18n/messages/`)
- `en.json` - English UI text
- `zh.json` - Chinese UI text

#### **Locale Configuration** (`src/i18n/locale.ts`)
```typescript
export const locales = ['en', 'zh']; // Add your locales
export const localeNames = {
  en: 'English',
  zh: '中文',
  // Add your languages
};
```

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm start           # Start production server

# Database
pnpm db:generate     # Generate migrations
pnpm db:migrate      # Run migrations
pnpm db:studio       # Open Drizzle Studio

# Deployment
pnpm cf:deploy       # Deploy to Cloudflare
```

## 🚀 Deployment

### **Vercel Deployment**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically

### **Cloudflare Deployment**
```bash
# Switch to cloudflare branch
git checkout cloudflare

# Configure environment
cp .env.example .env.production
cp wrangler.toml.example wrangler.toml

# Deploy
pnpm cf:deploy
```

## 📋 Customization Checklist

### **Essential Changes**
- [ ] Update app name and branding in `src/i18n/pages/landing/`
- [ ] Configure theme colors in `src/app/theme.css`
- [ ] Set up environment variables in `.env` files
- [ ] Update SEO content and meta tags
- [ ] Configure AI service APIs
- [ ] Set up authentication providers
- [ ] Configure payment integration
- [ ] Update database schema for your use case

### **Optional Enhancements**
- [ ] Add new AI models or features
- [ ] Customize UI components and animations
- [ ] Add additional languages
- [ ] Implement new payment tiers
- [ ] Add analytics and monitoring
- [ ] Set up email notifications
- [ ] Add social media integration

## 🏗️ Architecture Highlights

- **🎨 Unified Theme System**: Consistent design tokens across all components
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🔐 Enterprise Auth**: Multiple providers with secure session management
- **💾 Type-Safe Database**: Drizzle ORM with PostgreSQL
- **🌍 Internationalization**: Multi-language support with next-intl
- **⚡ Performance**: Optimized loading and caching strategies

## 📚 Documentation

- [Architecture Overview](CLAUDE.md)
- [Theme System Guide](src/lib/design-system/README.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Support

- **Issues**: Report bugs and feature requests
- **Discussions**: Share ideas and get help
- **Documentation**: Comprehensive guides and examples

## 📄 License

This template is available under the MIT License. See [LICENSE](LICENSE) for more information.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies.**