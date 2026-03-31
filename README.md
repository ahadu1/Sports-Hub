Sports Hub Assessment

Setup

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm run dev
```

API

- This app uses the `TheSportsDB` API.
- It primarily calls `TheSportsDB` V2 endpoints and automatically falls back to V1 endpoints when needed.
- Example base URLs used in this project:
  - `https://www.thesportsdb.com/api/v2/json`
  - `https://www.thesportsdb.com/api/v1/json`
- Main endpoints used by the app:
  - `all/leagues`
  - `lookup/league/{leagueId}`
  - `list/seasons/{leagueId}`
  - `schedule/league/{leagueId}/{season}`
  - `lookup/event/{eventId}`
  - `search/team/{teamName}`

API Data Used In The UI

- Most league and team logos shown in the app come from `TheSportsDB` API responses.
- League names are retrieved from fields such as `strLeague`.
- Season values are retrieved from fields such as `strSeason` and `strCurrentSeason`.
- League logos/badges are retrieved from fields such as `strLeagueBadge` and `strBadge` (with `strLogo` also supported in the API schema).
- Team logos/badges are retrieved from match and team lookup responses, including `strHomeTeamBadge`, `strAwayTeamBadge`, `strBadge`, `strTeamBadge`, and `strLogo`.
- The app also includes a few local static brand assets for the site chrome, but most competition and team imagery is API-driven.

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
