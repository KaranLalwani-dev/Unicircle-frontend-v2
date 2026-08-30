# Unicircle Frontend

The web client for **Unicircle**, a community platform for discovering people, creating groups around shared interests, and managing requests to join them.

> This repository contains the frontend. The API and server-side application live in the [Unicircle backend repository](https://github.com/KaranLalwani-dev/Unicircle).

## Features

- Create an account and sign in with token-based authentication
- Discover and filter groups by interests, year, and other available criteria
- View group details, create groups, and request to join them
- Manage created and joined groups, including incoming join requests
- Update the signed-in user's profile
- Responsive landing page and interface built with reusable UI components

## Screenshots

<img width="1710" height="1107" alt="Unicircle landing page" src="https://github.com/user-attachments/assets/ca07eca8-fada-4b98-bbee-7fc842bdaa46" />

<img width="1710" height="1107" alt="Unicircle authentication screen" src="https://github.com/user-attachments/assets/09943eb6-625e-46d7-865b-f20e19df066b" />

<img width="1710" height="1107" alt="Unicircle group discovery screen" src="https://github.com/user-attachments/assets/5885cab8-9e3c-47b7-8fcd-4e6958874ad3" />

<img width="1710" height="1106" alt="Unicircle group details screen" src="https://github.com/user-attachments/assets/8c82c661-467a-46b6-bfa1-7679c6df4eef" />

<img width="1710" height="1107" alt="Unicircle group creation screen" src="https://github.com/user-attachments/assets/5890a8fb-a702-41da-9b50-05ca3301714c" />

<img width="1710" height="1107" alt="Unicircle activity screen" src="https://github.com/user-attachments/assets/255ccabb-929b-4bad-a782-eb612007e880" />

<img width="1710" height="1107" alt="Unicircle profile screen" src="https://github.com/user-attachments/assets/6f681b3f-1bdc-4f9c-b978-5a00aa19f657" />

<img width="1710" height="1107" alt="Unicircle mobile interface" src="https://github.com/user-attachments/assets/414157b7-91f2-4374-8931-b312be58d0b0" />

<img width="1280" height="736" alt="Unicircle application screen" src="https://github.com/user-attachments/assets/0926244c-e4e2-4f3a-bf73-b9281ff138c6" />

## Tech stack

- React 18 and TypeScript
- Vite
- Tailwind CSS and Radix UI
- React Router
- TanStack Query
- Vitest and Testing Library
- Vercel Analytics

## Prerequisites

- Node.js 18 or later
- npm
- A running instance of the [Unicircle backend](https://github.com/KaranLalwani-dev/Unicircle)

## Getting started

1. Clone this repository and install dependencies:

   ```bash
   git clone https://github.com/KaranLalwani-dev/Unicircle-frontend-v2.git
   cd Unicircle-frontend-v2
   npm install
   ```

2. Configure the API URL. Create a `.env.local` file:

   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

   When this variable is omitted during development, Vite proxies `/api` requests to `http://localhost:8080` automatically. For a deployed frontend, set `VITE_API_URL` to the backend's public `/api` URL.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open the URL printed by Vite, usually `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build. |
| `npm run build:dev` | Build using development mode. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run test` | Run the test suite once. |
| `npm run test:watch` | Run tests in watch mode. |

## API integration

The client reads `VITE_API_URL` and falls back to `/api`. Requests include the saved authentication token as a Bearer token. The frontend uses the backend for:

- Authentication: `/auth/login` and `/auth/signup`
- Current user and profile: `/users/me`
- Groups and join requests: `/groups` and `/requests`
- Tags and available years: `/tags` and `/utils/years`

See the [backend repository](https://github.com/KaranLalwani-dev/Unicircle) for API setup, server configuration, and endpoint details.

## Project structure

```text
src/
├── components/     # App shell, layout, group components, and UI primitives
├── context/        # Authentication state
├── hooks/          # Shared React hooks
├── lib/            # API client and utilities
├── pages/          # Landing, login, discover, activity, and profile pages
├── test/           # Vitest setup and tests
└── types/          # Shared TypeScript types
```

## Deployment

Build the app with `npm run build`. The static output is generated in `dist/` and can be deployed to any static hosting provider. Configure `VITE_API_URL` in that provider's build environment to point to the deployed backend API.

## License

No license has been specified for this project.
