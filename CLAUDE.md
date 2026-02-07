# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16.1.3 with App Router
- **UI**: React 19, Tailwind CSS 4, Shadcn/ui (New York style)
- **Language**: TypeScript (strict mode)
- **Icons**: Lucide React

## Architecture

### App Router Structure
This project uses Next.js App Router with file-based routing in the `app/` directory. Server Components are the default.

### Component System
UI components are in `components/ui/` using Shadcn/ui patterns:
- Components use class-variance-authority (CVA) for variant management
- Radix UI primitives provide accessibility
- Add new Shadcn components via: `npx shadcn@latest add <component-name>`

### Styling
- Tailwind CSS v4 with CSS variables for theming in `app/globals.css`
- Dark mode supported via `.dark` class
- Use the `cn()` utility from `lib/utils.ts` to merge Tailwind classes safely

### Path Aliases
Import with `@/` prefix (e.g., `@/components/ui/button`, `@/lib/utils`)
