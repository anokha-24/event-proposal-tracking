# Firebase Setup Checklist

## Pre-Setup

- [ ] Have a Google account
- [ ] Node.js installed (v18+)
- [ ] Project dependencies installed (`npm install`)

---

## Firebase Project Creation

- [ ] Created Firebase project at [Firebase Console](https://console.firebase.google.com)
- [ ] Project name chosen (e.g., "anokha-event-proposals")
- [ ] Google Analytics configured (enabled/disabled)
- [ ] Project successfully created

---

## Firebase Authentication

- [ ] Opened Authentication section in Firebase Console
- [ ] Clicked "Get started"
- [ ] Enabled **Email/Password** sign-in method
- [ ] Did NOT enable "Email link (passwordless sign-in)"
- [ ] Saved authentication settings

### Optional Security Settings
- [ ] Configured authorized domains (for production)
- [ ] Enabled email enumeration protection

---

## Cloud Firestore

- [ ] Opened Firestore Database section
- [ ] Clicked "Create database"
- [ ] Selected security mode:
  - [ ] **Test mode** (for development) OR
  - [ ] **Production mode** (for production)
- [ ] Selected Firestore location (e.g., asia-south1 for India)
- [ ] Database successfully created
- [ ] Updated security rules (see FIREBASE_SETUP.md)
- [ ] Published security rules

---

## Firebase Admin SDK

- [ ] Opened Project Settings (gear icon)
- [ ] Navigated to "Service accounts" tab
- [ ] Clicked "Generate new private key"
- [ ] Downloaded service account JSON file
- [ ] Stored JSON file securely (NOT in Git)
- [ ] Extracted required values:
  - [ ] `project_id`
  - [ ] `private_key`
  - [ ] `client_email`

---

## Web App Configuration

- [ ] Opened Project Settings
- [ ] Scrolled to "Your apps" section
- [ ] Clicked web icon (`</>`)
- [ ] Registered app with nickname
- [ ] Copied Firebase config object
- [ ] Extracted all 6 configuration values:
  - [ ] `apiKey`
  - [ ] `authDomain`
  - [ ] `projectId`
  - [ ] `storageBucket`
  - [ ] `messagingSenderId`
  - [ ] `appId`

---

## Environment Variables

- [ ] Copied `env.template` to `.env.local`
- [ ] Filled in all client SDK variables:
  - [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] Filled in all Admin SDK variables:
  - [ ] `FIREBASE_ADMIN_PROJECT_ID`
  - [ ] `FIREBASE_ADMIN_CLIENT_EMAIL`
  - [ ] `FIREBASE_ADMIN_PRIVATE_KEY` (with quotes and \n preserved)
- [ ] Verified `.env.local` is in `.gitignore`
- [ ] Did NOT commit `.env.local` to Git

---

## Firestore Indexes

- [ ] Started development server (`npm run dev`)
- [ ] Logged in as reviewer
- [ ] Navigated to "View Proposals" page
- [ ] Clicked index creation link from terminal error
- [ ] Created required indexes in Firebase Console
- [ ] Waited for indexes to build (status: "Enabled")

### Required Indexes
- [ ] **Index 1**: Proposals by Department and Status
  - Collection: `Proposals`
  - Fields: `department` (Asc), `status` (Asc), `createdAt` (Desc)
- [ ] **Index 2**: Proposals by Reviewer Level
  - Collection: `Proposals`
  - Fields: `currentReviewerLevel` (Asc), `status` (Asc), `createdAt` (Desc)

---

## Testing & Verification

### Authentication Testing
- [ ] Started dev server (`npm run dev`)
- [ ] Opened app in browser
- [ ] Created new user account (signup)
- [ ] Verified user appears in Firebase Console > Authentication > Users
- [ ] Verified user document created in Firestore > Auth collection
- [ ] Logged in with created account
- [ ] Tested password reset functionality
- [ ] Logged out successfully

### Firestore Testing
- [ ] Created a new proposal
- [ ] Verified proposal appears in dashboard
- [ ] Verified proposal saved in Firestore > Proposals collection
- [ ] Edited a proposal
- [ ] Verified changes saved in Firestore

### Admin Testing
- [ ] Manually set user role to "Admin" in Firestore
- [ ] Logged in as admin
- [ ] Created new users via admin panel
- [ ] Viewed all proposals
- [ ] Managed user roles

### Reviewer Testing
- [ ] Manually set user role to "Reviewer" in Firestore
- [ ] Added `level` field to reviewer user document
- [ ] Logged in as reviewer
- [ ] Viewed assigned proposals
- [ ] Reviewed and approved/rejected proposals
- [ ] Verified review history saved in ProposalHistory collection

---

## Security & Best Practices

- [ ] `.env.local` file is in `.gitignore`
- [ ] Service account JSON is NOT committed to Git
- [ ] Admin SDK credentials only used in server-side code
- [ ] Security rules are production-ready (if deploying)
- [ ] Test mode disabled (if deploying to production)
- [ ] Authorized domains configured (for production)

---

## Production Deployment (Optional)

- [ ] Updated security rules to production mode
- [ ] Configured environment variables in hosting platform (Vercel, Netlify, etc.)
- [ ] Added production domain to Firebase authorized domains
- [ ] Tested authentication in production
- [ ] Tested Firestore operations in production
- [ ] Verified indexes are enabled
- [ ] Monitored Firebase Console for errors

---

## Common Issues Checklist

If you encounter issues, verify:

- [ ] All environment variables are set correctly
- [ ] No extra spaces or quotes in `.env.local`
- [ ] Development server restarted after changing `.env.local`
- [ ] Private key format is correct (with quotes and \n)
- [ ] `.env.local` file is in project root (same level as `package.json`)
- [ ] Firebase project ID matches in all configurations
- [ ] Security rules allow required operations
- [ ] User is authenticated before accessing protected resources
- [ ] Required Firestore indexes are created and enabled

---

## Reference Documents

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Comprehensive setup guide
- **[env.template](./env.template)** - Environment variables template
- **[README.md](./README.md)** - Project overview and quick start

---

## Setup Complete!

Once all items are checked, your Firebase setup is complete and ready for development.

**Next Steps:**
1. Start building features
2. Test thoroughly in development
3. Update security rules before production deployment
4. Monitor Firebase Console for usage and errors

---

**Last Updated**: January 2026
