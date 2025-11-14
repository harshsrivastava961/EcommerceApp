export const STRIPE_PUBLISHABLE_KEY =
  process.env.STRIPE_PUBLISHABLE_KEY ??
  'pk_test_51STGASBajgt75ZceCVnIHMrr9bZKnvSPRuqFgj2xk3s2r62cy59090lwSTcdSlSYlebhbBdhRPMO53U5EMCpaAeX003laJ6z7U';

export const STRIPE_BACKEND_URL =
  process.env.STRIPE_BACKEND_URL ?? 'http://10.0.2.2:4242'; // Use 10.0.2.2 for Android emulator, localhost for iOS simulator

