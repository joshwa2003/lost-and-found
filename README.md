
# Lost and Found Portal

A MERN stack project for reporting lost and found items on campus.

## Tech Stack

- **Frontend:** React + Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js + Express, MongoDB
- **Database:** MongoDB

## Folder Structure

- `client/`: Frontend application
- `server/`: Backend API

## Prerequisites

- Node.js (v14+)
- MongoDB (running locally or URI provided in `.env`)

## Installation & Setup

1. **Clone the repository** (if applicable) or navigate to project root.

2. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/lostandfound
   JWT_SECRET=your_jwt_secret_key_here
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

## Running the Application

### Backend
From the `server` directory:
```bash
npm run dev
```
(Using `nodemon` for auto-restart)
*Note: Make sure to add `"dev": "nodemon server.js"` to `server/package.json` scripts if not already present, or run `npx nodemon server.js`.*

### Frontend
From the `client` directory:
```bash
npm run dev
```

The frontend will start at `http://localhost:5173`.
The backend will start at `http://localhost:5001`.

## Features (Planned)

- User Authentication (Student/Admin/Staff)
- Report Lost Item
- Report Found Item
- Search & Filter Items
- Claim Item Process