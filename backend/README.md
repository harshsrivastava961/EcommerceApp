# Stripe Payment Backend

Simple Express server for creating Stripe PaymentIntents.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Stripe secret key:
   ```
   STRIPE_SECRET_KEY=sk_test_your_actual_key_here
   PORT=4242
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

The server will run on `http://localhost:4242`

## Endpoints

### POST `/create-payment-intent`

Creates a Stripe PaymentIntent.

**Request Body:**
```json
{
  "amount": 2000,
  "currency": "usd",
  "items": [
    { "id": 1, "quantity": 2 }
  ]
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx"
}
```

## Testing

Use Stripe test cards:
- `4242 4242 4242 4242` - Success
- `4000 0000 0000 0002` - Card declined

## Notes

- This is a development server. For production, add authentication, error handling, and security measures.
- Never commit your `.env` file with real keys.

