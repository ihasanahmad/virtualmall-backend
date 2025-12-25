# Virtual Mega Mall - Deployment Guide

## 🚀 Quick Deployment Overview

This guide will help you deploy all 4 applications of Virtual Mega Mall:
1. **Backend API** → Railway (recommended) or Render
2. **Admin Dashboard** → Vercel
3. **Vendor Dashboard** → Vercel  
4. **Customer Frontend** → Vercel

---

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier available)
- Cloudinary account (free tier available)
- Accounts on deployment platforms (all have free tiers)

---

## Step 1: Deploy Backend API (Railway - Recommended)

### Why Railway?
- Free tier available
- Easy MongoDB integration
- Automatic HTTPS
- Simple environment variables

### Deployment Steps:

1. **Sign up/Login**: https://railway.app/

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select `virtual-mega-mall` repository
   - Select `backend` folder as root directory

3. **Add MongoDB**:
   - Click "New" → "Database" → "MongoDB"
   - Railway will create a MongoDB instance
   - Copy the connection string

4. **Set Environment Variables**:
   Click "Variables" tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-railway-mongodb-url>
   JWT_SECRET=<generate-random-string-32-chars>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<your-email>
   EMAIL_PASS=<your-app-password>
   EMAIL_FROM=Virtual Mega Mall <noreply@virtualmegamall.com>
   FRONTEND_URL=https://your-customer-frontend.vercel.app
   ```

5. **Deploy**:
   - Railway auto-deploys on push
   - Wait for build to complete
   - Copy your backend URL (e.g., `https://your-app.up.railway.app`)

### Alternative: Render.com

1. Go to https://render.com/
2. Create "New Web Service"
3. Connect GitHub repo, select `backend` folder
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add same environment variables as above

---

## Step 2: Deploy Admin Dashboard (Vercel)

### Deployment Steps:

1. **Sign up/Login**: https://vercel.com/

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import `virtual-mega-mall` repository
   - Click "Continue"

3. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: **admin-dashboard**
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Your admin panel is live! (e.g., `https://admin-dashboard.vercel.app`)

---

## Step 3: Deploy Vendor Dashboard (Vercel)

Same process as Admin Dashboard:

1. **Vercel** → "Add New" → "Project"
2. **Import** same repository
3. **Configure**:
   - Framework: **Vite**
   - Root Directory: **vendor-dashboard**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```
5. **Deploy**

---

## Step 4: Deploy Customer Frontend (Vercel)

Same process:

1. **Vercel** → "Add New" → "Project"
2. **Import** same repository
3. **Configure**:
   - Framework: **Vite**
   - Root Directory: **customer-frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/api
   ```
5. **Deploy**

---

## Step 5: Setup MongoDB Atlas (If not using Railway MongoDB)

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register

2. **Create Cluster**:
   - Choose FREE tier (M0)
   - Select region closest to you
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access"
   - Add new user with password
   - Save credentials

4. **Allow Network Access**:
   - Go to "Network Access"
   - Add IP: `0.0.0.0/0` (allow from anywhere)

5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Use this in backend `MONGODB_URI`

---

## Step 6: Setup Cloudinary

1. **Sign up**: https://cloudinary.com/users/register/free

2. **Get Credentials**:
   - Go to Dashboard
   - Copy:
     - Cloud Name
     - API Key
     - API Secret

3. **Add to Backend**:
   - Use in Railway environment variables

---

## Step 7: Update Backend CORS

After deploying frontends, update backend `server.js`:

```javascript
const corsOptions = {
  origin: [
    'https://your-admin-dashboard.vercel.app',
    'https://your-vendor-dashboard.vercel.app',
    'https://your-customer-frontend.vercel.app',
    'http://localhost:5173', // For local development
    'http://localhost:5174'
  ],
  credentials: true
};
```

Push changes to trigger redeploy.

---

## Post-Deployment Checklist

### ✅ Backend (Railway/Render)
- [ ] API accessible at your backend URL
- [ ] Test endpoint: `https://your-backend.railway.app/`
- [ ] MongoDB connected (check logs)
- [ ] Environment variables set

### ✅ Admin Dashboard
- [ ] Login page loads
- [ ] Can create admin account via API
- [ ] Dashboard displays
- [ ] Brand approvals work

### ✅ Vendor Dashboard
- [ ] Registration works
- [ ] Can upload brand logo
- [ ] Product creation works
- [ ] Images upload to Cloudinary

### ✅ Customer Frontend
- [ ] Homepage loads
- [ ] Product catalog displays
- [ ] Can add to cart
- [ ] Checkout flow works
- [ ] Orders placed successfully

---

## Testing Your Deployment

### 1. Create Admin Account
```bash
curl -X POST https://your-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@virtualmegamall.com",
    "password": "Admin@123",
    "role": "admin"
  }'
```

### 2. Login to Admin Panel
- Go to: `https://your-admin-dashboard.vercel.app`
- Email: admin@virtualmegamall.com
- Password: Admin@123

### 3. Register Vendor
- Go to: `https://your-vendor-dashboard.vercel.app`
- Click "Register" tab
- Create vendor account

### 4. Test Customer Flow
- Go to: `https://your-customer-frontend.vercel.app`
- Browse products
- Add to cart
- Checkout

---

## Custom Domains (Optional)

### Vercel Custom Domain:
1. Go to project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Railway Custom Domain:
1. Go to project settings
2. Click "Networking"
3. Add custom domain
4. Update DNS CNAME record

---

## Continuous Deployment

All platforms support automatic deployment:
- **Push to GitHub** → Automatic deployment
- **Pull Request** → Preview deployment
- **Merge to main** → Production deployment

---

## Monitoring & Logs

### Railway:
- Click "Deployments" to see logs
- Click "Metrics" for performance

### Vercel:
- Click "Deployments" for build logs
- Click "Analytics" for traffic

---

## Troubleshooting

### Backend Not Connecting:
- Check Railway logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend Build Failed:
- Check Vercel deployment logs
- Verify `VITE_API_URL` is correct
- Ensure `package.json` has correct scripts

### CORS Errors:
- Update backend CORS origins
- Include frontend URLs in allowed origins
- Redeploy backend

### Images Not Uploading:
- Verify Cloudinary credentials
- Check browser console for errors
- Test Cloudinary connection

---

## Cost Estimates

**FREE TIER (Good for testing/MVP):**
- Railway: Free tier (500 hours/month)
- Vercel: Free (3 apps, unlimited bandwidth)
- MongoDB Atlas: Free (M0 cluster, 512MB)
- Cloudinary: Free (25GB storage, 25GB bandwidth)

**TOTAL: $0/month for starting**

**PAID TIER (Production ready):**
- Railway: ~$5-20/month (depending on usage)
- Vercel Pro: $20/month per member
- MongoDB Atlas: ~$9/month (M10 shared)
- Cloudinary: ~$0 (pay as you grow)

---

## Your Live URLs

After deployment, you'll have:

```
Backend API:     https://your-app.up.railway.app
Admin Panel:     https://admin-vmm.vercel.app
Vendor Portal:   https://vendor-vmm.vercel.app
Customer Site:   https://virtualmegamall.vercel.app
```

## 🎉 Deployment Complete!

Your Virtual Mega Mall is now LIVE and accessible worldwide!
