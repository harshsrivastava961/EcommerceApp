import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import type { RootStackParamList } from '../../navigation/AppNavigator';
import { COLORS } from '../../utils/constants';

type OrderSuccessRouteProp = RouteProp<RootStackParamList, 'OrderSuccess'>;
type OrderSuccessNavigationProp = StackNavigationProp<
  RootStackParamList,
  'OrderSuccess'
>;

const OrderSuccessScreen = () => {
  const route = useRoute<OrderSuccessRouteProp>();
  const navigation = useNavigation<OrderSuccessNavigationProp>();

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Success!
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Your order has been placed.
      </Text>
      <Text style={styles.orderId}>Order ID: {route.params.orderId}</Text>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        Continue Shopping
      </Button>
      <Button
        onPress={() => navigation.navigate('Main', { screen: 'Profile' } as any)}
      >
        View Orders
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
  },
  orderId: {
    color: COLORS.muted,
  },
  button: {
    minWidth: 200,
    marginTop: 12,
  },
});

export default OrderSuccessScreen;

