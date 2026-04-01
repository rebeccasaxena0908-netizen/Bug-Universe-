# Bug Universe 🐛

A full-stack Code Review & Bug Tracking System with a space theme.

## Tech Stack
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- AI: Google Gemini API

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI, JWT_SECRET, PORT, GEMINI_API_KEY
node server.js
```

### Frontend
```bash
npm install
npm run dev
```

## Features
- Real-time bug tracking dashboard
- Bug lifecycle management
- AI-powered code review with Gemini
- JWT authentication with role system
- Comment and reply system
- Smart severity auto-detection
