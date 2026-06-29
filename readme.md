# Generic-Ride-sharing

> **Temporary Developer Onboarding Guide**
>
> This document is intended to help team members set up their local development environment and start contributing. It will be updated as the project evolves.

---

# Prerequisites

Install the following software before getting started:

- Git
- Node.js (v20+ recommended)
- npm
- PostgreSQL
- VS Code (recommended)

Verify your installation:

```bash
git --version
node -v
npm -v
psql --version
```

---

# 1. Clone the Repository

```bash
git clone <repository-url>
cd campus-ride
```

---

# 2. Project Structure

```
campus-ride/
│
├── client/          # React Frontend
├── server/          # Express Backend
├── database/        # SQL Scripts
├── docs/            # Documentation
└── README.md
```

---

# 3. Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd ../server
npm install
```

---

# 4. Configure Environment Variables

## Backend

Create

```
server/.env
```

Example

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=campusride
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=replace_this_with_a_secret
```

---

## Frontend

Create

```
client/.env
```

Example

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 5. Database Setup

Create a PostgreSQL database.

Example:

```sql
CREATE DATABASE campusride;
```

> The database schema will be added later in the `database/` directory.

---

# 6. Running the Project

Open **two terminals**.

### Backend

```bash
cd server
npm run dev
```

Backend:

```
http://localhost:5000
```

---

### Frontend

```bash
cd client
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# Git Workflow

## Before starting work

Always update your local repository.

```bash
git checkout main
git pull origin main
```

Create a new feature branch.

```bash
git checkout -b feature/feature-name
```

Example:

```text
feature/login
feature/search-rides
feature/create-ride
feature/profile
```

---

## While Working

Commit often using meaningful commit messages.

```bash
git add .
git commit -m "Implement ride search page"
```

---

## Push Your Branch

```bash
git push origin feature/feature-name
```

Then open a Pull Request on GitHub.

> **Do not push directly to `main`.**

---

# Development Rules

- One feature = One branch
- Keep commits small and meaningful
- Pull the latest `main` before creating a new branch
- Resolve merge conflicts before opening a Pull Request
- Ask for a review before merging

---

# Current Tech Stack

## Frontend

- React
- Vite
- React Router
- Axios

## Backend

- Node.js
- Express
- PostgreSQL

---

# Planned Features

- User Authentication
- User Profiles
- Vehicle Management
- Create Ride
- Search Ride
- Book Ride
- Ride History
- Reviews
- Driver Dashboard
- Passenger Dashboard

---

# Notes

- This README is temporary and will evolve as the project progresses.
- Additional documentation (ER diagram, API documentation, setup scripts, etc.) will be added to the `docs/` directory.