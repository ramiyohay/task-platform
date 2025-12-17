# Task Platform – Full Stack Assignment

This project is a full-stack task workflow system built with **React (Vite)** on the client side and **NestJS** on the backend.
It manages user-assigned tasks with strict workflow rules and server-side validation.

---

## Running the project

### 1. Start PostgreSQL (Docker)

```bash
docker compose up -d
```

### 1b. Kill PostgreSQL (Docker)

```bash
docker compose down -v
```

---

### 2. Run the backend

```bash
cd server
npm install
npm run start
```

Backend runs at:

```
http://localhost:3000
```

---

### 3. Run the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## Features

1. **Users**
   - Fetch users from the backend.
   - Assign tasks to users.
   - No authentication (by design for this task).

2. **Tasks**
   - Create tasks of different types.
   - Display tasks in a summary list.
   - Edit tasks inside a dialog.
   - Move tasks forward and backward through workflow stages.
   - Close tasks at their final stage.

3. **Workflow Validation**
   - Each status transition requires specific data.
   - Validation is enforced server-side and mirrored client-side.
   - Invalid actions are silently disabled in the UI.

4. **Read-only Closed Tasks**
   - Closed tasks cannot be edited.
   - All inputs and actions are disabled once a task is closed.

5. **Efficient Server State Handling**
   - Uses TanStack Query for data fetching and caching.
   - Mutations update cache manually without unnecessary refetching.

---

## Task Workflows

### PROCUREMENT

1. Created
2. Supplier offers received
   - priceQuotes: string[] (exactly 2)
3. Purchase completed
   - receipt: string

### DEVELOPMENT

1. Created
2. Specification completed
   - spec: string
3. Development completed
   - branch: string
4. Distribution completed
   - version: string

All workflow rules are validated by the backend.

---

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- TanStack Query - for better fetching and data handling
- Plain CSS (dark theme)

### Backend

- NestJS
- TypeScript
- REST API
- TypeORM - for PostgresSQL

### Database

- PostgreSQL (Docker)

---

## Endpoints

### Users

- GET /users – fetch all users
- GET /users/:id/tasks – fetch tasks assigned to a user

### Tasks

- POST /tasks – create a task
- PATCH /tasks/:id/status – save / forward / back task status
- POST /tasks/:id/close – close a task

---

## Design Notes

- Backend is the source of truth
- Client strictly follows backend validation rules
- No authentication for simplicity
- No UI frameworks used, only CSS
- Focus on clarity and predictability

---

## Potential Improvements

1. Authentication and authorization like JWT
2. Unit and integration testing
3. docker-compose for one-command startup
4. Task history and audit logging
