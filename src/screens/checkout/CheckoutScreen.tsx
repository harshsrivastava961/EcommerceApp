import React, { useState, useEffect } from 'react';
import { Alert, AppState, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useStripe } from '@stripe/stripe-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import CartSummary from '../../components/CartSummary';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectCartItems, selectCartSubtotal, selectCartTax, selectCartTotal, selectCurrency } from '../../redux/selectors/cartSelectors';
import { clearCart } from '../../redux/slices/cartSlice';
import { placeOrder } from '../../redux/slices/orderSlice';
import { createPaymentIntent } from '../../services/stripe';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { formatCurrency } from '../../utils/format';

type CheckoutNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

const CheckoutScreen = () => {
  const navigation = useNavigation<CheckoutNavigationProp>();
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const currency = useAppSelector(selectCurrency);
  const user = useAppSelector(state => state.auth.user);

  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to complete the purchase.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add items to the cart before checkout.');
      return;
    }

    if (!stripe) {
      Alert.alert('Payment Error', 'Stripe is not initialized. Please restart the app.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        amount: Math.round(total * 100),
        currency,
        items: items.map(item => ({
          id: item.product.id,
          quantity: item.quantity,
        })),
      };

      console.log('Creating payment intent...', payload);
      let clientSecret: string;
      let paymentIntentId: string;

      try {
        const result = await createPaymentIntent(payload);
        clientSecret = result.clientSecret;
        paymentIntentId = result.paymentIntentId;
        console.log('Payment intent created:', paymentIntentId);
      } catch (error: any) {
        console.error('Payment intent creation error:', error);
        if (error.code === 'ECONNREFUSED' || error.message?.includes('Network')) {
          throw new Error(
            'Cannot connect to payment server. Please make sure the backend server is running on port 4242.',
          );
        }
        throw new Error(
          error.response?.data?.error || error.message || 'Failed to create payment intent',
        );
      }

      console.log('Initializing payment sheet...');
      if (!clientSecret) {
        throw new Error('Payment intent client secret is missing');
      }

      // Initialize payment sheet - native module requires customFlow key
      const initResult = await stripe.initPaymentSheet({
        merchantDisplayName: 'E-Commerce App',
        paymentIntentClientSecret: clientSecret,
        // @ts-ignore - customFlow is required by native module but not in TypeScript types
        customFlow: false,
      } as any);

      if (initResult.error) {
        console.error('Payment sheet init error:', initResult.error);
        throw new Error(initResult.error.message);
      }

      console.log('Payment sheet initialized successfully');
      
      // Validate client secret format before presenting
      if (!clientSecret || !clientSecret.startsWith('pi_')) {
        throw new Error('Invalid payment intent client secret format');
      }
      
      // Ensure app is in foreground before presenting payment sheet
      if (AppState.currentState !== 'active') {
        throw new Error('App must be in foreground to process payment');
      }
      
      console.log('Presenting payment sheet...');
      
      let paymentSuccessful = false;
      
      try {
        console.log('About to present payment sheet...');
        const presentResult = await stripe.presentPaymentSheet();
        
        console.log('presentPaymentSheet result:', JSON.stringify(presentResult));
        
        // Check if there's an error property
        if (presentResult && presentResult.error) {
          console.error('Payment sheet present error:', presentResult.error);
          // Handle specific error codes
          if (presentResult.error.code === 'Canceled') {
            console.log('User canceled payment');
            return; // Exit silently if user canceled
          }
          throw new Error(presentResult.error.message || 'Payment failed');
        }
        
        // If no error, payment was successful
        // Note: Stripe returns undefined for success, or an object with error property for failure
        paymentSuccessful = true;
        console.log('Payment completed successfully! Result:', presentResult);
      } catch (presentError: any) {
        console.error('Error presenting payment sheet (catch block):', presentError);
        
        // Handle user cancellation
        if (
          presentError?.code === 'Canceled' ||
          presentError?.message?.toLowerCase().includes('cancel') ||
          presentError?.message?.toLowerCase().includes('dismissed')
        ) {
          console.log('User canceled payment');
          return; // Exit silently if user canceled
        }
        
        // Re-throw other errors
        throw new Error(
          presentError?.message || 'Failed to process payment. Please try again.',
        );
      }

      // Only proceed if payment was successful
      if (!paymentSuccessful) {
        console.log('Payment was not successful, aborting order creation');
        return;
      }

      console.log('Payment successful, creating order...');
      
      // Show success toast immediately
      Toast.show({
        type: 'success',
        text1: 'Payment Successful!',
        text2: 'Creating your order...',
        position: 'top',
        visibilityTime: 3000,
      });
      
      try {
        console.log('Dispatching placeOrder with:', {
          userId: user.uid,
          itemsCount: items.length,
          total,
          currency,
          paymentIntentId,
        });
        
        const order = await dispatch(
          placeOrder({
            userId: user.uid,
            items,
            subtotal,
            tax,
            total,
            currency,
            paymentIntentId,
          }),
        ).unwrap();

        console.log('Order created successfully:', order.id);
        
        // Clear cart after successful order
        dispatch(clearCart());
        console.log('Cart cleared');
        
        // Show order success toast
        Toast.show({
          type: 'success',
          text1: 'Order Created!',
          text2: `Order #${order.id.substring(0, 8)}`,
          position: 'top',
          visibilityTime: 2000,
        });
        
        // Navigate to success screen with a small delay to show toast
        console.log('Navigating to OrderSuccess screen...');
        setTimeout(() => {
          navigation.replace('OrderSuccess', { orderId: order.id });
        }, 500);
      } catch (orderError: any) {
        console.error('Error creating order:', orderError);
        Toast.show({
          type: 'error',
          text1: 'Order Creation Failed',
          text2: orderError?.message || 'Unknown error',
          position: 'top',
          visibilityTime: 4000,
        });
        throw new Error(
          `Order creation failed: ${orderError?.message || 'Unknown error'}`,
        );
      }
    } catch (error: any) {
      console.error('Payment flow error:', error);
      const errorMessage =
        error?.message || error?.toString() || 'An unexpected error occurred during payment';
      Alert.alert('Payment Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Order Summary
      </Text>
      <View style={styles.section}>
        {items.map(item => (
          <View key={item.product.id} style={styles.itemRow}>
            <Text style={styles.itemTitle}>{item.product.title}</Text>
            <Text>
              {item.quantity} x {formatCurrency(item.product.price, currency)}
            </Text>
          </View>
        ))}
      </View>
      <CartSummary
        subtotal={subtotal}
        tax={tax}
        total={total}
        currency={currency}
        onCheckout={handlePayment}
        checkoutLabel="Pay Now"
        disabled={loading || items.length === 0}
      />
      <Button mode="text" onPress={() => navigation.goBack()}>
        Back to Cart
      </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    marginRight: 12,
  },
});

export default CheckoutScreen;

