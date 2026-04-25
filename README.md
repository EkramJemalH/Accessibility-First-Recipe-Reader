# HCI Project

A Next.js-based Human-Computer Interaction (HCI) frontend project built with React, Tailwind CSS, and accessible UI components.

## Overview

This project demonstrates a modern UI with a strong accessibility focus. It includes:

- Accessible design patterns and components
- Theme support with dark/light mode
- Responsive layout tailored for mobile and desktop
- A shared component library using Radix UI and Tailwind CSS
- Custom hooks for accessibility preferences and mobile detection

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Radix UI
- TypeScript
- Zod
- React Hook Form
- Sonner for toast notifications

## Project Structure

- `app/` - Main Next.js application files
- `app/components/` - Top-level UI and layout components
- `components/ui/` - Reusable UI components such as buttons, alerts, accordions, and dialogs
- `hooks/` - Custom React hooks for accessibility, mobile detection, and toast handling
- `lib/` - Utility modules and shared recipe definitions
- `styles/` - Global CSS and theme styles
- `public/` - Static assets

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm dev
```

3. Open the app:

```text
http://localhost:3000
```

## Build and Production

Build the application for production:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Linting

Run ESLint across the project:

```bash
pnpm lint
```

## Notes

- The project uses a component-driven structure to keep UI elements reusable and consistent.
- Accessibility preferences are managed via custom hooks and wrapper components.
- Theme support is provided through a dedicated theme provider component.

## Contributing

Feel free to extend the component library with additional accessible UI controls, optimize mobile layouts, or add new interactive patterns.

## License

This repository is currently private and intended for learning and development.
