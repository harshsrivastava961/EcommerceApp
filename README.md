## Overview

React Native e-commerce application featuring FakeStore product browsing, Firebase Authentication, Stripe (test mode) checkout, and Firestore-backed order history. The project is optimised for portfolio/demo usage and leverages only free resources.

## 🚀 Quick Start

**New to this project?** Start with the **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for step-by-step instructions on:
- Setting up Firebase (Authentication & Firestore)
- Configuring Stripe (test mode)
- Running the Stripe backend server
- Testing the complete app flow

## Tech Stack

- React Native CLI (TypeScript)
- Redux Toolkit + Redux Persist
- React Navigation (Stack + Bottom Tabs)
- React Native Paper UI kit
- Firebase Auth & Firestore
- Stripe Mobile SDK (`@stripe/stripe-react-native`)
- Async Storage persistence
- FakeStore API for catalog data

## Project Structure

```
src/
 ├─ components/          # Reusable UI / widgets
 ├─ config/              # Firebase & Stripe configuration
 ├─ navigation/          # Stack/tab navigators
 ├─ redux/               # Store, slices, selectors, hooks
 ├─ screens/             # Feature screens grouped by domain
 ├─ services/            # API/Firebase/Stripe helpers
 └─ utils/               # Constants, formatters, shared types
```

## Features

- Email/password signup, login, logout, password reset (Firebase Auth)
- Product listing with category filters, search, and sorting (FakeStore API)
- Product detail view with add-to-cart
- Cart management with quantity adjustments and persistence (AsyncStorage)
- Stripe test-mode checkout flow (requires lightweight backend for PaymentIntent)
- Firestore order persistence and profile order history list
- Profile management with logout and pull-to-refresh order history

## Environment Setup

1. Follow the official [React Native environment setup](https://reactnative.dev/docs/environment-setup) for your target platform(s).
2. Install JavaScript dependencies:
   ```sh
   npm install
   ```
3. (iOS) Install CocoaPods after configuring Xcode/iOS tooling:
   ```sh
   cd ios && pod install && cd ..
   ```

### Required Environment Variables

Create a `.env` (or configure your preferred env management) and ensure the following variables are available at build time (e.g. via `react-native-config`, `.xcconfig`, Gradle properties, or Metro transforms):

```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=

STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_BACKEND_URL=http://localhost:4242
```

Update `src/config/firebaseConfig.ts` and `src/config/stripeConfig.ts` if you prefer hard-coded values for demo scenarios.

### Stripe Payment Backend

Stripe’s mobile SDK requires a server to create PaymentIntents and return client secrets. Use one of the free sample backends:

- [Stripe Payment Sheet sample](https://github.com/stripe-samples/payment-sheet) (Node.js)
- Minimal Express server example:
  ```sh
  git clone https://github.com/stripe-samples/payment-sheet
  cd payment-sheet/server/node
  npm install
  STRIPE_WEBHOOK_SECRET= \
  STRIPE_SECRET_KEY=sk_test_xxx \
  PORT=4242 \
  npm start
  ```

Set `STRIPE_BACKEND_URL` to the running server URL.

## Running the App

Start Metro:
```sh
npm start
```

Run on Android:
```sh
npm run android
```

Run on iOS:
```sh
npm run ios
```

Ensure Android emulators / iOS simulators are running (or devices connected) before invoking the platform commands.

## Testing

Unit/UI tests can be added with Jest + React Native Testing Library (coming soon). To run the baseline test suite:
```sh
npm test
```

## Key Files

- `App.tsx` — Root providers (Redux, Persist, Stripe) and app entry navigation.
- `src/navigation/AppNavigator.tsx` — Auth stack + tabbed app flow.
- `src/redux/slices/*` — Feature state management (auth, products, cart, orders).
- `src/screens/*` — Screen implementations across auth, browsing, cart, checkout, profile.

## Roadmap / Enhancements

- Wishlist & favourites
- Coupon/discount handling
- Push notifications
- AI recommendations
- Multi-currency support

## Troubleshooting

- Double-check Firebase configuration & Firestore security rules for free-tier access.
- Use Stripe test cards (e.g. `4242 4242 4242 4242`) while in test mode.
- If Metro bundler fails to resolve modules, clear caches:
  ```sh
  npx react-native-clean-project
  npm start -- --reset-cache
  ```
