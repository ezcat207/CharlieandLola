# CharlieandLola Project Overview

## Project Purpose
**CharlieandLola** is an AI-powered image generation web application that transforms user-uploaded photos into Charlie and Lola cartoon style characters. The app is built as a SaaS platform with a freemium model.

### Key Features
- **Image Style Transfer**: Transform uploaded photos into Charlie and Lola cartoon style
- **Multi-language Support**: English and Chinese internationalization
- **User Authentication**: Google OAuth, GitHub OAuth, and Google One Tap
- **Credit-based System**: Freemium model with credit consumption for premium features
- **File Upload**: Support for multiple image uploads (up to 5 images)
- **Payment Integration**: Stripe integration for subscription management
- **Admin Dashboard**: User and system management interface

### Target Audience
- Parents and children who love Charlie and Lola characters
- Users wanting to transform family photos into cartoon style
- Content creators looking for unique character illustrations

### Business Model
- **Free Tier**: Basic image generation with registration requirement for downloads
- **Premium Tier**: Higher quality, priority access, no queue restrictions
- **Credit System**: Pay-per-use model for advanced features

### Core Functionality
The main feature transforms user-uploaded images using Google's Gemini 2.5 Flash Image Preview API to create Charlie and Lola style character illustrations while preserving the subject's original features, clothing, and pose.

### Current Status
- **Version**: 2.6.0
- **Deployment**: Vercel (primary) with Cloudflare option
- **Database**: PostgreSQL with Drizzle ORM
- **AI Provider**: Google Gemini for image generation