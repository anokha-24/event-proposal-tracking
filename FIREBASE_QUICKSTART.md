# Firebase Quick Start Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"**
3. Enter project name → Click **"Continue"**
4. Enable/disable Google Analytics → Click **"Continue"** → **"Create project"**
5. Wait for setup → Click **"Continue"**

---

## Step 2: Enable Authentication 

1. Click **"Authentication"** in sidebar
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle **"Email/Password"** to **Enabled**
5. Click **"Save"**

**Done**: Email/Password authentication enabled  
**Don't enable**: Google, Facebook, Phone, Anonymous, etc.

---

## Step 3: Create Firestore Database

1. Click **"Firestore Database"** in sidebar
2. Click **"Create database"**
3. Select mode:
   - **Development**: Choose "Start in test mode"
   - **Production**: Choose "Start in production mode"
4. Select location (e.g., `asia-south1` for India)
5. Click **"Enable"**

**Done**: Firestore database created

---

## Step 4: Get Web App Config

1. Click **gear icon** → **"Project settings"**
2. Scroll to **"Your apps"**
3. Click **`</>`** (web icon)
4. Enter app nickname → Click **"Register app"**
5. **Copy** the config object (you'll need these 6 values)
6. Click **"Continue to console"**

---

## Step 5: Generate Admin SDK Key

1. In **Project settings**, go to **"Service accounts"** tab
2. Click **"Generate new private key"**
3. Click **"Generate key"** in the warning dialog
4. **Save** the downloaded JSON file securely
5. **Never commit this file to Git**

---

## Step 6: Configure Environment Variables

1. Copy `env.template` to `.env.local`:
   ```bash
   cp env.template .env.local
   ```

2. Open `.env.local` and fill in values:

   **From Web App Config (Step 4)**:
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=<apiKey>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<authDomain>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<projectId>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<storageBucket>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
   NEXT_PUBLIC_FIREBASE_APP_ID=<appId>
   ```

   **From Admin SDK JSON (Step 5)**:
   ```bash
   FIREBASE_ADMIN_PROJECT_ID=<project_id>
   FIREBASE_ADMIN_CLIENT_EMAIL=<client_email>
   FIREBASE_ADMIN_PRIVATE_KEY="<private_key>"
   ```

3. Save the file

---

## Step 7: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 8: Create Firestore Indexes

1. In the app, log in as a reviewer
2. Navigate to "View Proposals" page
3. Check terminal for index creation link
4. Click the link → Click **"Create Index"**
5. Wait for index to build

**Note**: You may need to create 2 indexes. Repeat for each error.

---

## Step 9: Update Security Rules

If you started in **production mode**, update security rules:

1. Go to **Firestore Database** → **Rules** tab
2. Copy rules from [FIREBASE_SETUP.md](./FIREBASE_SETUP.md#firestore-security-rules)
3. Paste into the editor
4. Click **"Publish"**

---

## Verification

Test your setup:

- [ ] Sign up for a new account
- [ ] Check Firebase Console → Authentication → Users (user should appear)
- [ ] Check Firestore → Auth collection (user document should exist)
- [ ] Create a proposal
- [ ] Check Firestore → Proposals collection (proposal should exist)

---

## Common Issues

| Issue | Solution |
|-------|----------|
| "Invalid API key" | Verify `NEXT_PUBLIC_FIREBASE_API_KEY` in `.env.local` |
| "Permission denied" | Update Firestore security rules |
| "Query requires index" | Click the link in terminal to create index |
| "Admin SDK error" | Check `FIREBASE_ADMIN_PRIVATE_KEY` format (needs quotes and \n) |
| Env vars not loading | Restart dev server after changing `.env.local` |

---

## What's Enabled

**Enabled**:
- Email/Password Authentication
- Cloud Firestore
- Firebase Admin SDK

**Not Enabled** (not needed):
- Google Sign-In, Phone Auth, Anonymous Auth
- Cloud Storage, Cloud Functions, Firebase Hosting
- Realtime Database

---

For production deployment, see the [Production Deployment section](./FIREBASE_SETUP.md#production-deployment-optional) in FIREBASE_SETUP.md.
