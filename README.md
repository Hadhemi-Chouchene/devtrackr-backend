# DevTrackr Backend

Backend API for a job application tracking system.

## 🚀 Tech Stack

- NestJS
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- Swagger API Documentation

## 📦 Features (in progress)

- User authentication (register/login/logout)
- JWT refresh token system
- Role-based access control (USER / ADMIN)
- Job tracking system (CRUD)
- Pagination, filtering, search
- Swagger API documentation
- Analytics (coming soon)

## 🛠️ Setup

### 1. Install dependencies

npm install

### 2. Setup environment variables

Create a `.env` file based on `.env.example`:

PORT=3000
MONGO_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

### 3. Run project

npm run start:dev

## 🔐 Auth Flow

1. Register user → /auth/register
2. Login → returns access + refresh token
3. Access protected routes using:
   Authorization: Bearer <access_token>
4. Refresh token → /auth/refresh
5. Logout → invalidates refresh token

## 📘 Swagger Docs

After running the project:

http://localhost:3000/api-docs
