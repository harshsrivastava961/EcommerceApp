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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text, Card, IconButton } from 'react-native-paper';

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
    <Card style={styles.cartItemCard} elevation={2}>
      <View style={styles.cartItem}>
        <Image source={{ uri: item.product.image }} style={styles.image} />
        <View style={styles.details}>
          <Text variant="titleSmall" numberOfLines={2} style={styles.itemTitle}>
            {item.product.title}
          </Text>
          <Text style={styles.unitPrice}>
            {formatCurrency(item.product.price)} each
          </Text>
          <View style={styles.quantityRow}>
            <QuantitySelector
              quantity={item.quantity}
              onIncrease={() => dispatch(incrementQuantity(item.product.id))}
              onDecrease={() => dispatch(decrementQuantity(item.product.id))}
            />
            <Text style={styles.totalPrice}>
              {formatCurrency(item.product.price * item.quantity)}
            </Text>
          </View>
        </View>
        <IconButton
          icon="delete-outline"
          iconColor="#E53935"
          size={24}
          onPress={() => dispatch(removeFromCart(item.product.id))}
          style={styles.removeButton}
        />
      </View>
    </Card>
  );

  // const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[styles.safeArea]}
      edges={['top', 'left', 'right']}
    >
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    padding: 16,
    paddingBottom: 200,
  },
  cartItemCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
    minHeight: 100,
  },
  itemTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  unitPrice: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalPrice: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  price: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  removeButton: {
    margin: 0,
  },
  removeText: {
    color: COLORS.danger,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
});

export default CartScreen;

