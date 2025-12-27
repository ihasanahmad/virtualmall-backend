# 🚀 DEPLOYMENT CHECKLIST & INSTRUCTIONS

## ⚠️ IMPORTANT: I Cannot Access Vercel/Railway Dashboards
I've prepared everything needed for deployment, but YOU need to complete these steps in your dashboard.

---

## ✅ What I've Done

1. ✅ Created deployment configuration files:
   - `admin-dashboard/vercel.json`
   - `vendor-dashboard/vercel.json`
   - `customer-frontend/vercel.json` (already exists)
   - `backend/railway.json` (already exists)

2. ✅ All code pushed to GitHub repository
3. ✅ Environment variable templates created

---

## 🔧 What YOU Need to Do

### Step 1: Deploy Backend on Railway

1. Go to: https://railway.app/dashboard
2. Find your `virtualmall-backend` project OR create new one
3. **ADD THESE NEW ENVIRONMENT VARIABLES:**

```env
# New payment gateway variables
STRIPE_SECRET_KEY=sk_test_51... (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_... (setup webhook at https://dashboard.stripe.com/test/webhooks)

JAZZCASH_MERCHANT_ID=MC12345 (test mode OK for now)
JAZZCASH_PASSWORD=test_password
JAZZCASH_INTEGRITY_SALT=test_salt
JAZZCASH_RETURN_URL=https://your-customer-frontend.vercel.app/payment/success
JAZZCASH_POST_URL=https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/

EASYPAISA_STORE_ID=store123 (test mode OK for now)
EASYPAISA_PASSWORD=test_password  
EASYPAISA_MERCHANT_ID=merchant123
EASYPAISA_RETURN_URL=https://your-customer-frontend.vercel.app/payment/success
EASYPAISA_POST_URL=https://easypaystg.easypaisa.com.pk/easypay/Index.jsf

BACKEND_URL=https://your-backend.up.railway.app
FRONTEND_URL=https://your-customer-frontend.vercel.app
```

4. Click "Deploy" or wait for auto-deploy
5. **COPY YOUR BACKEND URL** (e.g., `https://virtualmall-backend-production.up.railway.app`)

---

### Step 2: Deploy Customer Frontend on Vercel

1. Go to: https://vercel.com/dashboard
2. Find `virtual-mega-mall-customer` project OR:
   - Click "Add New" → "Project"
   - Import `virtual-mega-mall` repo
   - Root Directory: `customer-frontend`
   - Framework: Vite
   - Click "Deploy"

3. **ADD ENVIRONMENT VARIABLES:**
   - Go to Project Settings → Environment Variables
   - Add:
   ```env
   VITE_API_URL=https://your-backend.up.railway.app/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51... (from Stripe dashboard)
   ```

4. **Trigger Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

---

### Step 3: Deploy Admin Dashboard on Vercel

1. Go to: https://vercel.com/dashboard
2. Find `virtual-mega-mall-admin` project OR create new:
   - Import `virtual-mega-mall` repo
   - Root Directory: `admin-dashboard`
   - Framework: Vite

3. **ADD ENVIRONMENT VARIABLE:**
   ```env
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

4. Trigger Redeploy if needed

---

### Step 4: Deploy Vendor Dashboard on Vercel

1. Go to: https://vercel.com/dashboard
2. Find `virtual-mega-mall-vendor` project OR create new:
   - Import `virtual-mega-mall` repo
   - Root Directory: `vendor-dashboard`
   - Framework: Vite

3. **ADD ENVIRONMENT VARIABLE:**
   ```env
   VITE_API_URL=https://your-backend.up.railway.app/api
   ```

4. Trigger Redeploy if needed

---

## 🎯 Quick Stripe Setup (FOR TESTING)

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (click "Reveal test key", starts with `sk_test_`)
4. Go to: https://dashboard.stripe.com/test/webhooks
5. Click "+ Add endpoint"
6. Endpoint URL: `https://your-backend.up.railway.app/api/payments/stripe/webhook`
7. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
8. Copy **Signing secret** (starts with `whsec_`)

---

## ✅ Verification Checklist

After deployment, verify:

### Backend (Railway):
- [ ] Deployment successful
- [ ] All environment variables set (payment gateways)
- [ ] Backend URL accessible: `https://your-backend.up.railway.app`
- [ ] API responds: `https://your-backend.up.railway.app/api/products`

### Customer Frontend (Vercel):
- [ ] Deployment successful  
- [ ] Environment variables set (VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY)
- [ ] Homepage loads with carousel
- [ ] Products load
- [ ] Can add to cart
- [ ] Checkout page loads
- [ ] Payment methods visible

### Admin Dashboard (Vercel):
- [ ] Deployment successful
- [ ] VITE_API_URL set
- [ ] Login works
- [ ] Analytics page loads with charts
- [ ] Brand approvals work

### Vendor Dashboard (Vercel):
- [ ] Deployment successful
- [ ] VITE_API_URL set
- [ ] Login works
- [ ] Analytics page loads
- [ ] Orders page displays
- [ ] Can update order status

---

## 🔍 How to Check Deployment Status

### Vercel:
1. Go to https://vercel.com/dashboard
2. Find your project
3. Check "Deployments" tab
4. Latest deployment should show "Ready"
5. Click deployment to see build logs if errors

### Railway:
1. Go to https://railway.app/dashboard
2. Find your project
3. Check "Deployments" tab
4. Latest should show "Success"
5. Click to see logs if errors

---

## 🚨 Common Issues & Fixes

### Issue: Vercel build fails
**Fix:** Check if `package.json` has correct `build` script
```json
"scripts": {
  "build": "vite build"
}
```

### Issue: "VITE_API_URL is not defined"
**Fix:** Add environment variable in Vercel project settings, then redeploy

### Issue: Payment not working
**Fix:** 
1. Check Stripe keys are correct
2. Verify `VITE_STRIPE_PUBLISHABLE_KEY` set in customer frontend
3. Check Railway has `STRIPE_SECRET_KEY`

### Issue: Charts not loading in analytics
**Fix:** Verify backend analytics endpoints are working:
- `https://your-backend.up.railway.app/api/analytics/admin/overview`
- `https://your-backend.up.railway.app/api/analytics/vendor/overview`

---

## 📝 Your Deployed URLs (Fill These In):

```
Backend (Railway): https://_____________________.up.railway.app
Customer Frontend (Vercel): https://_____________________.vercel.app
Admin Dashboard (Vercel): https://_____________________.vercel.app
Vendor Dashboard (Vercel): https://_____________________.vercel.app
```

---

## 🎉 After Successful Deployment

1. **Test Payment Flow:**
   - Use test card: `4242 4242 4242 4242`
   - Expiry: any future date
   - CVC: any 3 digits

2. **Test Analytics:**
   - Create some test orders
   - Check admin analytics dashboard
   - Check vendor analytics dashboard

3. **Test Real-time Notifications:**
   - Create an order as customer
   - See if vendor gets notification
   - Update order status
   - See if customer gets notification

---

## 💡 Production Checklist (When Going Live)

- [ ] Replace Stripe test keys with live keys
- [ ] Get real JazzCash merchant credentials
- [ ] Get real EasyPaisa merchant credentials
- [ ] Set up custom domains
- [ ] Enable production MongoDB (not free tier)
- [ ] Set up error monitoring (Sentry)
- [ ] Set up email service (SendGrid/Mailgun)
- [ ] Review and tighten CORS settings
- [ ] Enable rate limiting
- [ ] Set up SSL certificates
- [ ] Create backup strategy

---

**Need help with any step? Check the logs in Vercel/Railway dashboard for specific error messages.**
