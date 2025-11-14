import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ListRenderItem } from 'react-native';
import {
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Text } from 'react-native-paper';

import QuantitySelector from '../../components/QuantitySelector';
import CartSummary from '../../components/CartSummary';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../../redux/slices/cartSlice';
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartTax,
  selectCartTotal,
  selectCurrency,
} from '../../redux/selectors/cartSelectors';
import type {
  RootStackParamList,
  TabParamList,
} from '../../navigation/AppNavigator';
import { COLORS } from '../../utils/constants';
import { formatCurrency } from '../../utils/format';
import type { CartItem } from '../../utils/types';

type CartScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Cart'>,
  StackNavigationProp<RootStackParamList>
>;

const CartScreen = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const tax = useAppSelector(selectCartTax);
  const total = useAppSelector(selectCartTotal);
  const currency = useAppSelector(selectCurrency);

  const renderItem: ListRenderItem<CartItem> = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.product.image }} style={styles.image} />
      <View style={styles.details}>
        <Text variant="titleSmall" numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.price}>
          {formatCurrency(item.product.price * item.quantity)}
        </Text>
        <QuantitySelector
          quantity={item.quantity}
          onIncrease={() => dispatch(incrementQuantity(item.product.id))}
          onDecrease={() => dispatch(decrementQuantity(item.product.id))}
        />
      </View>
      <TouchableOpacity
        onPress={() => dispatch(removeFromCart(item.product.id))}
        style={styles.removeButton}
      >
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="titleMedium">Your cart is empty.</Text>
          <Button onPress={() => navigation.navigate('Shop')}>Browse</Button>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => String(item.product.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
          <CartSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            currency={currency}
            onCheckout={() => navigation.navigate('Checkout')}
            disabled={items.length === 0}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 160,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  price: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  removeButton: {
    justifyContent: 'center',
  },
  removeText: {
    color: COLORS.danger,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});

export default CartScreen;

