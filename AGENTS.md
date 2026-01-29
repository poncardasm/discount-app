# Agent Guidelines for discount-app

This document provides coding agents with essential information about build commands, code style, and development practices for this Astro + Svelte 5 project.

## Project Overview

- **Framework**: Astro 5.17+ with Svelte 5 integration
- **Styling**: Tailwind CSS v4 (using @tailwindcss/vite)
- **Language**: TypeScript (strict mode enabled)
- **Package Manager**: pnpm
- **Node Version**: Use latest LTS

## Build & Development Commands

### Common Commands
```bash
pnpm install           # Install dependencies
pnpm dev              # Start dev server at localhost:4321
pnpm build            # Build production site to ./dist/
pnpm preview          # Preview production build locally
pnpm astro check      # Run TypeScript type checking
```

### Testing
**Note**: No test framework is currently configured in this project. If tests are needed, consider adding Vitest.

## Project Structure

```
/
├── public/           # Static assets (images, fonts, etc.)
├── src/
│   ├── components/   # Svelte components (.svelte)
│   ├── layouts/      # Astro layout components (.astro)
│   ├── lib/          # Shared utilities and UI components
│   │   ├── components/ui/  # Reusable UI components (button, input, card, etc.)
│   │   └── utils.ts  # Utility functions (cn helper, types)
│   ├── pages/        # File-based routing (.astro files)
│   ├── styles/       # Global CSS files
│   └── utils/        # App-specific utility functions
├── astro.config.mjs  # Astro configuration
├── svelte.config.js  # Svelte configuration
└── tsconfig.json     # TypeScript configuration
```

## Code Style Guidelines

### TypeScript

- **Strict Mode**: All strict TypeScript options are enabled
- **Type Annotations**: Always provide explicit types for function parameters and return values
- **No Implicit Any**: Never use implicit `any` types
- **Interfaces vs Types**: Use `interface` for object shapes, `type` for unions/intersections
- **No Unused Variables**: Remove all unused locals and parameters

Example:
```typescript
// Good
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

// Bad - missing return type
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
```

### Imports

- **Path Aliases**: Use configured path aliases for cleaner imports
  - `@/*` → `./src/*`
  - `@components/*` → `./src/components/*`
  - `@layouts/*` → `./src/layouts/*`
  - `@utils/*` → `./src/utils/*`
  - `$lib/*` → `./src/lib/*`

- **Import Order**: Group imports logically
  1. External dependencies (React, Svelte, Astro, etc.)
  2. Internal utilities and types
  3. Components
  4. Styles

Example:
```typescript
import { onMount } from 'svelte';
import type { Snippet } from 'svelte';
import { cn, type WithElementRef } from '$lib/utils';
import Button from '$lib/components/ui/button.svelte';
```

### Svelte 5 Components

- **Runes**: Use Svelte 5 runes (`$state`, `$derived`, `$props`, `$bindable`, `$effect`)
- **Props Interface**: Define props interface for type safety
- **Module Script**: Use `<script lang="ts" module>` for exports like types and variants
- **Event Handlers**: Use inline event handlers with `on:` prefix (e.g., `oninput`, `onclick`)

Example:
```svelte
<script lang="ts">
  import { cn } from '$lib/utils';
  
  interface Props {
    id?: string;
    class?: string;
    value?: string | number;
    oninput?: (event: Event) => void;
  }
  
  let {
    id,
    class: className,
    value,
    oninput,
    ...restProps
  }: Props = $props();
</script>

<input
  {id}
  {value}
  {oninput}
  class={cn('base-classes', className)}
  {...restProps}
/>
```

### Astro Components

- **Props Interface**: Define TypeScript interface for component props
- **Destructuring**: Use destructuring with defaults in frontmatter
- **Client Directives**: Use `client:load` for interactive Svelte components

Example:
```astro
---
import Layout from '@layouts/Layout.astro';
import Component from '@components/Component.svelte';

interface Props {
  title?: string;
  description?: string;
}

const { 
  title = 'Default Title',
  description = 'Default description'
} = Astro.props;
---

<Layout {title} {description}>
  <Component client:load />
</Layout>
```

### Styling

- **Tailwind CSS v4**: Use Tailwind utility classes
- **Custom Classes**: Avoid creating custom CSS classes; prefer Tailwind utilities
- **Class Merging**: Use `cn()` helper from `$lib/utils` for conditional classes
- **Dark Mode**: Use Tailwind's dark mode variant (e.g., `dark:bg-gray-800`)
- **Design Tokens**: CSS variables are defined in `src/styles/global.css` using `@theme`

### Naming Conventions

- **Components**: PascalCase (e.g., `DiscountCalculator.svelte`, `ThemeToggle.svelte`)
- **Files**: kebab-case for utilities (e.g., `formatCurrency.ts`)
- **Variables**: camelCase (e.g., `isDark`, `discountPercent`)
- **Functions**: camelCase with descriptive names (e.g., `formatCurrency`, `toggleTheme`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Interfaces/Types**: PascalCase (e.g., `ButtonProps`, `WithElementRef`)

### Error Handling

- **Validation**: Validate user inputs and constrain values (e.g., `Math.max(0, value)`)
- **Fallbacks**: Provide sensible defaults (e.g., `parseFloat(value) || 0`)
- **Type Safety**: Let TypeScript catch errors at compile time

### Comments & Documentation

- **JSDoc**: Use JSDoc for exported functions
- **Component Sections**: Use HTML comments to section component markup
- **Inline Comments**: Explain non-obvious logic, not obvious code

Example:
```typescript
/**
 * Format a number as currency (EUR)
 * @param amount - The numeric amount to format
 * @returns Formatted currency string with EUR symbol
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}
```

## Best Practices

1. **Component Composition**: Break down complex components into smaller, reusable pieces
2. **Accessibility**: Include proper ARIA labels (e.g., `aria-label` for icon buttons)
3. **Performance**: Use `client:load` directive judiciously for Svelte components
4. **Type Safety**: Never use `any` type; define proper interfaces
5. **Reactive State**: Use `$derived` for computed values instead of manual updates
6. **Immutability**: Prefer `const` over `let` where possible

## Git & Version Control

- Ignored directories: `dist/`, `.astro/`, `node_modules/`, `.vscode/`, `docs/`
- Environment files: `.env` files are gitignored
- This is a git repository - commit frequently with descriptive messages
