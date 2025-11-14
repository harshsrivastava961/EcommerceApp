import axios from 'axios';

import { STRIPE_BACKEND_URL } from '../config/stripeConfig';

interface CreatePaymentIntentPayload {
  amount: number;
  currency: string;
  items: Array<{ id: number; quantity: number }>;
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export const createPaymentIntent = async (
  payload: CreatePaymentIntentPayload,
): Promise<CreatePaymentIntentResponse> => {
  const response = await axios.post<CreatePaymentIntentResponse>(
    `${STRIPE_BACKEND_URL}/create-payment-intent`,
    payload,
  );
  return response.data;
};

