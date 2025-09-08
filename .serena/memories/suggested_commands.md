# Essential Development Commands

## Core Development
- `pnpm dev` - Start development server with turbopack  
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint (primary linting tool)

## Database Operations  
- `pnpm db:generate` - Generate database migrations with Drizzle Kit
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio for database management
- `pnpm db:push` - Push schema changes directly to database

## Cloudflare Deployment
- `pnpm cf:preview` - Build and preview Cloudflare deployment  
- `pnpm cf:deploy` - Build and deploy to Cloudflare
- `pnpm cf:upload` - Build and upload to Cloudflare

## Analysis & Optimization
- `pnpm analyze` - Analyze bundle size

## Container
- `docker build -f Dockerfile -t shipany-template-one:latest .` - Build Docker image

## System Commands (macOS)
- `ls` - List directory contents
- `find` - Search files and directories  
- `grep` - Search text patterns
- `git` - Version control operations
- Standard Unix commands work on Darwin (macOS)

## Package Management
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new dependency
- `pnpm remove <package>` - Remove dependency