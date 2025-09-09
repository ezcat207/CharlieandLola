# Task Completion Checklist

When completing any development task in this project, ensure the following steps are completed:

## Code Quality Checks

### 1. Linting and Formatting
```bash
# Run ESLint to check for code issues
pnpm lint

# If there are fixable issues, run:
pnpm lint --fix
```

### 2. TypeScript Compilation
```bash
# Verify no TypeScript errors
npx tsc --noEmit
```

### 3. Build Verification
```bash
# Ensure the project builds successfully
pnpm build
```

## Testing and Validation

### 4. Manual Testing
- Test the changed functionality in development mode
- Verify responsive design on different screen sizes
- Test user interactions and form submissions
- Check error handling scenarios

### 5. Browser Compatibility
- Test in Chrome, Firefox, and Safari
- Verify mobile responsiveness
- Check for console errors or warnings

### 6. Database Changes
If database schema changes were made:
```bash
# Generate new migrations
pnpm db:generate

# Apply migrations (if applicable)
pnpm db:migrate

# Verify schema in Drizzle Studio
pnpm db:studio
```

## Performance and Security

### 7. Performance Checks
```bash
# Run bundle analysis to check for size increases
pnpm analyze
```

### 8. Security Validation
- Ensure no secrets or API keys are hardcoded
- Verify proper input validation and sanitization
- Check authentication and authorization logic
- Validate file upload restrictions and size limits

### 9. Accessibility
- Verify proper ARIA labels and semantic HTML
- Test keyboard navigation
- Check color contrast ratios
- Ensure screen reader compatibility

## Internationalization

### 10. Translation Updates
If UI text was added or modified:
- Add new translations to `src/i18n/messages/` files
- Verify both English and Chinese translations
- Test language switching functionality

## Environment and Configuration

### 11. Environment Variables
- Verify all required environment variables are documented
- Update `.env.example` if new variables were added
- Ensure sensitive data is not committed to version control

### 12. Documentation Updates
- Update relevant comments in code
- Update CLAUDE.md if architecture changes were made
- Document any new API endpoints or significant functions

## Final Verification

### 13. Development Server
```bash
# Start development server and verify functionality
pnpm dev
```

### 14. Production Build Test
```bash
# Test production build locally
pnpm build && pnpm start
```

### 15. Git Best Practices
```bash
# Review changes before committing
git diff

# Stage only relevant changes
git add <specific-files>

# Write descriptive commit message
git commit -m "feat: descriptive message about changes"
```

## Deployment Readiness

### 16. Pre-deployment Checklist
- [ ] All tests pass
- [ ] Build completes successfully  
- [ ] No console errors in browser
- [ ] Database migrations ready (if applicable)
- [ ] Environment variables configured
- [ ] Performance impact assessed

### 17. Post-deployment Monitoring
- Verify functionality in production environment
- Monitor for any errors in application logs
- Check performance metrics
- Validate user flows work end-to-end

## Critical Areas to Double-Check

### localStorage Issues
When working with localStorage (common issue area):
- Implement proper error handling for quota exceeded
- Add fallbacks for localStorage unavailability
- Consider data size limitations
- Test in incognito/private browsing mode

### API Integration
When modifying API calls:
- Verify proper error handling for all HTTP status codes
- Test with various network conditions
- Validate request/response data structures
- Check rate limiting and retry logic

### User Authentication
When touching auth-related code:
- Test sign-in/sign-out flows
- Verify session management
- Check protected route access
- Validate user data persistence

### Image Processing
When modifying image handling:
- Test with various image formats and sizes
- Verify file size limitations
- Check upload progress indicators
- Validate image display and download functionality