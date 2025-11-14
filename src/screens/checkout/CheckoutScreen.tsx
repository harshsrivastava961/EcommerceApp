import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useStripe } from '@stripe/stripe-react-native';

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
      const { clientSecret, paymentIntentId } = await createPaymentIntent(payload);

      const initResult = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
      });

      if (initResult.error) {
        throw new Error(initResult.error.message);
      }

      const presentResult = await stripe.presentPaymentSheet({
        clientSecret,
      });

      if (presentResult.error) {
        throw new Error(presentResult.error.message);
      }

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

      dispatch(clearCart());
      navigation.replace('OrderSuccess', { orderId: order.id });
    } catch (error) {
      Alert.alert('Payment Error', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
};

const styles = StyleSheet.create({
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

