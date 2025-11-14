# ⚡ Quick Start - Fix Firebase Error

You're seeing: `Firebase: Error (auth/api-key-not-valid)`

## 🔥 Immediate Fix: Configure Firebase

### Step 1: Get Firebase Config (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** → Name it → Continue → Create
3. Go to **Build** → **Authentication** → **Get started** → Enable **Email/Password**
4. Go to **Build** → **Firestore Database** → **Create database** → **Start in test mode**
5. Go to **Project Settings** (⚙️) → **General** tab
6. Scroll to **"Your apps"** → Click **"Add app"** → Select **Web** (</>)
7. Copy the config values

### Step 2: Update Config File

Open `src/config/firebaseConfig.ts` and replace with your values:

```typescript
export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIza...", // ← Paste from Firebase Console
  authDomain: "your-project.firebaseapp.com", // ← Paste
  projectId: "your-project-id", // ← Paste
  storageBucket: "your-project.appspot.com", // ← Paste
  messagingSenderId: "123456789", // ← Paste
  appId: "1:123456789:web:abc123" // ← Paste
};
```

### Step 3: Restart App

```bash
# Stop Metro (Ctrl+C if running)
npm start -- --reset-cache
# Then run app again
npm run android
```

✅ **Firebase error should be fixed!**

---

## 💳 Next: Set Up Stripe (Optional - for payments)

### Quick Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Get **Publishable key** (starts with `pk_test_...`)
3. Open `src/config/stripeConfig.ts`:
   ```typescript
   export const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_key_here';
   ```

### Start Backend Server (for payments)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add: STRIPE_SECRET_KEY=sk_test_your_key_here
npm start
```

Keep this server running when testing payments.

---

## 📖 Full Details

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for complete instructions.

