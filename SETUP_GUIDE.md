# 🚀 Complete Setup Guide - E-Commerce App

This guide will walk you through setting up Firebase, Stripe, and running the app.

---

## 📋 Prerequisites

- Node.js >= 20 installed
- React Native development environment set up
- Android Studio / Xcode installed
- Firebase account (free tier is sufficient)
- Stripe account (free test mode)

---

## 🔥 Step 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name (e.g., "EcommerceApp")
4. Disable Google Analytics (optional, for simplicity)
5. Click **"Create project"**

### 1.2 Enable Authentication

1. In Firebase Console, go to **Build** → **Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** provider:
   - Click on **"Email/Password"**
   - Toggle **"Enable"**
   - Click **"Save"**

### 1.3 Create Firestore Database

1. Go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Choose a location (closest to you)
5. Click **"Enable"**

### 1.4 Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General** tab
2. Scroll down to **"Your apps"** section
3. Click **"Add app"** → Select **Web** (</> icon)
4. Register app with a nickname (e.g., "EcommerceApp")
5. **Copy the config object** that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 1.5 Update Firebase Config in App

Open `src/config/firebaseConfig.ts` and replace the placeholder values:

```typescript
export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIza...", // Your actual API key
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 1.6 Set Firestore Security Rules (Optional - for production)

Go to **Firestore Database** → **Rules** tab and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own orders
    match /orders/{orderId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 💳 Step 2: Stripe Setup

### 2.1 Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Sign up for a free account
3. You'll automatically get **test mode** keys

### 2.2 Get Stripe Keys

1. In Stripe Dashboard, go to **Developers** → **API keys**
2. You'll see:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`) - Click "Reveal test key"

### 2.3 Update Stripe Config

Open `src/config/stripeConfig.ts` and replace:

```typescript
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_key_here';
export const STRIPE_BACKEND_URL = 'http://localhost:4242'; // Or your backend URL
```

---

## 🖥️ Step 3: Stripe Backend Server Setup

The app needs a backend server to create Stripe PaymentIntents securely.

### Option A: Use the Included Backend (Recommended)

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and add your Stripe secret key:
   ```
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   PORT=4242
   ```

5. Start the server:
   ```bash
   npm start
   ```

The server will run on `http://localhost:4242`

### Option B: Use Stripe Sample Backend

```bash
git clone https://github.com/stripe-samples/payment-sheet
cd payment-sheet/server/node
npm install
STRIPE_SECRET_KEY=sk_test_xxx PORT=4242 npm start
```

### Option C: For Android Emulator

If using Android emulator, update `STRIPE_BACKEND_URL` in `src/config/stripeConfig.ts`:

```typescript
export const STRIPE_BACKEND_URL = 'http://10.0.2.2:4242'; // Android emulator localhost
```

### Option D: For Physical Device

If testing on a physical device, use your computer's local IP:

1. Find your local IP:
   - **Mac/Linux**: `ifconfig | grep "inet "`
   - **Windows**: `ipconfig`
   - Look for something like `192.168.1.100`

2. Update `STRIPE_BACKEND_URL`:
   ```typescript
   export const STRIPE_BACKEND_URL = 'http://192.168.1.100:4242';
   ```

---

## 📱 Step 4: Run the App

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 iOS Setup (if using iOS)

```bash
cd ios && pod install && cd ..
```

### 4.3 Start Metro Bundler

```bash
npm start
```

### 4.4 Run on Android

In a new terminal:
```bash
npm run android
```

### 4.5 Run on iOS

In a new terminal:
```bash
npm run ios
```

---

## ✅ Step 5: Test the App

### Test Firebase Auth

1. Open the app
2. Click **"Sign Up"**
3. Create an account with email/password
4. You should be logged in and see the home screen

### Test Product Browsing

1. Browse products on the home screen
2. Click on a product to see details
3. Add items to cart

### Test Stripe Payment (Test Mode)

1. Go to Cart
2. Click **"Checkout"**
3. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
4. Complete payment
5. Check order history in Profile

---

## 🧪 Stripe Test Cards

Use these test cards in Stripe test mode:

| Card Number | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |

Use any future expiry date, any CVC, and any ZIP code.

---

## 🔧 Troubleshooting

### Firebase API Key Error

- ✅ Verify you copied the correct config from Firebase Console
- ✅ Check that all fields in `firebaseConfig.ts` are filled
- ✅ Ensure Authentication is enabled in Firebase Console

### Stripe Payment Fails

- ✅ Verify Stripe backend server is running
- ✅ Check `STRIPE_BACKEND_URL` matches your setup (localhost/emulator IP/physical device IP)
- ✅ Ensure Stripe secret key is set in backend `.env`
- ✅ Verify publishable key in `stripeConfig.ts`

### Android Emulator Network Issues

- Use `10.0.2.2` instead of `localhost` for backend URL
- Ensure backend server is running before testing payments

### iOS Simulator Network Issues

- Use `localhost` or `127.0.0.1` for backend URL
- Ensure backend server is running

---

## 📝 Summary Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Firebase config updated in `src/config/firebaseConfig.ts`
- [ ] Stripe account created
- [ ] Stripe publishable key added to `src/config/stripeConfig.ts`
- [ ] Stripe backend server running
- [ ] Stripe secret key set in backend `.env`
- [ ] App runs successfully
- [ ] Can create account and login
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can complete test payment

---

## 🎉 You're All Set!

Your e-commerce app should now be fully functional. Happy coding! 🚀

