# Expense Tracker

A full-stack expense management app built with React, Node.js, Express, and MongoDB. It allows users to sign up, log in, add and manage personal expenses, and track their monthly budget.

## Features

- Secure signup and login with JWT authentication
- Add, edit, and delete expenses
- Track total spending for the logged-in user
- Set a monthly budget and view usage progress
- View expenses by category and date
- Protected dashboard route for authenticated users only
- Responsive UI with Tailwind CSS

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs

## Project Structure

```bash
expense-tracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .gitignore
└── README.md
```

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd expense-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder with:
Then start the backend:

```bash
npm run dev
```

### 3. Frontend setup

Open a new terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on a Vite local port (usually `http://localhost:5173`).

## Authentication Flow

- Users can sign up with name, email, and password.
- After signup, the app shows a success message and redirects to the login page.
- Users log in to access the dashboard.
- The dashboard is protected and cannot be accessed without a valid session.

## Dashboard Features

- Total spending summary
- Monthly budget input
- Percentage of budget used
- Add expense form with title, amount, category, and date
- Edit and delete expense actions
- Expense table for viewing all entries

## Verification

Before finishing frontend work, the project was validated with:

```bash
cd frontend
npm run build
```

This command completed successfully.

## Notes

- The frontend sends requests to `http://localhost:5000/api`.
- The backend must be running before using the dashboard.
- For local testing, keep both servers running in separate terminals.
