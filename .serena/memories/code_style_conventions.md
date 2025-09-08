# Code Style and Conventions

## TypeScript Configuration
- **Strict Mode**: Enabled for maximum type safety
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports
- **Target**: ES2017 for broad browser compatibility
- **Module Resolution**: `bundler` for modern bundling tools

## File and Directory Naming
- **Components**: PascalCase (e.g., `ImagenClient.tsx`)
- **Files**: kebab-case for most files (e.g., `imagen-client.tsx`)
- **Directories**: kebab-case (e.g., `imagen-wrapper/`)
- **API Routes**: kebab-case (e.g., `generate-cyberpunk/`)

## Component Structure

### React Components
```typescript
// Interface definitions first
interface ComponentProps {
  prop: string;
}

// Default export function component
export default function ComponentName({ prop }: ComponentProps) {
  // Hooks at the top
  const [state, setState] = useState<string>('');
  
  // Helper functions
  const handleAction = () => {
    // Implementation
  };
  
  // Return JSX
  return (
    <div className="css-classes">
      {/* Content */}
    </div>
  );
}
```

### API Routes  
```typescript
// Named exports for HTTP methods
export async function GET(request: Request) {
  try {
    // Implementation
    return respData(result);
  } catch (error) {
    return respErr("Error message");
  }
}

export async function POST(request: Request) {
  // Similar structure
}
```

## Styling Conventions

### Tailwind CSS
- **Utility Classes**: Primary styling method
- **Component Composition**: Use `cn()` utility for conditional classes
- **Custom Colors**: Theme-specific colors (e.g., `cl-yellow`, `cl-red`)
- **Responsive Design**: Mobile-first approach with breakpoint prefixes

### Example Class Usage
```typescript
className={cn(
  "base-classes",
  condition ? "conditional-classes" : "alternative-classes",
  "additional-classes"
)}
```

## State Management

### Local State  
- **useState**: For component-local state
- **useEffect**: For side effects and lifecycle management
- **Custom Hooks**: Extract reusable logic (e.g., `useUserCredits`)

### Data Persistence
```typescript
// localStorage with error handling
const [state, setState] = useState<string[]>(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEYS.key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved data:', e);
      }
    }
  }
  return [];
});
```

## Error Handling

### API Responses
```typescript
// Success response
return respData({
  imageUrl: url,
  message: "Success message"
});

// Error response  
return respErr("User-friendly error message");

// Error with specific code
return respErr("Error message", 'ERROR_CODE');
```

### Component Error Handling
```typescript
try {
  // Risky operation
  const result = await apiCall();
} catch (error: any) {
  console.error('Operation failed:', error);
  toast.error("User-friendly error message");
}
```

## Internationalization

### Translation Usage
```typescript
// Hook usage
const t = useTranslations('namespace');

// Message with parameters
const message = formatMessage(t.template, { 
  param: value 
});

// Direct usage
<h1>{t.title.main}</h1>
```

### Translation File Structure
```json
{
  "namespace": {
    "key": "Translation text",
    "template": "Text with {param}",
    "nested": {
      "subkey": "Nested translation"
    }
  }
}
```

## Form Handling

### React Hook Form Pattern
```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  setValue
} = useForm<FormData>();

const onSubmit = (data: FormData) => {
  // Handle form submission
};
```

## Database Interactions

### Drizzle ORM Patterns
```typescript
// Schema definition
export const tableName = pgTable('table_name', {
  id: serial('id').primaryKey(),
  field: varchar('field', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

// Query usage
const results = await db
  .select()
  .from(tableName)
  .where(eq(tableName.field, value));
```

## Import Organization
```typescript
// External libraries first
import React from 'react';
import { NextRequest } from 'next/server';

// Internal utilities and types
import { cn } from '@/lib/utils';
import type { CustomType } from '@/types';

// Components
import { Button } from '@/components/ui/button';
```

## Logging and Debugging
```typescript
// Console logging with context
console.log("=== Operation Details ===");
console.log("Parameter:", value);
console.log("========================");

// Error logging
console.error('Operation failed:', error);

// Warning for non-critical issues
console.warn('Non-critical issue:', warning);
```

## Constants and Configuration
```typescript
// Grouped constants
const STORAGE_KEYS = {
  uploadedImages: 'app_uploaded_images',
  selectedStyle: 'app_selected_style'
} as const;

// Environment variable usage
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is required');
}
```