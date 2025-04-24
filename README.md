# Minor Project: Project Management Application

## Overview
This is a web application designed to manage projects, including features for user authentication, a dashboard for project management, and the ability to create, view, and update project details. The application is built using Next.js with the App Router, Tailwind CSS for styling, and PostgreSQL as the database.

## Features
- User authentication (login and signup).
- Dashboard for managing projects.
- Create, view, and update project details.
- Dark mode support.
- Backend integration with PostgreSQL.

## Technologies Used
- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, PostgreSQL
- **Authentication**: bcrypt, JWT
- **Deployment**: Vercel

## How to Run the Project
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the PostgreSQL database and configure the connection in the `.env` file.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open the application in your browser at `http://localhost:3000`.

## Folder Structure
```
public/
  - Static assets (e.g., images, icons).
src/
  app/
    - Main application pages and layouts.
  components/
    - Reusable UI components.
  hooks/
    - Custom React hooks.
  lib/
    - Utility functions.
```

## Future Enhancements
- Add role-based access control (RBAC).
- Implement notifications for project updates.
- Add analytics for project performance.
