##  Firebase Services Required

### Services to Enable
1. **Firebase Authentication** (Email/Password)
2. **Cloud Firestore** (NoSQL Database)
3. **Firebase Admin SDK** (Server-side operations)

### Services NOT Required
- Firebase Realtime Database
- Cloud Storage for Firebase
- Cloud Functions
- Firebase Hosting
- Cloud Messaging
- Remote Config
- A/B Testing
- Performance Monitoring
- Crashlytics
- App Distribution
- ML Kit

---

## Firebase Authentication Configuration

### Location in Console
**Firebase Console → Authentication → Sign-in method**

### Exact Settings

#### Enable: Email/Password
```
Provider: Email/Password
Status: Enabled

Options:
  Email/Password: ENABLED
  Email link (passwordless sign-in): DISABLED
```

**Why**: This project uses traditional email/password authentication for user login.

#### Do NOT Enable These Providers
```
Google
Facebook
Twitter
GitHub
Microsoft
Yahoo
Apple
Phone
Anonymous
Play Games
Game Center
```

### Advanced Settings (Optional but Recommended)

#### Email Enumeration Protection
```
Location: Authentication → Settings → User account management
Setting: Email enumeration protection
Value: Enabled (Recommended)
```

#### Authorized Domains
```
Location: Authentication → Settings → Authorized domains
Default: localhost, your-project.firebaseapp.com
Add for Production: your-custom-domain.com
```

---

## Cloud Firestore Configuration

### Location in Console
**Firebase Console → Firestore Database**

### Exact Settings

#### Database Creation

**Step 1: Security Rules Mode**
```
Choose a starting mode:

Option 1 (Development):
  Start in production mode
  Start in test mode
  
  Warning: Your data will be open to anyone for 30 days
  Use this for: Development and testing
  Do NOT use for: Production deployments

Option 2 (Production):
  Start in production mode
  Start in test mode
  
  Use this for: Production deployments
  Note: You must configure security rules manually
```

**Recommendation**: 
- **Development**: Start in test mode
- **Production**: Start in production mode

**Step 2: Firestore Location**
```
Select a location for your Cloud Firestore:

Recommended Options:
asia-south1 (Mumbai)          - Best for India
us-central1 (Iowa)            - Good for global access
europe-west1 (Belgium)        - Best for Europe
asia-southeast1 (Singapore)   - Good for Southeast Asia
australia-southeast1 (Sydney) - Best for Australia

WARNING: This location cannot be changed after creation
```

**Recommendation**: Choose the location closest to your users.

#### Firestore Collections Structure

The application will automatically create these collections:

```
Firestore Database
├── Auth (User profiles and roles)
│   ├── {userId} (document)
│   │   ├── name: string
│   │   ├── email: string
│   │   ├── role: string ("User" | "Reviewer" | "Admin")
│   │   ├── department: string
│   │   ├── level: number (optional, for reviewers)
│   │   ├── createdAt: timestamp
│   │   └── initialPassword: string
│
├── Proposals (Event proposals)
│   ├── {proposalId} (document)
│   │   ├── userId: string
│   │   ├── eventName: string
│   │   ├── eventType: string
│   │   ├── department: string
│   │   ├── description: string
│   │   ├── status: string ("Pending" | "Approved" | "Rejected" | "Under Review")
│   │   ├── currentReviewerLevel: number
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│
└── ProposalHistory (Review audit log)
    ├── {historyId} (document)
    │   ├── proposalId: string
    │   ├── reviewerId: string
    │   ├── action: string ("Approved" | "Rejected" | "Forwarded")
    │   ├── comments: string
    │   ├── timestamp: timestamp
    │   └── level: number
```

**Note**: Collections are created automatically when the first document is added. No manual creation needed.

---

## Firestore Security Rules

### Location in Console
**Firebase Console → Firestore Database → Rules**

### Production-Ready Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/Auth/$(request.auth.uid)).data;
    }
    
    function isReviewer() {
      return isAuthenticated() && getUserData().role == 'Reviewer';
    }
    
    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'Admin';
    }
    
    // Auth collection
    match /Auth/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow write: if isAdmin();
    }
    
    // Proposals collection
    match /Proposals/{proposalId} {
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid || 
                      isReviewer() || 
                      isAdmin());
      
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      allow update: if (isAuthenticated() && 
                        resource.data.userId == request.auth.uid &&
                        resource.data.status == 'Pending') ||
                       isReviewer() ||
                       isAdmin();
      
      allow delete: if isAdmin();
    }
    
    // ProposalHistory collection
    match /ProposalHistory/{historyId} {
      allow read: if isAuthenticated();
      allow create: if isReviewer() || isAdmin();
      allow update, delete: if false; // Immutable audit log
    }
  }
}
```

**To Apply**:
1. Copy the rules above
2. Go to Firestore Database → Rules tab
3. Paste the rules
4. Click "Publish"

---

## Firestore Indexes

### Location in Console
**Firebase Console → Firestore Database → Indexes**

### Required Composite Indexes

#### Index 1: Proposals by Department and Status
```
Collection ID: Proposals
Fields indexed:
  1. department    | Ascending  | ↑
  2. status        | Ascending  | ↑
  3. createdAt     | Descending | ↓

Query scope: Collection
Status: Enabled
```

**Used for**: Fetching proposals filtered by department and status, sorted by creation date.

#### Index 2: Proposals by Reviewer Level
```
Collection ID: Proposals
Fields indexed:
  1. currentReviewerLevel | Ascending  | ↑
  2. status               | Ascending  | ↑
  3. createdAt            | Descending | ↓

Query scope: Collection
Status: Enabled
```

**Used for**: Fetching proposals assigned to specific reviewer levels, sorted by creation date.

### How to Create Indexes

**Method 1: Automatic (Recommended)**
1. Run the application
2. Navigate to the page that triggers the query
3. Check terminal for error message with index creation link
4. Click the link
5. Firebase Console opens with pre-filled form
6. Click "Create Index"
7. Wait for index to build

**Method 2: Manual**
1. Go to Firestore Database → Indexes tab
2. Click "Create Index"
3. Fill in the fields as shown above
4. Click "Create"
5. Wait for index to build (status changes to "Enabled")

---

## Firebase Admin SDK

### Location in Console
**Firebase Console → Project Settings → Service Accounts**

### Exact Steps

1. **Navigate to Service Accounts**
   ```
   Click: Gear icon (next to "Project Overview")
   Select: Project settings
   Tab: Service accounts
   ```

2. **Generate Private Key**
   ```
   Button: "Generate new private key"
   
    Warning Dialog:
   "This key allows full access to your Firebase project.
    Keep it confidential and never store it in a public repository."
   
   Click: "Generate key"
   ```

3. **Download JSON File**
   ```
   File downloaded: your-project-id-firebase-adminsdk-xxxxx.json
   
   IMPORTANT:
   - Store this file securely
   - Do NOT commit to Git
   - Do NOT share publicly
   - Treat it like a password
   ```

4. **Extract Required Values**
   ```json
   From the downloaded JSON, extract:
   
   {
     "project_id": "your-project-id",           → FIREBASE_ADMIN_PROJECT_ID
     "private_key": "-----BEGIN PRIVATE...",    → FIREBASE_ADMIN_PRIVATE_KEY
     "client_email": "firebase-adminsdk-..."    → FIREBASE_ADMIN_CLIENT_EMAIL
   }
   ```

---

## Web App Configuration

### Location in Console
**Firebase Console → Project Settings → General → Your apps**

### Exact Steps

1. **Add Web App**
   ```
   Scroll to: "Your apps" section
   Click: </> (Web icon)
   ```

2. **Register App**
   ```
   App nickname: Event Proposal Web App (or any name)
   
   Also set up Firebase Hosting for this app: UNCHECKED
   (Unless you plan to use Firebase Hosting)
   
   Click: "Register app"
   ```

3. **Copy Configuration**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIza...",              → NEXT_PUBLIC_FIREBASE_API_KEY
     authDomain: "xxx.firebaseapp.com", → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     projectId: "xxx",               → NEXT_PUBLIC_FIREBASE_PROJECT_ID
     storageBucket: "xxx.appspot.com", → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     messagingSenderId: "123...",    → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     appId: "1:123..."               → NEXT_PUBLIC_FIREBASE_APP_ID
   };
   ```

4. **Click "Continue to console"**

---

## Quick Reference: What to Enable

### ENABLE These

| Service | Location | Setting | Value |
|---------|----------|---------|-------|
| Authentication | Sign-in method | Email/Password | Enabled |
| Firestore | Database | Create database | Created |
| Firestore | Rules | Security rules | Published |
| Firestore | Indexes | Composite indexes | Created |
| Admin SDK | Service accounts | Private key | Generated |
| Web App | Your apps | Web app | Registered |

### DO NOT Enable These

| Service | Reason |
|---------|--------|
| Google Sign-In | Not implemented in this project |
| Phone Authentication | Not implemented in this project |
| Anonymous Authentication | Not implemented in this project |
| Cloud Storage | Not used in this project |
| Cloud Functions | Not used in this project |
| Firebase Hosting | Optional (only if deploying to Firebase) |
| Realtime Database | Using Firestore instead |

---

## Summary Checklist

Use this quick checklist to verify your Firebase Console configuration:

- [ ] Email/Password authentication enabled
- [ ] Other auth providers disabled
- [ ] Firestore database created
- [ ] Firestore location selected (cannot be changed later)
- [ ] Security rules published
- [ ] Composite indexes created (2 indexes)
- [ ] Service account private key generated and downloaded
- [ ] Web app registered
- [ ] Firebase config copied
- [ ] Unnecessary services NOT enabled

---

## Related Documentation

- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Comprehensive setup guide
- **[FIREBASE_CHECKLIST.md](./FIREBASE_CHECKLIST.md)** - Setup verification checklist
- **[env.template](./env.template)** - Environment variables template

---

**Last Updated**: January 2026
