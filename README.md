# SIMS — Smart Inventory Management System

A full-stack MERN web application that helps businesses manage products, suppliers, stock levels, and generate insightful reports — all from a single, modern dashboard.

🔗 **Live App:** https://sims-management.vercel.app  
🔗 **Backend API:** https://sims-4njv.onrender.com

> ⚠️ Note: The backend is hosted on Render's free tier, which spins down after inactivity. The first request after idle time may take 30-50 seconds to respond.

---

## 📋 Overview

SIMS was built solo as a hands-on MERN stack learning project, taking a product from wireframes to a fully deployed, production-ready application. It covers the complete lifecycle of inventory management: authentication, product & supplier tracking, stock movement logging, and analytics.

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login with JWT
- Passwords hashed with bcrypt
- Protected routes on both frontend and backend

### 📊 Dashboard
- Real-time overview: total products, suppliers, stock on hand, and low-stock alerts

### 📦 Product Management
- Full CRUD (Create, Read, Update, Delete)
- Search and filter by name
- Each product linked to a supplier
- Configurable low-stock threshold per product

### 🚚 Supplier Management
- Full CRUD for supplier contacts (name, email, phone, address)
- Search functionality

### 📈 Inventory Tracking
- Increase/decrease stock with validation (prevents negative stock)
- Every change automatically logged: previous quantity, new quantity, amount, user, and timestamp
- Full audit trail on a dedicated Inventory Logs page

### 📉 Reports & Analytics
Organized into a tabbed interface for easy navigation:
- **Overview** — summary cards + recent activity feed
- **Charts** — products by category (pie), products per supplier (bar), inventory value by category (bar), top 5 products by value (bar)
- **Products** — full product summary table with computed value (price × quantity)
- **Suppliers** — supplier summary with product count and total value
- **Low Stock** — dedicated low-stock report table

### 🎨 UI/UX
- Built with Tailwind CSS using a custom Indigo + Emerald color system
- Custom logo and favicon
- Sticky navbar, responsive layouts, and a dedicated landing page

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios, Tailwind CSS, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas) |
| Auth | JWT, bcrypt |
| Deployment | Vercel (frontend), Render (backend) |

---

## 🏗 Architecture
Browser → React (Vercel) → Express API (Render) → MongoDB Atlas

- The frontend is a single-page application that communicates with the backend exclusively via REST APIs, authenticated with a JWT sent in the `Authorization` header.
- The backend follows an MVC-like structure: routes → controllers → models, with a shared `protect` middleware guarding all authenticated endpoints.
- Inventory changes are handled transactionally within a single controller action — the product's quantity is updated *and* an audit log entry is created together, ensuring the log always reflects reality.

---

## 🧠 Key Design Decisions

- **JWT over sessions** — stateless auth was simpler to reason about and deploy across two separate hosts (frontend/backend on different domains).
- **Denormalized audit logs** — `InventoryLog` stores `productName` and `updatedByName` directly (not just references) so history remains readable even if a product or user is later deleted.
- **Single Reports endpoint** — rather than multiple report APIs, one `/api/reports` endpoint aggregates everything the Reports page needs, reducing round trips.
- **Environment-based API URL** — the frontend uses `VITE_API_URL` so the same codebase points to `localhost` in development and the live Render URL in production without code changes.

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (free tier is enough)

### 1. Clone the repo
```bash
git clone https://github.com/Sunita-lab/SIMS---Smart-Inventory-Management-System.git
cd s
```

### 2. Backend setup
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
```
Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

---

## 📁 Project Structure
```
sims/
├── client/                React frontend
│   ├── public/             Logo, favicon
│   └── src/
│       ├── api/             Axios instance with auth interceptor
│       ├── components/      Navbar, ProtectedRoute
│       └── pages/           Home, Login, Register, Dashboard, Products,
│                             Suppliers, InventoryLogs, Reports
└── server/                 Express backend
    ├── controllers/         Business logic
    ├── middleware/           JWT auth middleware
    ├── models/               User, Product, Supplier, InventoryLog
    └── routes/               API route definitions
```

---

## 👤 Author

Built solo by **Sunita Satpathy** as an end-to-end MERN stack project — from wireframes to a live, deployed application.