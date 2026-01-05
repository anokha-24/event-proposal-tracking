# Firebase Setup Guide for Event Proposal Tracking System

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating a Firebase Project](#creating-a-firebase-project)
3. [Enabling Required Firebase Services](#enabling-required-firebase-services)
4. [Firebase Authentication Setup](#firebase-authentication-setup)
5. [Firestore Database Setup](#firestore-database-setup)
6. [Firebase Admin SDK Setup](#firebase-admin-sdk-setup)
7. [Environment Variables Configuration](#environment-variables-configuration)
8. [Firestore Security Rules](#firestore-security-rules)
9. [Firestore Indexes](#firestore-indexes)
10. [Verification and Testing](#verification-and-testing)

---

## Prerequisites

Before you begin, ensure you have:

- A Google account
- Node.js installed (v18 or higher recommended)
- Access to the Firebase Console: https://console.firebase.google.com

---

## Creating a Firebase Project

### Step 1: Create a New Firebase Project

1. Navigate to the [Firebase Console](https://console.firebase.google.com)
2. Click on **"Add project"** or **"Create a project"**
3. Enter your project name (e.g., `anokha-event-proposals`)
4. Click **"Continue"**

### Step 2: Configure Google Analytics (Optional)

1. Choose whether to enable Google Analytics:
   - **Recommended for production**: Enable Google Analytics to track usage and performance
   - **For development/testing**: You can disable it to simplify setup
2. If enabled:
   - Select an existing Analytics account or create a new one
   - Choose your country/region
   - Accept the Google Analytics terms
3. Click **"Create project"**

### Step 3: Wait for Project Creation

- Firebase will set up your project (this takes 30-60 seconds)
- Click **"Continue"** when setup is complete

---

## Enabling Required Firebase Services

This application requires the following Firebase services:

### 1. Firebase Authentication
### 2. Cloud Firestore
### 3. Firebase Admin SDK (for server-side operations)

---

## Firebase Authentication Setup

Firebase Authentication is used for user login, signup, and password management.

### Step 1: Enable Authentication

1. In your Firebase project dashboard, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. You'll see the "Sign-in method" tab

### Step 2: Enable Email/Password Authentication

1. Click on the **"Sign-in method"** tab
2. Find **"Email/Password"** in the list of providers
3. Click on **"Email/Password"**
4. Enable the following options:
   - **Email/Password**: Toggle this to **Enabled**
   - **Email link (passwordless sign-in)**: Leave this **Disabled** (not required for this project)
5. Click **"Save"**

### Step 3: Configure Authentication Settings (Optional but Recommended)

1. Go to the **"Settings"** tab in Authentication
2. Configure the following:
   - **Authorized domains**: Add your deployment domain (e.g., `your-app.vercel.app`)
   - **User account management**: 
     - Email enumeration protection: **Enabled** (recommended for security)

### What NOT to Enable

Do NOT enable these providers (unless specifically needed):
- Google Sign-In
- Facebook Login
- Twitter
- GitHub
- Phone Authentication
- Anonymous Authentication

---

## Firestore Database Setup

Cloud Firestore is used to store user data, proposals, and reviewer information.

### Step 1: Create Firestore Database

1. In the Firebase Console, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**

### Step 2: Choose Security Rules Mode

You'll be presented with two options:

#### Option 1: Start in Production Mode (Recommended for Production)
- Select **"Start in production mode"**
- This locks down the database initially
- You'll need to configure security rules manually (see [Firestore Security Rules](#firestore-security-rules) section)

#### Option 2: Start in Test Mode (Recommended for Development)
- Select **"Start in test mode"**
- This allows read/write access for 30 days
- **WARNING**: Remember to update security rules before the 30-day period expires
- **IMPORTANT**: Never use test mode in production

**For this project, choose based on your environment:**
- **Development**: Start in test mode
- **Production**: Start in production mode

Click **"Next"**

### Step 3: Select Firestore Location

1. Choose a Cloud Firestore location (this cannot be changed later)
2. Recommended locations:
   - **asia-south1** (Mumbai) - Best for India
   - **us-central1** (Iowa) - Good for global access
   - **europe-west1** (Belgium) - Best for Europe

3. Click **"Enable"**

### Step 4: Wait for Database Creation

- Firestore will be provisioned (takes 1-2 minutes)
- You'll see the Firestore Data tab when ready

### Step 5: Create Required Collections

The application uses the following Firestore collections:

#### Collection 1: `Auth` (User Authentication Data)
- **Purpose**: Stores user profiles and roles
- **Document ID**: User UID from Firebase Authentication
- **Fields**:
  - `name` (string): User's full name
  - `email` (string): User's email address
  - `role` (string): User role - "User", "Reviewer", or "Admin"
  - `department` (string): User's department
  - `level` (number, optional): Reviewer level (only for reviewers)
  - `createdAt` (timestamp): Account creation timestamp
  - `initialPassword` (string): Initial password (for admin reference)

#### Collection 2: `Proposals` (Event Proposals)
- **Purpose**: Stores all event proposals
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string): UID of the user who created the proposal
  - `eventName` (string): Name of the event
  - `eventType` (string): Type of event
  - `department` (string): Department organizing the event
  - `description` (string): Event description
  - `status` (string): "Pending", "Approved", "Rejected", "Under Review"
  - `currentReviewerLevel` (number): Current reviewer level
  - `createdAt` (timestamp): Proposal creation timestamp
  - `updatedAt` (timestamp): Last update timestamp

#### Collection 3: `ProposalHistory` (Review History)
- **Purpose**: Tracks proposal review history
- **Document ID**: Auto-generated
- **Fields**:
  - `proposalId` (string): Reference to proposal
  - `reviewerId` (string): UID of reviewer
  - `action` (string): "Approved", "Rejected", "Forwarded"
  - `comments` (string): Reviewer comments
  - `timestamp` (timestamp): Action timestamp
  - `level` (number): Reviewer level at time of action

**Note**: Collections are created automatically when the first document is added. You don't need to create them manually.

---

## Firebase Admin SDK Setup

The Firebase Admin SDK is required for server-side operations like creating users and managing authentication.

### Step 1: Generate Service Account Key

1. In the Firebase Console, click the **⚙️ gear icon** next to "Project Overview"
2. Select **"Project settings"**
3. Navigate to the **"Service accounts"** tab
4. Click **"Generate new private key"**
5. A dialog will appear warning you to keep this key confidential
6. Click **"Generate key"**
7. A JSON file will be downloaded to your computer

### Step 2: Secure the Service Account Key

⚠️ **CRITICAL SECURITY WARNINGS**:
- **NEVER** commit this JSON file to version control (Git, GitHub, etc.)
- **NEVER** share this file publicly
- **NEVER** include it in your frontend code
- Store it securely and treat it like a password

### Step 3: Extract Required Values

Open the downloaded JSON file. You'll need these three values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

**Extract these values**:
1. `project_id` → Use for `FIREBASE_ADMIN_PROJECT_ID`
2. `private_key` → Use for `FIREBASE_ADMIN_PRIVATE_KEY`
3. `client_email` → Use for `FIREBASE_ADMIN_CLIENT_EMAIL`

---

## Environment Variables Configuration

### Step 1: Get Firebase Web App Configuration

1. In Firebase Console, go to **Project Settings** (⚙️ gear icon)
2. Scroll down to **"Your apps"** section
3. If you haven't added a web app yet:
   - Click the **`</>`** (web) icon
   - Register your app with a nickname (e.g., "Event Proposal Web App")
   - ❌ Do NOT enable Firebase Hosting (unless you plan to use it)
   - Click **"Register app"**
4. You'll see your Firebase configuration object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Step 2: Create `.env.local` File

1. In your project root directory, create a file named `.env.local`
2. Add the following environment variables:

```bash
# ============================================
# FIREBASE CLIENT SDK CONFIGURATION
# ============================================
# These are used in the frontend (app/firebase/firebase.js)
# These values are safe to expose in the browser

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# ============================================
# FIREBASE ADMIN SDK CONFIGURATION
# ============================================
# These are used for server-side operations (API routes)
# ⚠️ KEEP THESE SECRET - Never expose in frontend code

FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Optional: Database URL (only needed for Realtime Database, not Firestore)
# FIREBASE_ADMIN_DATABASE_URL=https://your-project-id.firebaseio.com
```

### Step 3: Fill in Your Values

Replace the placeholder values with your actual Firebase configuration:

#### Client SDK Variables (from Firebase Web App Config):
- `NEXT_PUBLIC_FIREBASE_API_KEY` → `apiKey` from config
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` → `authDomain` from config
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` → `projectId` from config
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` → `storageBucket` from config
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` → `messagingSenderId` from config
- `NEXT_PUBLIC_FIREBASE_APP_ID` → `appId` from config

#### Admin SDK Variables (from Service Account JSON):
- `FIREBASE_ADMIN_PROJECT_ID` → `project_id` from JSON
- `FIREBASE_ADMIN_CLIENT_EMAIL` → `client_email` from JSON
- `FIREBASE_ADMIN_PRIVATE_KEY` → `private_key` from JSON

### Step 4: Important Notes on Private Key

⚠️ **CRITICAL**: When copying the `private_key` value:

1. **Keep the quotes**: Wrap the entire key in double quotes
2. **Keep the newlines**: The `\n` characters must be preserved
3. **Example**:
   ```bash
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   ```

### Step 5: Verify `.env.local` is Ignored by Git

1. Check your `.gitignore` file
2. Ensure it contains:
   ```
   .env*
   ```
3. This prevents accidentally committing secrets to version control

### Example Complete `.env.local` File

```bash
# ============================================
# FIREBASE CLIENT SDK CONFIGURATION
# ============================================
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ1234567
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=anokha-event-proposals.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=anokha-event-proposals
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=anokha-event-proposals.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789

# ============================================
# FIREBASE ADMIN SDK CONFIGURATION
# ============================================
FIREBASE_ADMIN_PROJECT_ID=anokha-event-proposals
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-abc12@anokha-event-proposals.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7xQyDEj...\n-----END PRIVATE KEY-----\n"
```

---

## Firestore Security Rules

Security rules control who can read and write data in your Firestore database.

### Step 1: Access Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click on the **"Rules"** tab

### Step 2: Update Security Rules

Replace the default rules with the following production-ready rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is the owner
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Helper function to get user data
    function getUserData() {
      return get(/databases/$(database)/documents/Auth/$(request.auth.uid)).data;
    }
    
    // Helper function to check if user is a reviewer
    function isReviewer() {
      return isAuthenticated() && getUserData().role == 'Reviewer';
    }
    
    // Helper function to check if user is an admin
    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'Admin';
    }
    
    // Auth collection - stores user profiles
    match /Auth/{userId} {
      // Users can read their own data
      allow read: if isOwner(userId);
      
      // Admins can read all user data
      allow read: if isAdmin();
      
      // Only admins can create/update/delete users
      allow write: if isAdmin();
    }
    
    // Proposals collection - stores event proposals
    match /Proposals/{proposalId} {
      // Users can read their own proposals
      allow read: if isAuthenticated() && 
                     resource.data.userId == request.auth.uid;
      
      // Reviewers can read proposals assigned to them
      allow read: if isReviewer();
      
      // Admins can read all proposals
      allow read: if isAdmin();
      
      // Users can create proposals
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      // Users can update their own proposals (if status is Pending)
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid &&
                       resource.data.status == 'Pending';
      
      // Reviewers can update proposals (change status, add comments)
      allow update: if isReviewer();
      
      // Admins can update any proposal
      allow update: if isAdmin();
      
      // Only admins can delete proposals
      allow delete: if isAdmin();
    }
    
    // ProposalHistory collection - stores review history
    match /ProposalHistory/{historyId} {
      // Users can read history of their own proposals
      allow read: if isAuthenticated();
      
      // Reviewers can read all history
      allow read: if isReviewer();
      
      // Admins can read all history
      allow read: if isAdmin();
      
      // Only reviewers and admins can create history entries
      allow create: if isReviewer() || isAdmin();
      
      // No one can update or delete history (immutable audit log)
      allow update, delete: if false;
    }
  }
}
```

### Step 3: Publish Rules

1. Click **"Publish"** to deploy the security rules
2. Wait for confirmation that rules are published

### Understanding the Security Rules

- **Auth Collection**: Only users can read their own data; admins can manage all users
- **Proposals Collection**: Users can create and read their own proposals; reviewers can read and update proposals; admins have full access
- **ProposalHistory Collection**: Immutable audit log; only reviewers and admins can create entries

---

## Firestore Indexes

Firestore requires indexes for complex queries. This application needs specific indexes for the reviewer proposal queries.

### Why Indexes are Needed

The application performs queries that filter and sort on multiple fields, such as:
- Fetching proposals by department AND status
- Sorting proposals by creation date
- Filtering by reviewer level

### Step 1: Automatic Index Creation

When you first run the application and navigate to the reviewer's "View Proposals" page, Firestore will detect the missing index and provide a link to create it.

### Step 2: Create Index from Error Link

1. Run your application in development mode:
   ```bash
   npm run dev
   ```

2. Log in as a reviewer and navigate to the "View Proposals" page

3. Check your terminal/console for an error message like:
   ```
   The query requires an index. You can create it here:
   https://console.firebase.google.com/v1/r/project/YOUR-PROJECT/firestore/indexes?create_composite=...
   ```

4. Click the link (or copy-paste it into your browser)

5. The Firebase Console will open with the index creation form pre-filled

6. Click **"Create Index"**

7. Wait for the index to build (this can take a few minutes)

### Step 3: Required Indexes

The application requires the following composite indexes:

#### Index 1: Proposals by Department and Status
- **Collection**: `Proposals`
- **Fields**:
  - `department` (Ascending)
  - `status` (Ascending)
  - `createdAt` (Descending)

#### Index 2: Proposals by Reviewer Level
- **Collection**: `Proposals`
- **Fields**:
  - `currentReviewerLevel` (Ascending)
  - `status` (Ascending)
  - `createdAt` (Descending)

### Step 4: Manual Index Creation (Alternative)

If you prefer to create indexes manually:

1. Go to **Firestore Database** → **Indexes** tab
2. Click **"Create Index"**
3. Select collection: `Proposals`
4. Add fields as specified above
5. Click **"Create"**

### Step 5: Verify Indexes

1. Go to **Firestore Database** → **Indexes** tab
2. Check that all indexes show status: **"Enabled"**
3. If status is **"Building"**, wait for it to complete

---

## Verification and Testing

### Step 1: Verify Environment Variables

1. Create a test file to verify environment variables are loaded:

```javascript
// test-env.js
console.log('Firebase Config Check:');
console.log('API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing');
console.log('Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing');
console.log('Storage Bucket:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing');
console.log('Messaging Sender ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing');
console.log('App ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing');
console.log('\nAdmin SDK Config Check:');
console.log('Admin Project ID:', process.env.FIREBASE_ADMIN_PROJECT_ID ? '✓ Set' : '✗ Missing');
console.log('Admin Client Email:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? '✓ Set' : '✗ Missing');
console.log('Admin Private Key:', process.env.FIREBASE_ADMIN_PRIVATE_KEY ? '✓ Set' : '✗ Missing');
```

2. Run: `node test-env.js`
3. All values should show "✓ Set"

### Step 2: Test Firebase Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

3. Try to sign up for a new account

4. Check the Firebase Console:
   - **Authentication** → **Users** tab: New user should appear
   - **Firestore Database** → **Auth** collection: User document should be created

### Step 3: Test Authentication Flow

1. **Sign Up**: Create a new user account
2. **Log In**: Log in with the created account
3. **Password Reset**: Test the password reset functionality
4. **Log Out**: Ensure logout works correctly

### Step 4: Test Firestore Operations

1. **Create Proposal**: Submit a new event proposal
2. **View Proposals**: Check that proposals appear in the dashboard
3. **Update Proposal**: Edit a proposal
4. **Check Firestore**: Verify data is saved in the `Proposals` collection

### Step 5: Test Admin Operations

1. Manually set a user's role to "Admin" in Firestore:
   - Go to **Firestore Database**
   - Navigate to **Auth** collection
   - Select a user document
   - Edit the `role` field to "Admin"
   - Click **Update**

2. Log in as the admin user

3. Test admin functionalities:
   - Create new users
   - View all proposals
   - Manage user roles

---

## Common Issues and Troubleshooting

### Issue 1: "Firebase: Error (auth/invalid-api-key)"

**Cause**: Incorrect API key in `.env.local`

**Solution**:
1. Verify `NEXT_PUBLIC_FIREBASE_API_KEY` matches the value in Firebase Console
2. Ensure there are no extra spaces or quotes
3. Restart the development server after changing `.env.local`

### Issue 2: "Firebase: Error (auth/project-not-found)"

**Cause**: Incorrect project ID

**Solution**:
1. Verify `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches your Firebase project
2. Check that the project exists in Firebase Console

### Issue 3: "Permission denied" when accessing Firestore

**Cause**: Security rules are too restrictive or user is not authenticated

**Solution**:
1. Check Firestore security rules
2. Ensure user is logged in
3. Verify user has the correct role in the `Auth` collection

### Issue 4: "The query requires an index"

**Cause**: Missing Firestore index

**Solution**:
1. Click the link provided in the error message
2. Create the required index in Firebase Console
3. Wait for index to build

### Issue 5: Admin SDK initialization error

**Cause**: Incorrect private key format

**Solution**:
1. Ensure `FIREBASE_ADMIN_PRIVATE_KEY` is wrapped in double quotes
2. Verify `\n` characters are preserved in the key
3. Re-download the service account JSON if needed

### Issue 6: Environment variables not loading

**Cause**: File name or location incorrect

**Solution**:
1. Ensure file is named exactly `.env.local` (not `.env` or `env.local`)
2. Place file in the project root directory (same level as `package.json`)
3. Restart the development server

---

## Security Best Practices

### 1. Environment Variables
- ✅ Always use `.env.local` for local development
- ✅ Use environment variables in production (Vercel, Netlify, etc.)
- ❌ Never commit `.env.local` to Git
- ❌ Never hardcode credentials in source code

### 2. Firebase Admin SDK
- ✅ Only use Admin SDK in server-side code (API routes)
- ✅ Keep service account JSON file secure
- ❌ Never expose Admin SDK credentials in frontend code
- ❌ Never commit service account JSON to Git

### 3. Security Rules
- ✅ Use production-ready security rules
- ✅ Test rules thoroughly before deploying
- ❌ Never use test mode in production
- ❌ Never allow unrestricted read/write access

### 4. Authentication
- ✅ Enable email enumeration protection
- ✅ Use strong password requirements
- ✅ Implement proper session management
- ❌ Never store passwords in plain text

---

## Next Steps

After completing this setup:

1. ✅ Verify all environment variables are set correctly
2. ✅ Test authentication flow (signup, login, logout)
3. ✅ Test Firestore operations (create, read, update)
4. ✅ Create required Firestore indexes
5. ✅ Set up user roles in Firestore
6. ✅ Test reviewer and admin functionalities
7. ✅ Review and update security rules as needed
8. ✅ Set up monitoring and logging (optional)

---

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## Support

If you encounter issues not covered in this guide:

1. Check the [Firebase Status Dashboard](https://status.firebase.google.com/)
2. Review Firebase Console logs
3. Check browser console for errors
4. Review server logs for API errors
5. Consult the Firebase documentation
6. Reach out to the project maintainers

---

**Last Updated**: January 2026  
**Firebase SDK Version**: 11.9.1  
**Firebase Admin SDK Version**: 13.4.0
