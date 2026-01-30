
![Supamarket Banner](/public/banner1.png)

# Supamarket
A production-ready Supermarket Management System built with Next.js and Appwrite, featuring real M-Pesa payment integration, multi-branch inventory management, and a robust role-based access control system.

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-latest-f02e65?style=flat-square&logo=appwrite)](https://appwrite.io/)

## ✨ Features

### 💰 Payment Integration
- **Real M-Pesa STK Push** - Integrated with Safaricom Daraja API (Sandbox & Production ready).
- **Callback Handling** - Secure webhook handler for payment verification.
- **Order Synchronization** - Automatic order status and inventory updates upon successful payment.
- **Payment History** - Detailed transaction logs with M-Pesa receipt numbers.

### 🔐 Role-Based Access Control (RBAC)
- **Admin Dashboard** - Full control over products, branches, inventory, and sales reports.
- **Customer Dashboard** - Personalized shopping experience, branch selection, and order tracking.
- **Middleware Protection** - Server-side route guards enforcing role permissions.
- **Secure Authentication** - Email/Password auth with HTTP-only session cookies.

### 📦 Inventory & Branch Management
- **Multi-Branch Support** - Manage inventory across different physical locations.
- **Low Stock Alerts** - Automatic notifications for products hitting critical levels.
- **Stock Replenishment** - Streamlined restocking workflow for admins.
- **Real-time Inventory** - Live stock deduction upon successful purchases.

### 📊 Admin Analytics
- **Sales Reports** - Visual analytics for revenue, orders, and products sold.
- **Recent Activity** - Track orders and inventory changes in real-time.
- **Branch Performance** - Compare sales and stock levels across different branches.

### 🎨 Modern UI/UX
- **Responsive Design** - Optimized for mobile, tablet, and desktop using Tailwind CSS v4.
- **Component Library** - Built with shadcn/ui for consistent and accessible components.
- **State Management** - Efficient client-side state using Zustand.
- **Form Validation** - Robust input handling with React Hook Form and Zod.

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** or **pnpm**
- **Appwrite** Cloud or Self-hosted instance
- **Safaricom Daraja API** credentials (Consumer Key, Secret, Shortcode, Passkey)
- **ngrok** (for local testing of M-Pesa callbacks)

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Alaric-senpai/supamarket.git
cd supamarket
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_endpoint
APPWRITE_API_KEY=your_api_key
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id

# Appwrite Collections
APPWRITE_BRANCHES_COLLECTION_ID=branches
APPWRITE_PRODUCTS_COLLECTION_ID=products
APPWRITE_INVENTORY_COLLECTION_ID=inventory
APPWRITE_ORDERS_COLLECTION_ID=orders
APPWRITE_ORDER_ITEMS_COLLECTION_ID=order_items
APPWRITE_PAYMENTS_COLLECTION_ID=payments
APPWRITE_RESTOCK_LOGS_COLLECTION_ID=restocks

# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORT_CODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=your_ngrok_url/api/payments/callback
MPESA_ENVIRONMENT=sandbox

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
pnpm dev
```

## 📁 Project Structure

```
├── actions/              # Server Actions (Auth, Products, Orders, Payments)
├── app/                  # Next.js App Router
│   ├── (admin)/admin     # Admin-only dashboard & management
│   ├── (client)/dashboard # Customer interface & checkout
│   ├── (auth)/           # Login & Registration
│   └── api/              # M-Pesa Callbacks & API endpoints
├── components/           # React Components
│   ├── admin/            # Admin-specific UI
│   ├── customer/         # Customer-specific UI
│   ├── forms/            # Reusable form components
│   └── sidebar/          # Dynamic navigation sidebars
├── config/               # Appwrite & M-Pesa configuration
├── lib/                  # Shared utilities, schemas, and state (Zustand)
├── server/               # Server-side clients & cookie management
└── types/                # Appwrite-generated TypeScript types
```

## 🔧 Deployment

### M-Pesa Callback Handling
For local development, use **ngrok** to expose your local server:
```bash
ngrok http 3000
```
Update `MPESA_CALLBACK_URL` in your `.env` with the ngrok URL.

### Production
1. **Appwrite**: Update your project's platform settings to include your production domain.
2. **Daraja API**: Switch to a Production Shortcode and update credentials.
3. **Environment**: Ensure all variables are correctly set in your CI/CD provider (Vercel, Railway, etc.).

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by [Alaric senpai](https://devcharles.me)**
