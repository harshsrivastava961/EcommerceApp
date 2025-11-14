import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/format';

interface Props {
  subtotal: number;
  tax: number;
  total: number;
  currency?: string;
  onCheckout: () => void;
  checkoutLabel?: string;
  disabled?: boolean;
}

const CartSummary: React.FC<Props> = ({
  subtotal,
  tax,
  total,
  currency = 'USD',
  onCheckout,
  checkoutLabel = 'Checkout',
  disabled,
}) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <Text variant="bodyLarge">Subtotal</Text>
      <Text>{formatCurrency(subtotal, currency)}</Text>
    </View>
    <View style={styles.row}>
      <Text variant="bodyLarge">Tax</Text>
      <Text>{formatCurrency(tax, currency)}</Text>
    </View>
    <View style={styles.row}>
      <Text variant="titleMedium" style={styles.totalLabel}>
        Total
      </Text>
      <Text variant="titleMedium" style={styles.totalAmount}>
        {formatCurrency(total, currency)}
      </Text>
    </View>
    <Button
      mode="contained"
      onPress={onCheckout}
      style={styles.checkoutButton}
      disabled={disabled}
    >
      {checkoutLabel}
    </Button>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: COLORS.text,
    fontWeight: '700',
  },
  totalAmount: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  checkoutButton: {
    marginTop: 8,
  },
});

export default CartSummary;

