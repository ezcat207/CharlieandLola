# Development Commands

## Core Development Commands
```bash
# Start development server with Turbopack
pnpm dev

# Build for production
pnpm build  

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Analyze bundle size
pnpm analyze
```

## Database Operations
```bash
# Generate database migrations with Drizzle Kit
pnpm db:generate

# Run database migrations
pnpm db:migrate

# Open Drizzle Studio for database management
pnpm db:studio

# Push schema changes directly to database (dev only)
pnpm db:push
```

## Deployment Commands

### Cloudflare Deployment
```bash
# Generate TypeScript types for Cloudflare environment
pnpm cf:typegen

# Build and preview Cloudflare deployment  
pnpm cf:preview

# Build and deploy to Cloudflare
pnpm cf:deploy

# Build and upload to Cloudflare
pnpm cf:upload
```

### Docker Commands
```bash
# Build Docker image
docker build -f Dockerfile -t cyberpunk-ai-generator:latest .

# Alternative build command from package.json
pnpm docker:build
```

## Environment Setup
```bash
# Copy environment template
cp .env.example .env.development

# For Cloudflare deployment
cp .env.example .env.production  
cp wrangler.toml.example wrangler.toml
```

## System Utilities (macOS/Darwin)

### File Operations
```bash
# List directory contents
ls -la

# Find files by pattern  
find . -name "*.tsx" -type f

# Search within files
grep -r "localStorage" src/

# Better search with ripgrep (if available)
rg "localStorage" src/
```

### Git Operations
```bash
# Check repository status
git status

# View recent commits
git log --oneline -10

# Create new branch
git checkout -b feature/fix-localstorage

# View differences
git diff
```

### Package Management
```bash
# Install dependencies
pnpm install

# Add new dependency
pnpm add <package-name>

# Add dev dependency  
pnpm add -D <package-name>

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

## Debugging Commands
```bash
# Check Node.js version
node --version

# Check npm/pnpm version
pnpm --version

# Verify TypeScript compilation
npx tsc --noEmit

# Check port usage (if development server won't start)
lsof -ti:3000
```

## Database Debugging
```bash
# Connect to local database (if applicable)
psql $DATABASE_URL

# View database schema
pnpm db:studio

# Reset database (CAUTION: destroys data)
# pnpm db:push --force
```

## Performance Monitoring
```bash
# Bundle analysis
pnpm analyze

# Build size check
pnpm build
ls -la .next/static/chunks/
```

## Testing (when available)
```bash
# Note: No test scripts currently defined in package.json
# Common patterns would be:
# pnpm test          # Run all tests
# pnpm test:watch    # Run tests in watch mode
# pnpm test:coverage # Run with coverage report
```