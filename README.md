# My Memories Frontend

A React + Vite frontend for a travel memory platform where users can create and explore memorable trips, blog posts, favorites, reviews, and uploaded media.

## Overview

This app helps users:

- manage travel memories and events
- browse destination details and travel stories
- add and remove favorites
- create and view blog posts related to destinations
- upload photos for trips and events
- review destination experiences
- switch between users and profiles

The frontend is designed to work with a backend API gateway and gracefully falls back to in-memory mock data when the gateway is unavailable.

## Tech Stack

- React 18
- Vite
- JavaScript
- Axios for API requests
- Firebase Hosting
- Lucide React icons

## Project Structure

```bash
src/
├── App.jsx
├── index.css
├── main.jsx
├── components/
│   ├── BlogList.jsx
│   ├── BlogModal.jsx
│   ├── EventCard.jsx
│   ├── EventDetailModal.jsx
│   ├── EventModal.jsx
│   ├── Gallery.jsx
│   ├── MediaUploader.jsx
│   ├── Navbar.jsx
│   ├── ReviewSection.jsx
│   ├── Toast.jsx
│   └── UserProfile.jsx
├── services/
│   └── api.js
└── assets/
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ installed
- npm installed
- Firebase CLI installed if you plan to deploy

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

## Available Scripts

```bash
npm run dev     # start Vite dev server
npm run build   # create production build
npm run preview # preview production build locally
```

## API Configuration

The app uses the API gateway configured in `src/services/api.js`.

```js
const GATEWAY_URL = 'http://8.233.86.133';
```

If the backend is offline or unreachable, the app automatically uses mock data so the UI remains functional for demos and local development.

## Firebase Deployment

This project is configured for Firebase Hosting.

### Deploy

```bash
firebase deploy --only hosting
```

### Local preview of the production build

```bash
npm run build
npm run preview
```

## Notes

- The project is a frontend-only client and depends on backend services for full live functionality.
- The mock mode is useful for development, demos, and testing when the gateway is unavailable.
- The app currently uses a public gateway address and in-memory fallback data for offline scenarios.

## License

This project does not currently include a license file. If needed, add one before publishing or sharing the code publicly.
