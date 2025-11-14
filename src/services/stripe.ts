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
  try {
    const response = await axios.post<CreatePaymentIntentResponse>(
      `${STRIPE_BACKEND_URL}/create-payment-intent`,
      payload,
      {
        timeout: 10000, // 10 second timeout
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network')) {
      throw new Error(
        `Cannot connect to payment server at ${STRIPE_BACKEND_URL}. Please make sure the backend server is running.`,
      );
    }
    if (error.response) {
      // Server responded with error
      throw new Error(
        error.response.data?.error || error.response.data?.message || 'Payment server error',
      );
    }
    throw error;
  }
};

