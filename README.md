# Saadat Kashmir Shawl Store — Full-Stack E-Commerce Platform

A production-ready, full-stack luxury e-commerce platform dedicated to authentic handwoven Kashmiri Pashmina, Woolen, and Silk shawls, built with React 18, Vite, Node.js, Express, MongoDB, and custom responsive styling featuring dynamic catalogs, shopping carts, wishlist management, order workflows, and a full administrative dashboard.

[![Live Demo](https://img.shields.io/badge/Demo-Live_Store-06b6d4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://kashmir-shawl-store.vercel.app)
[![React](https://img.shields.io/badge/React_18-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](client/)
[![Node & Express](https://img.shields.io/badge/Backend-Node.js_%26_Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](server/)
[![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](server/models/)
[![License](https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge)](LICENSE)

---

## Preview

![Saadat Kashmir Shawl Store Preview](preview.jpg)

> **Live Store:** [kashmir-shawl-store.vercel.app](https://kashmir-shawl-store.vercel.app)

---

## Overview

Architected and developed by **Syed Noor Ul Absar**, this application honors the rich handicraft heritage of the Kashmir Valley through a world-class digital storefront. It connects artisans directly with discerning global patrons seeking genuine Pashmina, Kani, and Tilla embroidered shawls.

The architecture cleanly decouples an optimized React SPA client from a robust Node.js REST API with authenticated JWT authorization, persistent MongoDB schemas, Razorpay checkout hooks, and an integrated content management system (CMS) for inventory administration.

---

## Key Features

- **Product Catalog & Filtering** — Dynamic catalog filtering by category (Pashmina, Cashmere, Silk, Woolen), price range, availability, and search queries.
- **Interactive Product Detail Pages** — Multi-angle zoomable image galleries, fabric specifications, artisan stories, and stock status indicators.
- **Client-Side State Management** — Reactive shopping cart and persistent wishlist powered by custom Zustand/browser storage stores.
- **Checkout & Payment Integration** — Multi-step order checkout flow with customer shipping zone calculators and Razorpay payment gateway integration.
- **Admin Management Suite** — Password-protected administrative console for product creation/editing, inventory tracking, order status updates, and banner announcements.
- **SEO & Social Sharing Metadata** — Tailored Open Graph cards and JSON-LD schema markup for enhanced search engine visibility.
- **Mobile-First Responsive Design** — Fluid layouts optimized with custom CSS media queries ensuring an exquisite shopping experience on all devices (`<=480px`).

---

## Tech Stack

| Layer | Technologies | Details |
| :--- | :--- | :--- |
| **Frontend Client** | React 18, Vite | Component-driven UI, React Router v6, custom hooks, Axios |
| **Styling** | Vanilla CSS3 (Lume Theme) | Custom CSS design tokens, wood-inspired palette, glassmorphism, responsive grid |
| **Backend API** | Node.js, Express.js | Modular RESTful routes, JWT authentication, CORS, rate limiting |
| **Database** | MongoDB & Mongoose | Relational schemas for Products, Categories, Users, Orders, and Settings |
| **Payments & Assets** | Razorpay & Multer | Secure online payments and local media storage |
| **Hosting** | Vercel (Client) & Render (API) | Production cloud environments with SSL |

---

## Project Structure

```text
kashmir-shawl-store/
├── client/                    # React 18 + Vite frontend client
│   ├── public/                # Static assets, SVG icons, and favicons
│   ├── src/
│   │   ├── api/               # Axios instance and API service calls
│   │   ├── components/        # Navbar, Footer, ProductCard, Preloader, ProtectedRoute
│   │   ├── pages/             # Home, Shop, ProductDetail, Cart, Checkout, Account, Admin
│   │   ├── store/             # Auth, Cart, Wishlist, and Settings stores
│   │   ├── App.jsx            # Application routing configuration
│   │   └── index.css          # Core design tokens and responsive media queries
│   └── package.json
├── server/                    # Node.js + Express backend service
│   ├── middleware/            # JWT authentication & admin authorization guards
│   ├── models/                # Mongoose schemas (Product, Order, User, Category, Settings)
│   ├── routes/                # REST endpoints for products, orders, auth, and admin
│   ├── uploads/               # Product photography and banner storage
│   ├── index.js               # Express application entrypoint and DB connection
│   └── package.json
├── LICENSE                    # MIT open-source license
├── preview.jpg                # High-resolution store showcase photograph
└── README.md                  # Comprehensive repository documentation
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/syedabsar99/kashmir-shawl-store.git
cd kashmir-shawl-store
```

### 2. Setup Server
```bash
cd server
npm install
cp .env.example .env   # configure PORT, MONGO_URI, and JWT_SECRET
npm start
```

### 3. Setup Client
```bash
cd ../client
npm install
npm run dev
```

---

## Author & Contact

**Syed Noor Ul Absar**
- **Role**: Frontend & Full-Stack Web Developer
- **Education**: Bachelor of Computer Applications (BCA), Chandigarh University (8.35 SGPA)
- **Portfolio**: [syedabsar99.github.io/portfolio](https://syedabsar99.github.io/portfolio/)
- **GitHub**: [@syedabsar99](https://github.com/syedabsar99)
- **LinkedIn**: [linkedin.com/in/syed-noor-ul-absar-7b6408365](https://www.linkedin.com/in/syed-noor-ul-absar-7b6408365/)
- **Email**: syedabsar99@gmail.com

---

## License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and distribute for educational or personal use.
