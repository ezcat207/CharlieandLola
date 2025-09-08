# Task Completion Checklist

When completing any coding task, ensure you run the following commands:

## Required Checks
1. **Lint the code**: `pnpm lint`
   - This runs ESLint and checks for code quality issues
   - Must pass before considering task complete

2. **Build the project**: `pnpm build` 
   - Ensures TypeScript compilation works
   - Catches build-time errors
   - Verifies all imports and dependencies

## Database Changes
If you modified database schema or models:
1. **Generate migrations**: `pnpm db:generate`
2. **Run migrations**: `pnpm db:migrate` 
3. **Test with database studio**: `pnpm db:studio` (optional)

## Environment Requirements
- **OPENAI_API_KEY** - Required for cyberpunk image generation
- **Database connection** - Required if working with user data
- **Storage configuration** - Required for image-to-image transformations

## Testing Approach
- **No formal test suite** detected in the project
- **Manual testing** via development server: `pnpm dev`
- **API testing** via debug/apitest.http file
- **Browser testing** for UI components

## Code Quality
- Follow the established patterns in existing components
- Use TypeScript strictly - all variables should be typed
- Follow the component structure patterns
- Use established utility functions in `src/lib/`

## Performance Considerations
- Use `pnpm analyze` to check bundle size if adding significant dependencies
- Optimize images for web if adding new assets
- Consider loading states for async operations

## Pre-deployment
1. Verify environment variables are set
2. Test critical user flows manually
3. Check console for errors/warnings
4. Ensure responsive design works on mobile

Since this project doesn't have automated tests, thorough manual testing and linting are essential for quality assurance.