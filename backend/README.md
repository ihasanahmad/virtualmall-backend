# Virtual Mega Mall - Backend API

Enterprise-level multi-vendor e-commerce platform backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Multi-vendor Support**: Brands can register, manage products, and process orders
- **Role-Based Access Control (RBAC)**: Admin, Vendor, and Customer roles
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Product Management**: CRUD operations with image upload to Cloudinary
- **Brand Approval Workflow**: Admin approval system for new brand registrations
- **Advanced Security**: Helmet, rate limiting, XSS protection, NoSQL injection prevention
- **Email Notifications**: Order confirmations and vendor notifications
- **Payment Gateway Integration**: JazzCash, EasyPaisa, and Stripe (ready for implementation)
- **Commission Tracking**: Automated commission calculation per brand/category

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Email service (Gmail or SendGrid)

## 🛠️ Installation

1. **Clone the repository** (or navigate to backend folder)
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your actual credentials

   ```bash
   cp .env.example .env
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Update `MONGODB_URI` in `.env`

5. **Set up Cloudinary**
   - Create account at [Cloudinary](https://cloudinary.com/)
   - Get your credentials from dashboard
   - Update Cloudinary config in `.env`

## 🏃‍♂️ Running the Server

### Development mode (with auto-restart)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |
| GET | `/logout` | Logout user | Private |

### Products (`/api/products`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all products (with filters) | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Vendor/Admin |
| PUT | `/:id` | Update product | Vendor/Admin |
| DELETE | `/:id` | Delete product | Vendor/Admin |

**Query Parameters for GET /api/products:**
- `category` - Filter by category ID
- `brand` - Filter by brand ID
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search in name/description
- `sort` - Sort by: `price-asc`, `price-desc`, `newest`, `popular`
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Categories (`/api/categories`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all categories | Public |
| GET | `/:id` | Get single category | Public |
| POST | `/` | Create category | Admin |
| PUT | `/:id` | Update category | Admin |
| DELETE | `/:id` | Delete category | Admin |

### Brands (`/api/brands`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all brands | Public |
| GET | `/:id` | Get single brand | Public |
| POST | `/` | Register new brand | Vendor |
| PUT | `/:id` | Update brand | Vendor/Admin |
| PUT | `/:id/approve` | Approve brand | Admin |
| PUT | `/:id/reject` | Reject brand | Admin |

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Or in httpOnly cookie (automatically set on login).

### User Roles
- **Customer**: Can browse, purchase, review
- **Vendor**: Can manage own brand and products
- **Admin**: Full access to all resources

## 📝 Example Requests

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Product (Vendor)
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: Nike Air Max
description: Premium running shoes
category: <category_id>
price: 12000
inventory: 50
images: <file1>, <file2>
```

### Register Brand (Vendor)
```bash
POST /api/brands
Authorization: Bearer <token>
Content-Type: multipart/form-data

name: My Brand
description: Premium clothing brand
logo: <file>
businessInfo: { ... }
bankDetails: { ... }
```

## 🗂️ Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── cloudinary.js      # Cloudinary config
├── models/
│   ├── User.js            # User model (Admin/Vendor/Customer)
│   ├── Brand.js           # Brand/Store model
│   ├── Product.js         # Product model
│   ├── Category.js        # Category model
│   ├── Cart.js            # Shopping cart
│   ├── Order.js           # Orders with commission tracking
│   └── Review.js          # Product reviews
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── productController.js
│   ├── brandController.js
│   └── categoryController.js
├── routes/
│   ├── auth.js
│   ├── product.js
│   ├── brand.js
│   └── category.js
├── middleware/
│   ├── auth.js            # JWT verification & RBAC
│   └── upload.js          # Multer file upload
├── utils/
│   ├── jwt.js             # JWT utilities
│   └── emailService.js    # Email templates & sending
├── server.js              # Express app & server
├── .env                   # Environment variables
└── package.json
```

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **Rate Limiting**: Prevents brute force attacks (100 req/10min)
- **XSS Protection**: Sanitizes user input
- **NoSQL Injection Prevention**: Sanitizes MongoDB queries
- **CORS**: Configured for specific origins
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt with 10 salt rounds
- **Input Validation**: express-validator for request validation

## 🚧 TODO / Upcoming Features

- [ ] Cart APIs (add, update, remove items)
- [ ] Order creation and management
- [ ] Payment gateway integration (JazzCash, EasyPaisa, Stripe)
- [ ] Review & rating system
- [ ] Wishlist functionality
- [ ] Admin dashboard Analytics APIs
- [ ] Vendor dashboard Analytics APIs
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] Real-time notifications (Socket.io)
- [ ] Search optimization (Elasticsearch/Algolia)
- [ ] Unit tests

## 📧 Email Templates

Email service is configured with Nodemailer. Templates available:
- Order confirmation (customer)
- Order notification (vendor)
- Brand approval/rejection (vendor)

## 🌍 Environment Variables

See `.env.example` for all required environment variables:
- MongoDB connection string
- JWT secrets
- Cloudinary credentials
- Email service config
- Payment gateway credentials (JazzCash, EasyPaisa, Stripe)

## 🤝 Contributing

This is a proprietary project for Virtual Mega Mall.

## 📄 License

Proprietary - All rights reserved

## 👨‍💻 Developer

Virtual Mega Mall Development Team

---

**Need Help?** Contact the development team or refer to the implementation plan document.
