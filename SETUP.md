# 🎭 CyberpunkAI Setup Guide

Transform any image into stunning cyberpunk artwork with AI!

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env.development
```

### 3. Configure AI API Key (Required)
The app uses Kie.ai Flux for better cyberpunk image generation:
```bash
KIEAI_API_KEY = "your_kie_ai_api_key_here"
```

### 4. Storage Configuration (Required for Image-to-Image)
For image-to-image transformations, configure S3-compatible storage:
```bash
STORAGE_ENDPOINT = "your_s3_endpoint"
STORAGE_ACCESS_KEY = "your_access_key"  
STORAGE_SECRET_KEY = "your_secret_key"
STORAGE_BUCKET = "your_bucket_name"
STORAGE_REGION = "auto"
STORAGE_DOMAIN = "your_cdn_domain" # optional
```

**Note**: Text-to-image works without storage. Image-to-image requires storage configuration.

### 5. Start Development Server
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your cyberpunk AI generator!

## 🎨 How to Use

1. **Upload Image**: Drag & drop or click to upload any photo
2. **AI Transform**: Click "Generate Cyberpunk Style" 
3. **Download**: Get your high-resolution cyberpunk artwork

## ⚙️ Optional Configuration

### Database (for user accounts & payments)
```bash
DATABASE_URL = "your_postgresql_url"
```

### Authentication (Google/GitHub login)
```bash
AUTH_GOOGLE_ID = "your_google_client_id"
AUTH_GOOGLE_SECRET = "your_google_client_secret"
```

### Payments (Stripe integration)
```bash
STRIPE_PUBLIC_KEY = "your_stripe_public_key"
STRIPE_PRIVATE_KEY = "your_stripe_secret_key"
```

## 🔧 Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run linting
- `pnpm db:generate` - Generate database migrations
- `pnpm db:studio` - Open database studio

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

### Cloudflare
```bash
git checkout cloudflare
pnpm cf:deploy
```

## 🎯 Features

- ✅ AI-powered cyberpunk image generation
- ✅ Drag & drop image upload
- ✅ High-resolution output (1024x1024)
- ✅ Commercial usage rights
- ✅ Credit-based pricing system
- ✅ Responsive design
- ✅ Multiple authentication options
- ✅ Payment processing

## 📧 Support

Need help? Check the documentation or reach out for support!

---

**Ready to create amazing cyberpunk art? Let's go! 🎭✨**