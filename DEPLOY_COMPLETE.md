# 🚀 COPY-PASTE DEPLOYMENT GUIDE

## ✅ Your Credentials (All Ready!)

### Cloudinary
- Cloud Name: `dbf0wnz2w`
- API Key: `133993682795168`
- API Secret: `YzeioKjzJ8nqIonPtNnwpfxUHls`

### MongoDB
- Connection: `mongodb+srv://ihaxanahmad_db_user:YOUR_DB_PASSWORD@virtualmall.u9yud0i.mongodb.net/virtualmegamall`
- **⚠️ Replace YOUR_DB_PASSWORD with your actual MongoDB password!**

### JWT Secret (Generated)
- `a753b566a9937bba210d2c4270e36a9e8eeb6cd04edf00969cce1f8277aceb010`

---

## 📦 STEP 2: Deploy Backend on Railway (5 min)

### Go to: https://railway.app/new

1. Click **"Deploy from GitHub repo"**
2. Select **`virtualmall-backend`**
3. Click **"Deploy Now"**
4. Wait for build to complete (~2 min)

### Add Environment Variables:

Click **"Variables"** tab, then click **"Raw Editor"** and paste this ENTIRE block:

```env
MONGODB_URI=mongodb+srv://ihaxanahmad_db_user:YOUR_DB_PASSWORD@virtualmall.u9yud0i.mongodb.net/virtualmegamall
JWT_SECRET=a753b566a9937bba210d2c4270e36a9e8eeb6cd04edf00969cce1f8277aceb010
CLOUDINARY_CLOUD_NAME=dbf0wnz2w
CLOUDINARY_API_KEY=133993682795168
CLOUDINARY_API_SECRET=YzeioKjzJ8nqIonPtNnwpfxUHls
FRONTEND_URL=https://virtualmegamall.vercel.app
PORT=5000
NODE_ENV=production
```

**⚠️ IMPORTANT:** Replace `YOUR_DB_PASSWORD` with your MongoDB user password!

### Get Railway URL:
5. Settings → Domains → Copy URL (e.g., `https://virtualmall-production-xxxx.up.railway.app`)
6. **Save this URL - you'll need it for next steps!**

---

## 🌐 STEP 3: Update Customer Frontend (Vercel) (3 min)

### Go to: https://vercel.com/dashboard

1. Find your existing project: **`virtualmegamall`**
2. Click **Settings**
3. Click **Environment Variables**
4. Add this variable:

```
Name: VITE_API_URL
Value: https://YOUR_RAILWAY_URL/api
```
(Replace YOUR_RAILWAY_URL with the URL you got from Step 2)

5. Click **"Save"**
6. Go to **Deployments** → Click **"Redeploy"** on latest deployment

---

## 🔐 STEP 4: Deploy Admin Dashboard (5 min)

### Go to: https://vercel.com/new

1. Click **"Add New..."** → **"Project"**
2. Import **`virtualmall-admin`** repository
3. Framework Preset: **Vite** (auto-detected)
4. Add Environment Variable:

```
Name: VITE_API_URL
Value: https://YOUR_RAILWAY_URL/api
```

5. Click **"Deploy"**
6. Copy your admin URL (e.g., `https://virtualmall-admin.vercel.app`)

---

## 🏪 STEP 5: Deploy Vendor Dashboard (5 min)

### Go to: https://vercel.com/new  

1. Click **"Add New..."** → **"Project"**
2. Import **`virtualmall-vendor`** repository
3. Framework Preset: **Vite** (auto-detected)
4. Add Environment Variable:

```
Name: VITE_API_URL
Value: https://YOUR_RAILWAY_URL/api
```

5. Click **"Deploy"**
6. Copy your vendor URL (e.g., `https://virtualmall-vendor.vercel.app`)

---

## 🎉 YOUR LIVE URLS

After completion, you'll have:

- **Customer:** https://virtualmegamall.vercel.app
- **Admin:** https://virtualmall-admin.vercel.app
- **Vendor:** https://virtualmall-vendor.vercel.app
- **Backend API:** https://your-railway-url.railway.app

---

## ✅ VERIFICATION

Test your backend:
1. Open: `https://YOUR_RAILWAY_URL/`
2. Should see: `{"success": true, "message": "Virtual Mega Mall API"}`

Test customer frontend:
1. Open: https://virtualmegamall.vercel.app
2. Should load without errors

---

## 🔧 If Something Breaks

**Backend not deploying?**
- Check Railway logs
- Verify all env vars are set
- Ensure MongoDB password is correct

**Frontend shows errors?**
- Check browser console (F12)
- Verify `VITE_API_URL` is correct
- Redeploy after fixing env vars

---

**TOTAL TIME: ~20 MINUTES**

Just follow these 5 steps in order and you're DONE! 🚀
