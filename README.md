# Memory Saver - Frontend Web Application

A cloud-native single-page application built with React and Vite for the Memory Saver platform. It provides the user-facing interface for the enterprise microservices ecosystem and is deployed on Google Cloud Infrastructure using Firebase Hosting.

## Student & Project Information

| Field | Details |
| :--- | :--- |
| Student Name | Nethmi Nanayakkara |
| Student ID | 241722047 |
| GCP Project ID | `nethmi-project` |
| Live Deployed URL | https://memory-saver-e56b8.web.app/ |
| Module | ITS 2130 - Enterprise Cloud Architecture |

## Overview & Architecture

The frontend communicates with backend microservices through a centralized Spring Cloud API Gateway hosted behind a GCP External HTTP(S) Load Balancer. It demonstrates end-to-end cloud-native integrations for:

- user profile and favorites management backed by Cloud SQL
- travel destination and itinerary tracking
- direct media uploads to Google Cloud Storage buckets
- community reviews and interactive ratings

## Technology Stack

- React / Vite
- JavaScript (ES6+) / JSX
- CSS3, Bootstrap, and icons
- Axios for HTTP requests
- Firebase Hosting for deployment
- Firebase Tools CLI for build and deploy workflows

## Live Deployment Details

- Deployment model: Serverless / PaaS on Google Cloud via Firebase Hosting
- Backend API gateway target: http://8.233.86.133
- Live production URL: https://memory-saver-e56b8.web.app/

## Local Setup & Development

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/NethmiDN/Web_Application_Repo.git
cd Web_Application_Repo
```

### Install Dependencies

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually http://localhost:5173.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

## API Configuration

The frontend points to the public gateway configured in [src/services/api.js](src/services/api.js).

```js
const GATEWAY_URL = 'http://8.233.86.133';
```

If the backend is unavailable, the app falls back to in-memory mock data so the UI stays usable for demos and local development.

## Firebase Deployment

This project is configured for Firebase Hosting.

```bash
firebase deploy --only hosting
```

To preview the production build locally:

```bash
npm run build
npm run preview
```

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
└── services/
	└── api.js
```

## Notes

- The frontend is a client-only application and depends on backend services for full functionality.
- Mock mode is available when the gateway is offline, which helps with demos and development.
- The public gateway IP is currently hard-coded in the API service layer for simplicity.
