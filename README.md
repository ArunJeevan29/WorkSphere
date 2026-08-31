# WorkSphere

A role-based project and task management platform built with the MERN stack.

## Overview

WorkSphere is a full-stack project and task management platform designed around authentication, role-based authorization, resource ownership, and centralized audit logging.

## Features

### Authentication & Authorization

- JWT authentication
- Secure Password Hashing: User passwords are hashed using bcrypt before storage.
- Protected routes
- Active/disabled user validation
- Role-based authorization
- Project ownership authorization
- Task-level access control

### Project Management

- Create, view, update and delete projects
- Project status management
- Project icons and colors
- Add/remove project members
- Project ownership checks

### Task Management

- Create tasks within projects
- Assign tasks to project members
- Task priorities
- Task due dates
- Task status management
- Member-specific task access

### User Management

- Admin user management
- Role management
- Active/disabled account management
- Self-disable protection

### Audit Logging

- Project activity tracking
- Task activity tracking
- User role/status changes
- Actor and IP address tracking
- Admin-only audit log access

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- Helmet
- CORS
- express-rate-limit
- express-validator

## Architecture

```text
React + Vite
      ↓
Axios / REST API
      ↓
Express
      ↓
Authentication Middleware
      ↓
Role Authorization
      ↓
Resource-Level Authorization
      ↓
Controllers
      ↓
Mongoose
      ↓
MongoDB
```

### Authorization Flow

WorkSphere implements a multi-layered authorization architecture that validates access before protected resources are modified or accessed.

```text
JWT Authentication
        ↓
User Active/Disabled Check
        ↓
Role Authorization
        ↓
Resource-Level Authorization
        ↓
Project Ownership
        ↓
Task Access
        ↓
Controller
```

## Roles

| Role    | Access                                                                    |
| ------- | ------------------------------------------------------------------------- |
| Admin   | Full system access                                                        |
| Manager | View all projects, create projects, manage owned projects and their tasks |
| Member  | Access assigned tasks and update task status                              |

## API Overview

- `/api/auth`: User registration, login, and profile.
- `/api/users`: User management (Admin).
- `/api/projects`: Project CRUD operations (fetches all projects for Admins and Managers).
- `/api/projects/:id/tasks`: Task operations scoped to a specific project.
- `/api/tasks`: Task-specific operations (e.g., status updates).
- `/api/audit-logs`: System activity logs.

## Project Structure

```text
client/
server/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
└── ...
```

## Setup

### Backend

```bash
cd server
npm install
```

Create `.env`

```env
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5002
```

```bash
npm run dev
```

## Development Status

🚧 Actively under development
