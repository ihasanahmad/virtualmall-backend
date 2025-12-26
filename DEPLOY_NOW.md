# 🚀 Quick Deployment Checklist

## Your Generated Credentials

**JWT Secret (SAVE THIS):**
```
JWT_SECRET=a753b566a9937bba210d2c4270e36a9e8eeb6cd04edf00969cce1f8277aceb010
```

---

## Step 1: MongoDB Atlas ✅ (Page Already Open)

**Follow these steps in the browser:**

1. **Sign up** (use Google for fastest)
2. Click **"Build a Database"** → Choose **FREE** (M0)
3. **Cloud Provider**: AWS, **Region**: Choose closest
4. **Cluster Name**: `virtualmegamall`
5. Click **"Create"**

**Create Database User:**
- Username: `admin`
- Password: (Auto-generate and SAVE IT)
- Click **"Create User"**

**Network Access:**
- Click **"Add IP Address"**
- Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
- Click **"Confirm"**

**Get Connection String:**
- Click **"Connect"** → **"Drivers"** → Copy connection string
- Replace `<password>` with your actual password
- **PASTE IT HERE** ↓

```
mongodb+srv://admin:YOUR_PASSWORD@virtualmegamall.xxxxx.mongodb.net/virtualmegamall
```

---

## Step 2: Cloudinary (Opening in new tab...)

**Once page opens:**
1. Sign up (use email or Google)
2. Go to **Dashboard**
3. Copy these 3 values:
   - Cloud Name: `____________`
   - API Key: `____________`
   - API Secret: `____________`

---

## Step 3: Railway (Opening in new tab...)

**Once page opens:**
1. Login with **GitHub**
2. Click **"New Project"**
3. Choose **"Deploy from GitHub repo"**
4. Select: `virtualmall-backend`
5. Wait for deploy...

**Then add these environment variables:**
```bash
MONGODB_URI=<paste from Step 1>
JWT_SECRET=a753b566a9937bba210d2c4270e36a9e8eeb6cd04edf00969cce1f8277aceb010
CLOUDINARY_CLOUD_NAME=<from Step 2>
CLOUDINARY_API_KEY=<from Step 2>
CLOUDINARY_API_SECRET=<from Step 2>
FRONTEND_URL=https://virtualmegamall.vercel.app
PORT=5000
NODE_ENV=production
```

6. **Copy Railway URL** (from Domains tab)

---

## Step 4: Vercel - Update Existing + Deploy New

### Update Customer Frontend (already deployed)
1. Go to Vercel dashboard → **virtualmegamall** project
2. Settings → Environment Variables
3. Add: `VITE_API_URL=<Railway URL>/api`
4. Redeploy

### Deploy Admin Dashboard
1. Vercel → New Project → `virtualmall-admin`
2. Framework: Vite
3. Environment Variable: `VITE_API_URL=<Railway URL>/api`
4. Deploy

### Deploy Vendor Dashboard
1. Vercel → New Project → `virtualmall-vendor`
2. Framework: Vite
3. Environment Variable: `VITE_API_URL=<Railway URL>/api`
4. Deploy

---

## ✅ Final URLs

- Customer: https://virtualmegamall.vercel.app
- Admin: https://virtualmall-admin.vercel.app
- Vendor: https://virtualmall-vendor.vercel.app
- Backend: https://your-app.railway.app

**DONE! 🎉**
