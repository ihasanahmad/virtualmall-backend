# Virtual Mega Mall - Admin Dashboard

Admin panel for managing the Virtual Mega Mall e-commerce platform.

## Features

- ✅ Admin authentication with role verification
- ✅ Dashboard with analytics and revenue charts
- ✅ Brand approval workflow (approve/reject)
- ✅ Brand management with commission rates
- ✅ Category management (coming soon)
- ✅ User management (coming soon)
- ✅ Premium dark theme with gold accents

## Tech Stack

- React 18 + Vite
- Material-UI (MUI)
- React Router v6
- Axios for API calls
- Recharts for analytics visualization

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

The admin dashboard will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Environment Variables

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

## Default Admin Login

To create an admin user, use the backend API:

```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Admin",
  "email": "admin@virtualmegamall.com",
  "password": "admin123",
  "role": "admin"
}
```

Then login with these credentials in the admin panel.

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── AdminLayout.jsx    # Main layout with sidebar
│   │   └── PrivateRoute.jsx   # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Dashboard.jsx       # Analytics dashboard
│   │   └── BrandApprovals.jsx  # Brand approval workflow
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main app with routing
│   └── main.jsx                # Entry point
├── .env                        # Environment variables
└── package.json
```

## Available Pages

- `/login` - Admin login
- `/dashboard` - Main dashboard with stats
- `/brands/approvals` - Pending brand approvals
- `/brands` - Manage all brands (coming soon)
- `/categories` - Manage categories (coming soon)
- `/users` - User management (coming soon)
- `/analytics` - Detailed analytics (coming soon)
- `/settings` - Platform settings (coming soon)

## API Integration

The admin panel connects to the backend API for:
- Authentication
- Brand approval/rejection
- Commission management
- Analytics data
- Product moderation

See `src/services/api.js` for all API endpoints.

## License

Proprietary - Virtual Mega Mall
