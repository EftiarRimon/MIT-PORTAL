# MIT Portal

A web portal for a university department with three roles: **staff**, **teacher** and **student**. Staff manage the enrolled-student list, teachers and courses; teachers upload results; students register for courses and view their results.

**Stack:** Next.js (frontend), Express + Prisma (backend), MySQL.

## Prerequisites

- Node.js 18+
- MySQL 8 running locally

## Setup

### 1. Database

```sql
CREATE DATABASE mit_portal;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env     # Windows PowerShell: Copy-Item .env.example .env
```

Edit `backend/.env`:

- `DATABASE_URL`: your MySQL credentials. Special characters in the password must be URL-encoded (`#` becomes `%23`, `@` becomes `%40`).
- `JWT_SECRET`: any long random string. Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create the tables and start the server:

```bash
npx prisma migrate deploy
npx prisma generate
node server.js
```

The API runs on http://localhost:5000.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:3000.

## First staff account

Passwords are stored as bcrypt hashes, so a plain `INSERT` will not work. Generate a hash first:

```bash
cd backend
node -e "console.log(require('bcryptjs').hashSync('CHOOSE_A_PASSWORD', 10))"
```

Then insert the account (replace `HASH` with the output above):

```sql
INSERT INTO user (email, role, password) VALUES ('admin@example.com', 'staff', 'HASH');
INSERT INTO staff (email, name, role, Password) VALUES ('admin@example.com', 'Admin', 'staff', 'HASH');
```

## Authentication

- `POST /api/login` checks the email and password (bcrypt) against the `user` table and returns a JWT plus the matching profile.
- New students get their registration number as the initial password (stored hashed).
- Teachers created through `POST /api/teachers` get a login account automatically.
- Passwords created before bcrypt was added can be migrated once with `node scripts/hashPasswords.js`. It skips values that are already hashed.

## Notes

- Uploaded Excel files are stored temporarily in `backend/uploads/` and are not tracked by Git.
- Never commit `backend/.env`. Use `backend/.env.example` as the template.
