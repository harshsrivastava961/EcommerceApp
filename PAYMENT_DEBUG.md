# Payment Flow Debugging Guide

## Changes Made

### 1. Improved Payment Result Handling
- Removed the timeout wrapper that was causing issues
- Added detailed logging at every step of the payment flow
- Stripe's `presentPaymentSheet()` returns:
  - `undefined` or `{}` on success
  - `{ error: { code, message } }` on failure

### 2. Added Toast Notifications
- "Payment Successful!" appears immediately after payment
- "Order Created!" appears when the order is saved
- Error toasts show if something goes wrong

### 3. Enhanced Logging
The console will now show:
```
Creating payment intent...
Payment intent created: pi_xxxxx
Initializing payment sheet...
Payment sheet initialized successfully
About to present payment sheet...
presentPaymentSheet result: <the actual result>
Payment completed successfully!
Payment successful, creating order...
Dispatching placeOrder with: { userId, itemsCount, total, ... }
Order created successfully: <orderId>
Cart cleared
Navigating to OrderSuccess screen...
```

## How to Debug

### Step 1: Check Metro Console
After you complete a payment, watch the Metro bundler console. You should see the logs above in sequence.

**If the logs stop at "About to present payment sheet":**
- The payment sheet is crashing
- Check `adb logcat` for native Android errors

**If logs reach "Payment completed successfully" but stop there:**
- The payment succeeded but order creation is failing
- Check for Firestore errors in the logs

**If logs reach "Order created successfully" but don't navigate:**
- Navigation might be failing
- The OrderSuccess screen might have an error

### Step 2: Check Android Logs
```bash
# Terminal 1: Metro bundler (already running)
npm start

# Terminal 2: Run app
npm run android

# Terminal 3: Watch Android logs (filter for errors)
adb logcat | grep -E "(ERROR|ReactNativeJS|Stripe|Payment)"
```

### Step 3: Check Backend Server
Make sure the backend is running:
```bash
cd backend
npm start
```

You should see: `🚀 Stripe Backend Server running on http://localhost:4242`

### Step 4: Test Payment with Different Cards

Use these Stripe test cards:

**Success:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Decline:**
- Card: `4000 0000 0000 0002`

### Step 5: Check Firestore

1. Open Firebase Console → Firestore Database
2. Look for the `orders` collection
3. Check if orders are being created with your user ID

**If orders are NOT appearing:**
- Check Firestore security rules (should allow authenticated writes)
- Check if the composite index exists (userId + createdAt)

### Step 6: Common Issues & Fixes

#### Issue: Payment sheet closes immediately
**Fix:** Payment is likely succeeding. Check the logs to see if order creation is running.

#### Issue: "Payment sheet timeout" error
**Fix:** This was removed. If you still see it, clear Metro cache:
```bash
npm start -- --reset-cache
```

#### Issue: Order not appearing in Profile
**Fix:** 
1. Check Firestore security rules
2. Create the composite index (see main README)
3. Pull to refresh the Profile screen

#### Issue: Can't connect to payment server
**Fix:**
```bash
# Make sure backend is running
cd backend
npm start

# Make sure you're using the right URL in stripeConfig.ts
# Android Emulator: http://10.0.2.2:4242
# iOS Simulator: http://localhost:4242
```

## Expected Behavior After Fix

1. You tap "Pay Now" → payment sheet opens
2. You enter card details (4242 4242 4242 4242) → tap Pay
3. Payment sheet closes
4. Toast appears: "Payment Successful! Creating your order..."
5. Toast appears: "Order Created! Order #XXXXXXXX"
6. You're navigated to the OrderSuccess screen
7. Cart is cleared
8. Order appears in Profile → Order History

## If Still Not Working

Check these files in order:

1. **Metro console** - are all the logs appearing?
2. **`adb logcat`** - any native errors?
3. **Backend logs** - is the payment intent being created?
4. **Firebase Console → Firestore** - are orders being saved?
5. **Network tab** (if you can access it) - is the API call succeeding?

## Last Resort: Simplify

If nothing works, we can temporarily skip Firestore and just navigate to success:

```typescript
// In CheckoutScreen.tsx, replace the order creation with:
console.log('Payment successful! Skipping Firestore for testing...');
dispatch(clearCart());
navigation.replace('OrderSuccess', { orderId: 'test-' + Date.now() });
```

This will help isolate whether the issue is with Stripe or Firestore.

