# 🛍️ ShopZone — Full-Stack E-Commerce Web Application

![ShopZone Banner](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=300&fit=crop)

> A **production-ready, scalable E-Commerce platform** built with the MERN stack. Features a complete shopping experience for users and a powerful admin dashboard — built following real-world industry standards.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-green?style=flat-square&logo=mongodb)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🧰 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🔗 API Reference](#-api-reference)
- [🗄️ Database Design](#️-database-design)
- [⚙️ Getting Started](#️-getting-started)
- [🌱 Seeding the Database](#-seeding-the-database)
- [🔐 Authentication Flow](#-authentication-flow)
- [🛒 Shopping Workflow](#-shopping-workflow)
- [👨‍💼 Admin Workflow](#-admin-workflow)
- [🎨 UI Screenshots](#-ui-screenshots)
- [🔒 Security Implementation](#-security-implementation)
- [🚀 Deployment Guide](#-deployment-guide)
- [🧪 Testing the APIs](#-testing-the-apis)
- [📖 Key Concepts Learned](#-key-concepts-learned)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

### 👤 User Side
| Feature | Description |
|---|---|
| 🔐 Register / Login | JWT-based authentication with bcrypt password hashing |
| 🔁 Persistent Login | Token stored in localStorage, verified on every app load |
| 🛍️ Product Listing | Browse all products with search, filter, sort & pagination |
| 🔍 Product Details | Full product page with image, rating, stock status & quantity picker |
| 🛒 Shopping Cart | Add, update quantity, remove items — synced with server |
| 💳 Checkout | Shipping address form + mock payment gateway |
| 📦 Place Order | Creates order, deducts stock, clears cart automatically |
| 🗂️ Order History | View all past orders with expandable item details |

### 🛠️ Admin Side
| Feature | Description |
|---|---|
| 📊 Dashboard | Stats: total orders, revenue, products, customers |
| 📋 Order Status Breakdown | Counts by pending / processing / shipped / delivered |
| ➕ Add Product | Create new products via modal form with image preview |
| ✏️ Edit Product | Update any product field inline via modal |
| 🗑️ Delete Product | Soft delete (keeps data, marks inactive) |
| 📦 Manage Orders | Filter by status, update order status inline |
| 🔒 Role Protection | Admin routes locked behind JWT + role middleware |

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| ⚛️ React 18 (Vite) | UI framework, fast HMR development |
| 🎨 Tailwind CSS v3 | Utility-first CSS, responsive design |
| 🧭 React Router DOM v6 | Client-side routing, nested routes |
| 📡 Axios | HTTP client with request/response interceptors |
| 🌐 Context API | Global state for Auth and Cart |
| 🔔 React Hot Toast | Toast notifications |
| 🎯 React Icons | Icon library (Feather Icons) |

### Backend
| Technology | Purpose |
|---|---|
| 🟢 Node.js | JavaScript runtime |
| ⚡ Express.js v5 | HTTP server, routing, middleware |
| 🍃 MongoDB | NoSQL document database |
| 🦦 Mongoose | ODM — schema definitions and queries |
| 🔑 JWT (jsonwebtoken) | Stateless authentication tokens |
| 🔒 bcryptjs | Password hashing (12 salt rounds) |
| 🛡️ Helmet | Security HTTP headers |
| 📝 Morgan | HTTP request logger |
| ✅ express-validator | Input validation middleware |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                    │
│                                                      │
│  Pages → Components → Context → Services → Axios    │
│                           ↕                          │
│              localStorage (token + user)             │
└──────────────────────┬──────────────────────────────┘
                       │  HTTP/JSON (REST API)
                       │  Authorization: Bearer <JWT>
┌──────────────────────▼──────────────────────────────┐
│                   SERVER (Express)                   │
│                                                      │
│  Routes → Middleware → Controllers → Models          │
│                                                      │
│  Middleware Stack:                                   │
│   helmet → cors → morgan → json → routes             │
│   → notFound → errorHandler                          │
└──────────────────────┬──────────────────────────────┘
                       │  Mongoose ODM
┌──────────────────────▼──────────────────────────────┐
│                  MongoDB Database                    │
│   Collections: users, products, carts, orders        │
└─────────────────────────────────────────────────────┘
```

### Design Patterns Used
- **MVC Pattern** — Models, Controllers, Routes clearly separated
- **Middleware Chain** — Auth, validation, error handling as composable middlewares  
- **Repository Pattern** — Services layer in frontend wraps all API calls
- **Context + Hooks** — Clean state management without Redux overhead
- **asyncHandler Wrapper** — Eliminates try/catch boilerplate in every controller

---

## 📁 Project Structure

```
ShopZone/
│
├── 📂 server/                      # Express Backend
│   ├── 📄 server.js                # Entry point — middleware + routes setup
│   ├── 📄 .env                     # Environment variables (git-ignored)
│   ├── 📄 .env.example             # Template for env variables
│   │
│   ├── 📂 config/
│   │   └── 📄 db.js                # MongoDB connection (exits on failure)
│   │
│   ├── 📂 models/                  # Mongoose Schemas
│   │   ├── 📄 User.js              # User schema + bcrypt pre-save hook
│   │   ├── 📄 Product.js           # Product schema + text index
│   │   ├── 📄 Cart.js              # Cart with embedded items
│   │   └── 📄 Order.js             # Order with item snapshot + shipping
│   │
│   ├── 📂 controllers/             # Business Logic
│   │   ├── 📄 authController.js    # register, login, getMe, updateProfile
│   │   ├── 📄 productController.js # CRUD + search/filter/pagination
│   │   ├── 📄 cartController.js    # add, update, remove, clear
│   │   ├── 📄 orderController.js   # create, list, status update, stats
│   │   └── 📄 healthController.js  # Server health check
│   │
│   ├── 📂 routes/                  # API Route Definitions
│   │   ├── 📄 authRoutes.js
│   │   ├── 📄 productRoutes.js
│   │   ├── 📄 cartRoutes.js
│   │   ├── 📄 orderRoutes.js
│   │   └── 📄 healthRoutes.js
│   │
│   ├── 📂 middleware/              # Express Middlewares
│   │   ├── 📄 authMiddleware.js    # protect + adminOnly guards
│   │   ├── 📄 errorHandler.js      # Global error handler (Mongoose + JWT)
│   │   ├── 📄 notFound.js          # 404 handler
│   │   └── 📄 validators.js        # express-validator rule sets
│   │
│   └── 📂 utils/
│       ├── 📄 ApiError.js          # Custom error class with statusCode
│       ├── 📄 asyncHandler.js      # Wraps async controllers
│       ├── 📄 generateToken.js     # JWT signing utility
│       └── 📄 seeder.js            # DB seed script (users + products)
│
├── 📂 client/                      # React Frontend (Vite)
│   ├── 📄 index.html               # HTML entry + Google Fonts
│   ├── 📄 .env                     # VITE_API_URL
│   ├── 📄 tailwind.config.js       # Custom colors + animations
│   │
│   └── 📂 src/
│       ├── 📄 main.jsx             # React DOM render
│       ├── 📄 App.jsx              # Router + Layout structure
│       ├── 📄 index.css            # Tailwind directives + component classes
│       │
│       ├── 📂 context/
│       │   ├── 📄 AuthContext.jsx  # user, login, logout, register
│       │   └── 📄 CartContext.jsx  # cart, addItem, removeItem, updateItem
│       │
│       ├── 📂 services/            # Axios API Call Wrappers
│       │   ├── 📄 api.js           # Axios instance + JWT interceptor
│       │   ├── 📄 authService.js
│       │   ├── 📄 productService.js
│       │   ├── 📄 cartService.js
│       │   └── 📄 orderService.js
│       │
│       ├── 📂 components/          # Reusable UI Components
│       │   ├── 📄 Navbar.jsx       # Sticky nav + cart badge + user dropdown
│       │   ├── 📄 ProductCard.jsx  # Card with hover zoom + add-to-cart
│       │   ├── 📄 Modal.jsx        # Backdrop blur modal with size variants
│       │   ├── 📄 Loader.jsx       # Spinner (inline + fullscreen)
│       │   ├── 📄 Footer.jsx       # Site footer
│       │   ├── 📄 AdminLayout.jsx  # Dark sidebar for admin pages
│       │   ├── 📄 ProtectedRoute.jsx  # Redirects unauthenticated users
│       │   └── 📄 AdminRoute.jsx      # Redirects non-admin users
│       │
│       ├── 📂 pages/               # Route-Level Views
│       │   ├── 📄 Home.jsx         # Hero + categories + featured products
│       │   ├── 📄 Products.jsx     # Listing with search/filter/pagination
│       │   ├── 📄 ProductDetail.jsx # Full product view + qty selector
│       │   ├── 📄 Cart.jsx         # Cart items + order summary
│       │   ├── 📄 Checkout.jsx     # Shipping form + mock payment
│       │   ├── 📄 Orders.jsx       # Order history (expandable)
│       │   ├── 📄 Login.jsx        # Login form
│       │   ├── 📄 Register.jsx     # Register form
│       │   └── 📂 admin/
│       │       ├── 📄 Dashboard.jsx      # Stats + recent orders
│       │       ├── 📄 ManageProducts.jsx # CRUD table + modal form
│       │       └── 📄 ManageOrders.jsx   # Orders table + status update
│       │
│       └── 📂 utils/
│           └── 📄 helpers.js       # formatPrice, formatDate, getStatusClass
│
└── 📄 README.MD                    # You are here! 👋
```

---

## 🔗 API Reference

### 🔐 Auth Routes — `/api/auth`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Create new account → returns JWT |
| `POST` | `/login` | Public | Authenticate → returns JWT |
| `GET` | `/me` | 🔒 User | Get logged-in user profile |
| `PUT` | `/profile` | 🔒 User | Update name / email |
| `PUT` | `/change-password` | 🔒 User | Change password |

### 📦 Product Routes — `/api/products`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Get all products (search, filter, sort, paginate) |
| `GET` | `/:id` | Public | Get single product by ID |
| `GET` | `/admin/all` | 🔑 Admin | Get all products including deleted |
| `POST` | `/` | 🔑 Admin | Create new product |
| `PUT` | `/:id` | 🔑 Admin | Update product |
| `DELETE` | `/:id` | 🔑 Admin | Soft-delete product |

**Query Parameters for `GET /api/products`:**
```
?search=headphones     → search by title (case-insensitive)
?category=Electronics  → filter by category
?minPrice=500          → minimum price filter
?maxPrice=5000         → maximum price filter
?sort=price-asc        → sort: newest | price-asc | price-desc | rating
?page=1&limit=12       → pagination
```

### 🛒 Cart Routes — `/api/cart`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | 🔒 User | Get cart with populated products |
| `POST` | `/` | 🔒 User | Add item `{ productId, quantity }` |
| `PUT` | `/:productId` | 🔒 User | Update item quantity |
| `DELETE` | `/:productId` | 🔒 User | Remove single item |
| `DELETE` | `/` | 🔒 User | Clear entire cart |

### 📋 Order Routes — `/api/orders`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/` | 🔒 User | Place order from cart |
| `GET` | `/` | 🔒 User | Get own orders |
| `GET` | `/:id` | 🔒 User | Get order by ID |
| `GET` | `/all` | 🔑 Admin | Get all orders (filterable) |
| `PUT` | `/:id/status` | 🔑 Admin | Update order status |
| `GET` | `/stats` | 🔑 Admin | Dashboard analytics |

### 🏥 Health Route
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server + env status check |

---

## 🗄️ Database Design

### 👤 User Schema
```js
{
  name:      String  (2–50 chars, required),
  email:     String  (unique, lowercase, validated),
  password:  String  (hashed, select:false — never returned in queries),
  role:      String  (enum: 'user' | 'admin', default: 'user'),
  avatar:    String  (URL, optional),
  isActive:  Boolean (default: true — for account suspension),
  timestamps: true
}
```

### 📦 Product Schema
```js
{
  title:       String  (required),
  description: String  (required),
  price:       Number  (min: 0, required),
  category:    String  (enum: Electronics | Clothing | Books | ...),
  image:       String  (URL, required),
  stock:       Number  (min: 0, default: 0),
  rating:      Number  (0–5, default: 0),
  numReviews:  Number  (default: 0),
  isActive:    Boolean (soft delete flag),
  timestamps: true
}
// Index: text index on title + description for search
```

### 🛒 Cart Schema
```js
{
  user:  ObjectId → User  (unique — one cart per user),
  items: [{
    product:  ObjectId → Product,
    quantity: Number (min: 1),
    price:    Number (snapshot at time of add — protects from price changes)
  }],
  timestamps: true
}
```

### 📋 Order Schema
```js
{
  user:  ObjectId → User,
  items: [{
    product:  ObjectId → Product,
    title:    String,   // ← snapshot (product can be deleted later)
    image:    String,   // ← snapshot
    price:    Number,   // ← snapshot
    quantity: Number
  }],
  shippingAddress: {
    fullName, address, city, state, pinCode, phone
  },
  paymentMethod: String (default: 'Card'),
  paymentStatus: String (enum: pending | paid | failed),
  totalAmount:   Number,
  status:        String (enum: pending | processing | shipped | delivered | cancelled),
  timestamps: true
}
```

> 💡 **Why snapshot order items?** Products can be deleted or price-changed after an order is placed. Snapshotting preserves the exact order state forever.

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- [MongoDB](https://mongodb.com) (local or [MongoDB Atlas](https://cloud.mongodb.com))
- [Git](https://git-scm.com)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/COZYkrish/E-COMMERCE-WEB-APPLICATION.git
cd E-COMMERCE-WEB-APPLICATION
```

### 2️⃣ Setup Backend
```bash
cd server
npm install

# Create your environment file
cp .env.example .env
# Then open .env and fill in your values (see below)
```

**`server/.env` variables:**
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your_super_secret_key_at_least_32_characters
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3️⃣ Setup Frontend
```bash
cd ../client
npm install

# Create frontend env file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 4️⃣ Start Both Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# ✅ Server running at http://localhost:5000
# ✅ MongoDB Connected
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# ✅ App running at http://localhost:5173
```

---

## 🌱 Seeding the Database

Populate MongoDB with **3 users** (1 admin + 2 customers) and **12 products** across 6 categories:

```bash
cd server
npm run seed
```

**Output:**
```
✅ MongoDB Connected
🗑️  Cleared existing data
✅ Created 3 users
✅ Created 12 products

🎉 Seeding complete!

Admin → admin@ecommerce.com / Admin@123
User  → john@example.com / User@1234
```

---

## 🔐 Authentication Flow

```
1. User fills Register form
       ↓
2. Frontend sends POST /api/auth/register
       ↓
3. express-validator checks name/email/password rules
       ↓
4. Controller checks if email already exists
       ↓
5. User.create() triggers pre-save hook → bcrypt hashes password (12 rounds)
       ↓
6. generateToken() signs JWT with userId payload + JWT_SECRET
       ↓
7. Server responds: { token, user }
       ↓
8. AuthContext stores token in localStorage + user in React state
       ↓
9. Axios interceptor reads token from localStorage on every API request
   and adds: Authorization: Bearer <token>
       ↓
10. protect middleware verifies token → attaches req.user to request
        ↓
11. adminOnly middleware checks req.user.role === 'admin'
```

---

## 🛒 Shopping Workflow

```
Browse Products
  → Search by keyword / filter by category / sort by price
  → Click product card → Product Detail page
  → Select quantity → "Add to Cart"
  ↓
  POST /api/cart  (requires login)
  → Stock validation on server
  → If product already in cart → quantity incremented
  → Cart stored in MongoDB, React state updated
  ↓
Cart Page
  → View all items with images + quantity controls
  → Update qty → PUT /api/cart/:productId
  → Remove item → DELETE /api/cart/:productId
  → See: subtotal + 18% GST + shipping (free above ₹999)
  ↓
Checkout Page
  → Fill shipping address (fullName, address, city, state, PIN, phone)
  → Fill mock card details (no real payment)
  → Submit → POST /api/orders
  ↓
  Server:
    1. Validates cart is not empty
    2. For each item: checks stock availability
    3. Deducts stock from each product
    4. Snapshots item details (title, image, price) into order
    5. Calculates totalAmount
    6. Creates Order document
    7. Clears cart (items = [])
  ↓
Order History Page
  → Lists all orders with status badge
  → Expand any order → see items + shipping address + payment status
```

---

## 👨‍💼 Admin Workflow

```
Login as Admin
  → Redirected to /admin (Dashboard)
  ↓
Dashboard
  → Stats cards: Total Orders | Revenue | Products | Customers
  → Order status breakdown: pending / processing / shipped / delivered
  → Recent 5 orders table
  ↓
Manage Products (/admin/products)
  → View all products in table (including soft-deleted)
  → Click "Add Product" → Modal opens
    → Fill: title, description, price, stock, category, image URL
    → Live image preview from URL
    → Submit → POST /api/products
  → Click ✏️ Edit → Pre-filled modal → Submit → PUT /api/products/:id
  → Click 🗑️ Delete → Confirmation modal → DELETE /api/products/:id
    → Product isActive set to false (soft delete, data preserved)
  ↓
Manage Orders (/admin/orders)
  → Filter by status: All | pending | processing | shipped | delivered | cancelled
  → View each order: customer, items preview, total, date, current status
  → Change status via dropdown → PUT /api/orders/:id/status
  → Optimistic UI update (table updates instantly without reload)
```

---

## 🔒 Security Implementation

| Security Layer | Implementation |
|---|---|
| 🔑 Password Hashing | bcryptjs with 12 salt rounds — resistant to brute force |
| 🎟️ JWT Authentication | Short-lived tokens (7 days), signed with secret key |
| 🛡️ HTTP Security Headers | `helmet` adds XSS, HSTS, clickjacking protection |
| 🌐 CORS Protection | Only allows requests from configured CLIENT_URL |
| 🚫 Role-Based Access | `protect` + `adminOnly` middleware chain on all sensitive routes |
| ✅ Input Validation | `express-validator` validates all user inputs before controller |
| 🙈 Password Never Returned | `select: false` on password field + toJSON transform strips it |
| 💬 Generic Auth Errors | "Invalid email or password" — never reveals which field is wrong |
| 🔇 Error Details Hidden | Stack traces only shown in `development` mode |
| 📦 Soft Delete | Products marked `isActive: false` — data preserved for order history |

---

## 🚀 Deployment Guide

### Backend → Railway / Render
```bash
# 1. Set environment variables in your hosting dashboard:
MONGO_URI=mongodb+srv://...  # MongoDB Atlas connection string
JWT_SECRET=...               # Strong random secret (32+ chars)
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app

# 2. Start command:
npm start
```

### Frontend → Vercel
```bash
# 1. In Vercel dashboard, set environment variable:
VITE_API_URL=https://your-backend.railway.app/api

# 2. Build command:
npm run build

# 3. Output directory:
dist
```

### MongoDB → Atlas (Free Tier)
1. Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Add your server IP to Network Access
4. Copy connection string → paste into `MONGO_URI`

---

## 🧪 Testing the APIs

### Using Browser Console (Quick Test)
```js
// 1. Register
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test', email: 'test@test.com', password: 'Test@123' })
}).then(r => r.json()).then(d => { console.log(d); window._token = d.token; })

// 2. Get Products
fetch('http://localhost:5000/api/products?category=Electronics&limit=3')
  .then(r => r.json()).then(console.log)

// 3. Protected Route (use token from step 1)
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': 'Bearer ' + window._token }
}).then(r => r.json()).then(console.log)
```

### Using Postman
```
Base URL: http://localhost:5000/api

# Auth
POST /auth/register  Body: { "name": "...", "email": "...", "password": "..." }
POST /auth/login     Body: { "email": "...", "password": "..." }

# Set Authorization header for protected routes:
Type: Bearer Token
Token: <paste token from login response>
```

---

## 📖 Key Concepts Learned

This project covers the following real-world engineering concepts:

| Concept | Where Used |
|---|---|
| **MVC Architecture** | server/ folder structure |
| **JWT Stateless Auth** | authMiddleware.js + AuthContext.jsx |
| **Bcrypt Password Hashing** | User.js pre-save hook |
| **Mongoose Pre-save Hooks** | User.js password hashing |
| **Global Error Handling** | errorHandler.js + ApiError.js |
| **asyncHandler Pattern** | All controllers (no try/catch clutter) |
| **Soft Delete** | Product.isActive flag |
| **Order Item Snapshots** | Order.js embedded items |
| **React Context + Hooks** | AuthContext, CartContext |
| **Axios Interceptors** | api.js token injection + 401 redirect |
| **URL-Driven State** | Products.jsx useSearchParams |
| **Optimistic UI Update** | ManageOrders.jsx status change |
| **Component Scope Bug** | Checkout.jsx Field defined outside component |
| **Role-Based Routes** | ProtectedRoute + AdminRoute components |
| **Nested Routing** | App.jsx with public / admin / auth layouts |

---

## 🤝 Contributing

Contributions are welcome! Here's how:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m "feat: add amazing feature"

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — free to use for personal and commercial projects.

---

## 👨‍💻 Author

**COZYkrish**

[![GitHub](https://img.shields.io/badge/GitHub-COZYkrish-black?style=flat-square&logo=github)](https://github.com/COZYkrish)

---

<div align="center">

**⭐ If this project helped you, please give it a star on GitHub! ⭐**

Built with ❤️ using the **MERN Stack**

`MongoDB` · `Express.js` · `React` · `Node.js`

</div>