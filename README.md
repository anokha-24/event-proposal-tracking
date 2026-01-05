# Event Proposal for Anokha Techfest 🌟

This is a React-based project for managing and submitting event proposals for Anokha Techfest. The project is built using Firebase for backend services and ShadCN components for a modern and responsive UI.

## 🚀 Getting Started

## 1. Install dependencies

```sh
npm install
npm install date-fns
```

## 2. Install Firebase and Firebase Tools

```sh
npm install firebase
npm install -g firebase-tools
npm install react-firebase-hooks
```

## 3. Set up ShadCN

Initialize ShadCN:

```sh
npx shadcn@latest init
```

Add necessary components:

```sh
npx shadcn@latest add input button card select alert sidebar tabs command popover
```

## 4. Install Lucide-React

```sh
npm install lucide-react
```

## 5. Set up Firebase Configuration

📚 **For detailed Firebase setup instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)**

The comprehensive guide covers:
- Creating a Firebase project
- Enabling required services (Authentication, Firestore)
- Exact Firebase options to enable
- Setting up environment variables
- Security rules and indexes
- Troubleshooting common issues

### Quick Setup (Summary)

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Email/Password Authentication**
3. Create a **Firestore Database** (start in test mode for development)
4. Generate **Service Account Key** for Admin SDK
5. Copy `env.template` to `.env.local` and fill in your Firebase credentials
6. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed step-by-step instructions

## 6. Start the development server

```sh
npm run dev
```

---

## 📖 Firebase Setup Documentation

This project requires Firebase configuration. We provide comprehensive documentation to guide you through the setup process:

### 📚 Complete Setup Guides

1. **[FIREBASE_QUICKSTART.md](./FIREBASE_QUICKSTART.md)** - **⚡ FAST TRACK** (15-20 min)
   - Condensed setup guide for quick configuration
   - Step-by-step with time estimates
   - Perfect for experienced developers
   - **Use this if you want to get started quickly**

2. **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - **📖 COMPREHENSIVE** (30-45 min)
   - Complete step-by-step Firebase configuration guide
   - Covers project creation, authentication, Firestore, and Admin SDK
   - Includes troubleshooting and security best practices
   - **Recommended for first-time setup or detailed understanding**

3. **[FIREBASE_OPTIONS.md](./FIREBASE_OPTIONS.md)** - **🔍 REFERENCE**
   - Exact Firebase Console options to enable/disable
   - Visual guide showing what to click and configure
   - Perfect for verifying your settings
   - **Use this as a reference while setting up**

4. **[FIREBASE_CHECKLIST.md](./FIREBASE_CHECKLIST.md)** - **✅ VERIFICATION**
   - Interactive checklist to track your progress
   - Ensures you haven't missed any steps
   - Includes testing and verification steps
   - **Use this to verify your setup is complete**

5. **[env.template](./env.template)** - **⚙️ CONFIGURATION**
   - Template for `.env.local` file
   - Shows all required environment variables
   - Includes helpful comments and instructions
   - **Copy this to `.env.local` and fill in your values**

6. **[FIREBASE_DOCS_SUMMARY.md](./FIREBASE_DOCS_SUMMARY.md)** - **📋 OVERVIEW**
   - Overview of all documentation files
   - Recommended setup flow
   - Quick reference table
   - **Read this to understand the documentation structure**

### 🎯 Quick Start Path

1. Read **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** for detailed instructions
2. Use **[FIREBASE_OPTIONS.md](./FIREBASE_OPTIONS.md)** as a reference
3. Copy **[env.template](./env.template)** to `.env.local` and configure
4. Verify completion with **[FIREBASE_CHECKLIST.md](./FIREBASE_CHECKLIST.md)**

---

## Firebase Project Setup (Legacy Instructions)


1. Go to the Firebase Console
2. Click on "Add project" or "Create a project" button
3. Enter your project name (e.g., "anokha-techfest-proposals")
4. Click "Continue"
5. Choose whether to enable Google Analytics for your project:
   - Select "Enable Google Analytics for this project" if you want analytics
   - Or toggle it off if you don't need analytics
   - Click "Continue"
6. If you enabled Analytics, configure Google Analytics:
   - Select your Analytics account or create a new one
   - Choose your country/region
   - Accept the terms and click "Create project"
7. Wait for Firebase to set up your project (this may take a few moments)
8. Click "Continue" when the setup is complete
9. You'll be redirected to your Firebase project dashboard
10. Set up Authentication:
    - Click on "Authentication" in the left sidebar
    - Click "Get started"
    - Go to the "Sign-in method" tab
    - Enable your preferred sign-in providers (Email/Password is recommended)
11. Set up Firestore Database:
    - Click on "Firestore Database" in the left sidebar
    - Click "Create database"
    - Choose "Start in test mode" for development (you can change this later)
    - Select your database location
    - Click "Done"
12. Get your Firebase configuration:
    - Click on the gear icon (⚙️) next to "Project Overview"
    - Select "Project settings"
    - Scroll down to "Your apps" section
    - Click on the web icon </>
    - Register your app with a nickname
    - Copy the configuration object for your .env.local file

Your Firebase project is now ready to use with your application!

## Managing User Roles in Firebase

When developing or testing user and reviewer functionalities, manual role adjustment may be
required through the Firebase console. Follow these steps to modify user roles:

## Steps to Update User Roles:

1. Navigate to your Firebase project console
2. Select "Firestore Database" from the left sidebar
3. Click on your preferred collection (typically "Auth" or "Users")
4. Select the specific document for the user whose role needs modification
5. A document details panel will appear displaying all user fields and data
6. Locate the "role" field within the document
7. Click on the edit icon next to the "role" field
8. Update the role value to the desired permission level (e.g., "User", "Reviewer")
9. Click "Update" to save the changes

## Note 1 :

Role changes take effect immediately and will be reflected in the application upon the user's
next authentication or page refresh.

## Reference Screenshot:
![Screenshot 2025-05-30 182409](https://github.com/user-attachments/assets/08415d00-eb4e-4dbd-9939-8fc56761149a)

---

## Note 2 :

To fetch reviewer proposals, Firestore indexing must be enabled.
When an API call is made from the reviewer 'View Proposals' page,
a link to create the required index will be logged in the terminal.
(i.e)When this API is triggered Firestore will log a helpful link in the terminal The link looks like:
https://console.firebase.google.com/firestore/indexescreate_composite=...

Clicking this link will take you to Firestore’s console with the "Create Index" form pre-filled. Just click "Create".

## Reference Screenshot:
![Image](https://github.com/user-attachments/assets/10d9a32f-c185-423b-8458-44768f14c2b5)


## 🧼 Code Formatting (Prettier)

To ensure consistent formatting across the project, run:

```bash
npx prettier --write .
```

**✅ Important:** Run this **before committing, pushing, or opening a pull request.**
