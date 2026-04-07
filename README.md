# Breadcrumb

Notes are the breadcrumb of thought.

A full-stack MERN notebook for capturing ideas, organizing thoughts, and revisiting them with clarity.

## Stack

- MongoDB + Mongoose
- Express + Node.js
- Vanilla frontend (responsive UI, light/dark mode)

## Local Run

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5001`.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_uri
PORT=5001
```

## Deploy

Because this app has a separate backend + frontend, deploy them as two projects.

### Option A: Vercel (frontend) + Render/Railway (backend)

1. Deploy backend (`backend`) to Render or Railway.
2. Copy the backend URL, e.g. `https://your-backend.onrender.com`.
3. In `frontend/app.js`, set `API_BASE` to `https://your-backend.onrender.com/api/notes`.
4. Deploy `frontend` to Vercel.

### Option B: Netlify (frontend) + Render/Railway (backend)

1. Deploy backend (`backend`) to Render or Railway.
2. Update `API_BASE` in `frontend/app.js` with the backend URL.
3. Deploy `frontend` to Netlify.

## GitHub Push (first time)

```bash
git init
git add .
git commit -m "Initial Breadcrumb app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Do not commit your `.env` files.
