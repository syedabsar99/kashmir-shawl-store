# Saadat Shawl House 🧣

A full-stack, premium Kashmiri shawl e-commerce platform built with React, Node.js/Express, and MongoDB.

---

## ✨ Features

- **Customer Storefront** — Browse, filter, and purchase authentic Kashmiri shawls
- **User Authentication** — JWT-based registration & login with protected routes
- **Product Catalog** — Categories, search/filter, featured products, product detail pages
- **Shopping Cart** — Persistent cart via Zustand state management
- **Checkout** — Zone-based shipping rates, Razorpay online payment + Cash on Delivery
- **Order Tracking** — Order history and status updates on the Account page
- **Admin Panel** — Dark-themed dashboard for managing products, orders, categories, and shipping zones
- **Image Uploads** — Cloudinary integration for product images
- **Responsive Design** — Lume-inspired minimalist layout with Kashmiri crimson & gold accents

---

## 🗂️ Project Structure

```
kashur-mart/
├── client/                  # Vite + React frontend
│   └── src/
│       ├── api/             # Axios API client
│       ├── components/      # Navbar, Footer, ProductCard, etc.
│       ├── hooks/           # useToast
│       ├── pages/           # Customer pages
│       │   └── admin/       # Admin panel pages
│       └── store/           # Zustand stores (auth, cart)
├── server/                  # Node.js + Express backend
│   ├── middleware/          # auth.js, isAdmin.js
│   ├── models/              # Mongoose models
│   ├── routes/              # API route handlers
│   └── index.js             # Express entry point
└── vercel.json              # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/kashur-mart.git
cd kashur-mart

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

Copy the example env file and fill in your credentials:

```bash
cp server/.env.example server/.env
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing (make it long & random) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Razorpay test/live key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `CLIENT_URL` | Frontend URL (e.g. `http://localhost:5173`) |
| `PORT` | Server port (default: `5000`) |

### 3. Run Locally

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

Frontend → http://localhost:5173  
Backend API → http://localhost:5000/api

---

## 🔑 Creating an Admin User

After starting the server, register a user normally, then update their record in MongoDB:

```js
// In MongoDB Atlas or mongosh:
db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
```

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router v7 |
| State | Zustand |
| Styling | Vanilla CSS (Lume-inspired design system) |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Images | Cloudinary |
| Payments | Razorpay (online) + Cash on Delivery |
| Deployment | Vercel (serverless) |

---

## 🌐 Deployment (Vercel)

The project is configured for Vercel monorepo deployment via `vercel.json`.

**Environment Variables** to set in Vercel dashboard (same as `.env` above):
- `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `RAZORPAY_*`, `CLIENT_URL`

The `vercel.json` routes all `/api/*` requests to the Express server and all other routes to the React SPA.

---

## 📄 License

MIT © Saadat Shawl House — Made with ❤️ from Kashmir
