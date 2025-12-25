# Virtual Mega Mall - Vendor Dashboard

Vendor portal for managing brands, products, and orders on Virtual Mega Mall.

## Features

- ✅ Vendor authentication (register/login)
- ✅ Multi-step brand registration with logo upload
- ✅ Brand status tracking (pending/approved/rejected)
- ✅ Dashboard with sales analytics & revenue charts
- ✅ Product management (CRUD operations)
- ✅ Product image upload (up to 5 images)
- ✅ Inventory tracking
- ✅ Orders management (coming soon)
- ✅ Premium dark theme with gold accents

## Tech Stack

- React 18 + Vite
- Material-UI (MUI)
- React Router v6
- Axios for API calls
- Recharts for analytics visualization
- React Dropzone for file uploads

## Getting Started

### Prerequisites

- Node.js (v14+)
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The vendor dashboard will be available at `http://localhost:5174`

### Build for Production

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Vendor Registration Flow

1. **Register Account** - Create vendor account (role: vendor)
2. **Register Brand** - Complete 3-step brand registration:
   - Brand Info (name, description, logo)
   - Business Details (legal name, tax ID, registration number)
   - Bank Information (account details for payments)
3. **Wait for Approval** - Admin reviews brand application (24-48 hours)
4. **Start Selling** - Once approved, add products and manage inventory

## Project Structure

```
vendor-dashboard/
├── src/
│   ├── components/
│   │   ├── VendorLayout.jsx   # Main layout with sidebar
│   │   └── PrivateRoute.jsx   # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login/Register page
│   │   ├── BrandRegistration.jsx  # Multi-step brand form
│   │   ├── Dashboard.jsx       # Analytics dashboard
│   │   ├── ProductList.jsx     # Product listing
│   │   └── AddProduct.jsx      # Add/Edit product form
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main app with routing
│   └── main.jsx                # Entry point
├── .env                        # Environment variables
└── package.json
```

## Available Pages

- `/login` - Vendor login/register
- `/register-brand` - Brand registration (after account creation)
- `/dashboard` - Main dashboard with analytics
- `/products` - Product listing
- `/products/add` - Add new product
- `/orders` - Order management (coming soon)
- `/analytics` - Detailed analytics (coming soon)
- `/store` - Store settings (coming soon)

## API Integration

The vendor dashboard connects to these backend endpoints:

- `/api/auth/register` - Vendor registration
- `/api/auth/login` - Vendor login
- `/api/brands` - Brand registration & management
- `/api/products` - Product CRUD operations
- `/api/categories` - Get categories for product creation

## Brand Status

- **Pending** - Application under review
- **Approved** - Can add products and sell
- **Rejected** - Application rejected (reason provided)

## Commission

Platform charges commission on each sale (default: 15%, customizable by admin per brand/category).

## License

Proprietary - Virtual Mega Mall

---

**Start selling on Pakistan's first 3D shopping platform!**
