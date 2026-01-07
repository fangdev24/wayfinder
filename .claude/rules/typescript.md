# TypeScript Rules

> Coding standards and best practices for TypeScript development (React, Node.js, etc.)

---

## Role

You are an expert in TypeScript development, focused on building type-safe, maintainable applications following modern best practices.

## Core Principles

1. **Strict type safety** - No `any` unless absolutely necessary
2. **Functional patterns** - Prefer pure functions and immutability
3. **Meaningful naming** - Clear intent over clever brevity
4. **Single responsibility** - Small, focused modules
5. **Explicit over implicit** - Types should document intent

---

## Code Style

### Naming Conventions

```typescript
// Interfaces/Types: PascalCase
interface UserProfile { ... }
type ApiResponse<T> = { data: T; error?: string };

// Variables/functions: camelCase
const userName = 'Sarah';
function calculateTotal(items: Item[]): number { ... }

// Constants: SCREAMING_SNAKE_CASE for true constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = process.env.API_URL;

// Boolean: is/has/should prefix
const isLoading = true;
const hasPermission = checkPermission(user);

// Event handlers: handle{Event}
const handleClick = () => { ... };
const handleSubmit = (data: FormData) => { ... };
```

### File Structure

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.styles.ts (or .module.css)
│   │   └── index.ts
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── api.ts
├── types/
│   └── index.ts
└── utils/
    └── helpers.ts
```

### Imports

```typescript
// Order: external → internal → relative → styles
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import type { User } from '@/types';

import { UserCard } from './UserCard';
import styles from './Users.module.css';
```

---

## Type Patterns

### Prefer Interfaces for Objects

```typescript
// Good: Interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Good: Type for unions, intersections, utilities
type Status = 'pending' | 'active' | 'inactive';
type UserWithRole = User & { role: Role };
type PartialUser = Partial<User>;
```

### Generic Constraints

```typescript
// Constrain generics appropriately
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Use sensible defaults
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}
```

### Discriminated Unions

```typescript
// Good: Discriminated unions for state
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Usage with exhaustive checking
function handleState(state: AsyncState<User>) {
  switch (state.status) {
    case 'idle':
      return <Idle />;
    case 'loading':
      return <Loading />;
    case 'success':
      return <UserCard user={state.data} />;
    case 'error':
      return <Error message={state.error.message} />;
  }
}
```

### Avoid `any`

```typescript
// Bad
const data: any = fetchData();

// Good: Use unknown for truly unknown data
const data: unknown = fetchData();
if (isUser(data)) {
  // Now TypeScript knows data is User
}

// Good: Use generics
function fetchData<T>(): Promise<T> { ... }
```

---

## React Patterns

### Component Definition

```typescript
// Props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Functional component
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      className={cn(styles.button, styles[variant], styles[size])}
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

### Hooks

```typescript
// Custom hook with proper typing
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const data = await api.getUser(userId);
        setUser(data);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  return { user, isLoading, error };
}
```

### Event Handlers

```typescript
// Properly typed event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ...
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    // ...
  }
};
```

---

## API Client Patterns

### Type-Safe Fetch

```typescript
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T, D>(path: string, data: D) {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

---

## Error Handling

### Custom Error Classes

```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public fields: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Result Pattern

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function safeApiCall<T>(
  fn: () => Promise<T>
): Promise<Result<T>> {
  try {
    const value = await fn();
    return { ok: true, value };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
```

---

## Testing

### Test Structure

```typescript
describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when loading', () => {
    render(<Button isLoading>Click me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

### Type Testing

```typescript
// Use type assertions to verify types
type Assert<T, U> = T extends U ? true : false;

// This will fail to compile if types don't match
const _typeCheck: Assert<ReturnType<typeof useUser>, { user: User | null }> = true;
```

---

## Verification Protocol

Before presenting code as complete:

1. `npm run lint` → No errors
2. `npm run typecheck` (or `tsc --noEmit`) → No type errors
3. `npm test` → All passing
4. `npm run build` → Compiles successfully

---

## tsconfig Recommendations

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true
  }
}
```
