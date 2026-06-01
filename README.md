# Task Tracker API

REST API for team-based task management with JWT authentication, RBAC, Redis caching, Swagger documentation, and Dockerized deployment.

## Repository

GitHub Repository:
https://github.com/pandaabhishek38/task-tracker-api

## Overview

Task Tracker API is a team-based task management system built as part of an SDE II take-home assignment.

The application provides:

- JWT authentication
- Refresh token rotation
- Role-based access control (RBAC)
- Task lifecycle management
- Redis caching
- Swagger/OpenAPI documentation
- Dockerized deployment

Users belong to organizations and are assigned one of three roles: **ADMIN**, **MANAGER**, or **MEMBER**. Permissions and business rules are enforced server-side.

---

## Features

### Authentication & Authorization

- JWT-based authentication
- Access token and refresh token rotation
- Middleware-based RBAC enforcement
- Three user roles:
  - ADMIN
  - MANAGER
  - MEMBER

### Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Task assignment
- Task priorities
- Task status workflow enforcement

### Filtering & Pagination

Supported filters:

- `status`
- `priority`
- `assigneeId`

Pagination support:

- `page`
- `limit`

### Validation

Centralized request validation using `express-validator`.

Validation coverage:

- Register
- Login
- Create Task
- Update Task

### Caching

Redis caching for task lists filtered by assignee.

### Documentation

Swagger/OpenAPI documentation available through Swagger UI.

### Deployment

Containerized deployment using Docker and Docker Compose.

---

## Technology Stack

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Prisma ORM

### Authentication

- JWT
- bcryptjs

### Validation

- express-validator

### Caching

- Redis

### Documentation

- Swagger UI
- OpenAPI

### Containerization

- Docker
- Docker Compose

---

## Architecture

```
Client
 |
 v
Express API
 |
 +-- Authentication Middleware
 +-- Authorization Middleware
 +-- Validation Middleware
 |
 +-- Service Layer
 |
 +-- Prisma
 +-- Redis
 |
 +-- PostgreSQL
```

---

## Role Permissions

### ADMIN

- Full task access
- Create tasks
- View tasks
- Update tasks
- Delete tasks

### MANAGER

- Create tasks
- View tasks
- Update tasks
- Assign tasks
- Advance task status

### MEMBER

- View tasks
- Update tasks assigned to them
- Cannot create tasks
- Cannot delete tasks

---

## Task Status Workflow

Allowed transitions:

```text
TODO ---------> IN_PROGRESS ---------> IN_REVIEW ---------> DONE
 |                   |                     |
 |                   v                     v
 +-------------> BLOCKED <-----------------+
                      |
                      v
                 IN_PROGRESS
```

Additional rules:

- BLOCKED may be entered from TODO, IN_PROGRESS, or IN_REVIEW.
- BLOCKED may only transition back to IN_PROGRESS.
- DONE cannot transition further.
- Only the assignee, MANAGER, or ADMIN may change task status.

---

## Filtering & Pagination

### Filtering

Examples:

```

GET /tasks?status=TODO
GET /tasks?priority=HIGH
GET /tasks?assigneeId=1

```

### Pagination

```

GET /tasks?page=2&limit=10

```

---

## Database Design

### Entities

**Organization**
Represents a team or company.

**User**
Belongs to an organization and has one of the following roles:

- ADMIN
- MANAGER
- MEMBER

**Task**
Contains:

- `title`
- `description`
- `priority`
- `status`
- `dueDate`
- `assignee`
- `creator`

### Indexing Strategy

Indexes were added on frequently queried fields:

```

@@index([status])
@@index([assigneeId])
@@index([dueDate])

```

**Reasoning:**

- `status` improves filtering performance.
- `assigneeId` improves assignee-specific task lookups and Redis cache usage.
- `dueDate` supports future overdue-task and scheduling queries.

---

## Caching Strategy

Redis caching is implemented for task lists filtered by assignee.

### Cache Key Format

```

tasks:assignee:{assigneeId}:page:{page}:limit:{limit}
```

Example:

```

tasks:assignee:1

```

### TTL

60 seconds

### Cache Invalidation

Cache entries are invalidated when:

- A task is created
- A task is updated
- A task is deleted

When task data changes, the corresponding assignee cache key is removed to prevent stale data.

---

## Analytics Endpoint

Endpoint:

```http
GET /analytics/tasks
```

Returns:

- Overdue task count per user
- Average task completion time
- Access restricted to ADMIN and MANAGER roles.

Example response:

```json
{
  "overdueTasksPerUser": [
    {
      "userId": 1,
      "name": "Abhishek",
      "count": 1
    }
  ],
  "averageCompletionTimeDays": 2.35
}
```

### Design Decision

A dedicated `completedAt` field was not included in the schema.

Average completion time is approximated using the duration between:

- `createdAt`
- `updatedAt`

for tasks in `DONE` status.

---

## Security Design

### Authentication

JWT access tokens protect secured endpoints.

### Authorization

RBAC is enforced through middleware rather than controller logic.

### Design Decision

Role-based access control is enforced in middleware because role checks depend only on the authenticated user.

Task ownership rules are enforced in the service layer because they require task-specific database checks.

This separation keeps controllers clean while maintaining a clear distinction between authorization and business logic.

---

## API Documentation

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

Features:

- Interactive endpoint testing
- Request schemas
- JWT authorization support
- Response documentation

---

## Local Setup

### Prerequisites

- Node.js
- PostgreSQL
- Redis

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
REDIS_URL=
```

### Run Migrations

```bash
npx prisma migrate deploy
```

### Start the Application

```bash
npm run dev
```

---

## Docker Setup

Start the complete application stack:

```bash
docker compose up --build
```

Services started:

- API
- PostgreSQL
- Redis

Database migrations are automatically applied during container startup.

### Startup Behavior

On container startup:

1. PostgreSQL starts
2. Redis starts
3. Prisma migrations are automatically applied
4. API server starts

No manual database setup is required.

**Health endpoint:**

```
http://localhost:3000/health
```

**Swagger documentation:**

```
http://localhost:3000/api-docs
```

---

## Testing

### Smoke Tests

```bash
node scripts/smokeTest.js
```

### RBAC Tests

```bash
node scripts/rbacTest.js
```

### Redis Cache Tests

```bash
node scripts/redisTest.js
```

### Integration Tests

Implemented using Jest and Supertest.

Covered critical flows:

1. Authentication Flow

   - Register
   - Login
   - Refresh Token Flow

2. Task Workflow
   - Create Task
   - TODO → IN_PROGRESS
   - IN_PROGRESS → IN_REVIEW
   - IN_REVIEW → DONE
   - Invalid Status Transition Rejection

Run:

```bash
npm test
```

---

## Future Improvements

Given additional development time, the following enhancements would be considered:

- WebSocket/SSE notifications for task status changes
- Frontend task board
- Structured logging and monitoring
- Rate limiting
- CI/CD pipeline integration

---

## Assignment Requirement Coverage

| Requirement            | Implementation |
| ---------------------- | -------------- |
| JWT Authentication     | Implemented    |
| Refresh Token Rotation | Implemented    |
| RBAC Middleware        | Implemented    |
| Task CRUD              | Implemented    |
| Status Transitions     | Implemented    |
| Filtering              | Implemented    |
| Pagination             | Implemented    |
| Validation             | Implemented    |
| PostgreSQL             | Implemented    |
| Prisma ORM             | Implemented    |
| Redis Caching          | Implemented    |
| Cache Invalidation     | Implemented    |
| Docker Deployment      | Implemented    |
| Swagger/OpenAPI        | Implemented    |
| Database Indexes       | Implemented    |
| Analytics Endpoint     | Implemented    |
| Integration Tests      | Implemented    |
