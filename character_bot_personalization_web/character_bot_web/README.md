# Character Bot Web

Character Bot Web is a React frontend for creating and personalizing a Telegram character bot.

The application lets a user log in or register, enter the name and description of a character, send that information to a backend API, and display the generated bot URL returned by the server.

## Features

- Login and register views.
- Phone input that accepts only numbers.
- Loading animation while waiting for login, register, and character creation API responses.
- Character personalization form.
- Generated bot URL display.
- Vite proxy configuration for connecting the frontend with a local backend.

## Technologies

- React
- TypeScript
- Vite
- Tailwind CSS
- Oxlint

## Project Structure

```txt
character_bot_web/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   └── TelegramLogo.tsx
│   ├── pages/
│   │   ├── PersonalizationPage.tsx
│   │   └── LoginPage.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Main Files

### `src/App.tsx`

Controls the main flow of the application.

If there is no authenticated user, it shows `LoginPage`. After the user logs in or registers, it shows `PersonalizationPage`.

### `src/pages/LoginPage.tsx`

Contains the first screen of the app.

This page includes:

- The Character Bot intro screen.
- Login button.
- Register button.
- Login/register modal form.
- Phone number cleanup.
- Loading state while waiting for the login or register API response.

The page sends requests to:

```txt
POST /api/login
POST /api/registrer
```

### `src/pages/PersonalizationPage.tsx`

Contains the form used to create a personalized character bot.

The user enters:

- Character name.
- Character description.

The page sends this data to:

```txt
POST /api/characters
```

The backend should return a response with a bot URL:

```json
{
  "url": "https://t.me/example_bot"
}
```

### `src/components/TelegramLogo.tsx`

Reusable Telegram logo component.

### `src/index.css`

Imports Tailwind CSS.

### `vite.config.ts`

Configures Vite, React, Tailwind CSS, and the API proxy.

The frontend sends `/api` requests to:

```txt
http://localhost:8000
```

For example, this frontend request:

```txt
/api/login
```

is forwarded to:

```txt
http://localhost:8000/api/login
```

## Backend Requirement

This repository contains only the frontend.

To use the complete application, you need a backend running on:

```txt
http://localhost:8000
```

Expected backend endpoints:

```txt
POST /api/login
POST /api/registrer
POST /api/characters
```

## How To Download

Clone the repository:

```bash
git clone <repository-url>
cd character_bot_web
```

If you downloaded the project as a ZIP file, extract it and open the `character_bot_web` folder.

Current local project path:

```txt
C:\Users\User\Desktop\telegram_bot\character_bot_personalization_web\character_bot_web
```

## How To Install

Install the dependencies:

```bash
npm install
```

If you use pnpm, you can also run:

```bash
pnpm install
```

## How To Execute In Development

First, start the backend server on:

```txt
http://localhost:8000
```

Then start the frontend:

```bash
npm run dev
```

Or with pnpm:

```bash
pnpm dev
```

Open the local URL shown in the terminal. Usually it is:

```txt
http://localhost:5173
```

## How To Build

Create a production build:

```bash
npm run build
```

The production files will be generated in:

```txt
dist/
```

## How To Preview The Production Build

After building, run:

```bash
npm run preview
```

Then open the URL shown in the terminal.

## Available Scripts

```txt
npm run dev      Start the development server
npm run build    Build the project for production
npm run preview  Preview the production build
npm run lint     Run the linter
```

## Notes

- The register mode value is currently `registrer`.
- The phone field removes non-number characters automatically.
- The user returned by login or register is saved in `localStorage`.
- The character creation page displays the generated URL returned by the backend.

