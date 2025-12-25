# Deployment Quick Start

## 1️⃣ Backend (Railway)
```bash
# Go to https://railway.app
# New Project → Deploy from GitHub → select backend folder
# Add MongoDB from Railway or use MongoDB Atlas
# Set environment variables from .env.example
# Deploy automatically happens
```

## 2️⃣ Frontends (Vercel)
```bash
# Go to https://vercel.com
# Import Project → select repo

# For each frontend (admin-dashboard, vendor-dashboard, customer-frontend):
# - Root Directory: <folder-name>
# - Framework: Vite
# - Environment Variable: VITE_API_URL=<your-backend-url>/api
# - Deploy
```

## 3️⃣ Environment Variables

### Backend (Railway):
```
MONGODB_URI=<railway-mongodb-or-atlas-url>
JWT_SECRET=<random-32-char-string>
CLOUDINARY_CLOUD_NAME=<from-cloudinary-dashboard>
CLOUDINARY_API_KEY=<from-cloudinary>
CLOUDINARY_API_SECRET=<from-cloudinary>
```

### All Frontends (Vercel):
```
VITE_API_URL=https://your-backend.up.railway.app/api
```

## 4️⃣ Create Admin Account
```bash
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@test.com","password":"Admin@123","role":"admin"}'
```

Done! 🎉

Full guide: See DEPLOYMENT.md
