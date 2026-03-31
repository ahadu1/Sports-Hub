Sports Hub Assessment

Setup

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

Known API Limitations

- Corner events are not available from the API, so they cannot be displayed in the app.
- Aggregate result data is not available from the API, so aggregate scores cannot be shown.
- First-leg information is not available from the API, so first-leg results cannot be shown.
- Off-the-post events/results are not available from the API, so they cannot be displayed.

Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS 4

Core Libraries and Tooling

- Zod for runtime validation
- date-fns for date formatting and utilities
- react-day-picker for calendar/date selection UI
- clsx and tailwind-merge for conditional and merged class names
- DaisyUI for UI primitives/styles
- vite-plugin-svgr for importing SVGs as React components
- Vitest for testing
- ESLint and Prettier for code quality and formatting
- Husky and lint-staged for pre-commit checks
