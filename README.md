# TaskFlow - Task Management System

A full-stack task management application built with **Next.js** (frontend) and **NestJS** (backend).

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4
- **Backend**: NestJS 10, TypeScript, MongoDB (Mongoose)
- **Auth**: JWT with Guest Login support
- **State Management**: Zustand
- **Styling**: Tailwind CSS + CSS custom properties for theming

## Project Structure

```
AbleSpace/
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # App Router pages & layout
│   │   ├── components/
│   │   │   ├── auth/     # Login/Register components
│   │   │   ├── layout/   # Sidebar, Dashboard layout
│   │   │   └── tasks/    # Task board, cards, modals
│   │   ├── lib/       # API client, utils, theme provider
│   │   ├── store/     # Zustand state management
│   │   └── types/     # TypeScript type definitions
│   └── package.json
├── backend/           # NestJS backend application
│   ├── src/
│   │   ├── auth/      # Auth module (JWT, guest login)
│   │   ├── tasks/     # Tasks module (CRUD)
│   │   ├── users/     # Users module
│   │   └── common/    # Shared decorators, guards, pipes
│   └── package.json
└── README.md
```

## Setup & Running

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas cloud)

### 1. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment

**Backend** (`.env` file already created):
```
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`.env.local` file already created):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Run the Application

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api

## Features

### Authentication
- **Guest Login**: One-click access without registration
- **User Registration**: Create an account with username/password
- **JWT Authentication**: Secure token-based auth

### Task Management
- Create, edit, and delete tasks
- Set status (Todo, In Progress, Completed)
- Set priority (Low, Medium, High, Urgent)
- Due dates and categories
- Tag system
- Search and filter tasks
- Board view (Kanban-style) and List view
- Task statistics dashboard

### Theme Support
- 5 built-in themes: Default, Dark, Purple, Ocean, Sunset
- Theme persists across page refreshes (stored in DB for logged-in users, localStorage for guests)
- Smooth theme transitions

### Responsive Design
- Fully responsive layout
- Collapsible sidebar for desktop
- Mobile drawer navigation
- Touch-friendly interactions

## API Endpoints

### Auth
- `POST /api/auth/guest` - Guest login
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (auth required)
- `PATCH /api/auth/theme` - Update theme (auth required)

### Tasks
- `GET /api/tasks` - List tasks (with filters)
- `POST /api/tasks` - Create task
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/:id` - Get single task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Design Decisions

- Used CSS custom properties for theming instead of Tailwind's dark mode to support 5 themes
- Zustand for lightweight state management (vs Redux)
- MongoDB for flexible schema that accommodates task metadata
- Guest login creates a real user in DB with `isGuest: true` flag for seamless data persistence
