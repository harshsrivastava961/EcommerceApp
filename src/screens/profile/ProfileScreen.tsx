import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signOutUser } from '../../redux/slices/authSlice';
import { fetchUserOrders } from '../../redux/slices/orderSlice';
import { formatCurrency } from '../../utils/format';

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const { orders, loading, error } = useAppSelector(state => state.orders);

  const loadOrders = useCallback(() => {
    if (user) {
      dispatch(fetchUserOrders({ userId: user.uid }));
    }
  }, [dispatch, user]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <Text variant="titleLarge">Profile</Text>
          <Text>Email: {user?.email}</Text>
          <Text>Total orders: {orders.length}</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => dispatch(signOutUser())}>Logout</Button>
        </Card.Actions>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Order History
      </Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading orders: {error}</Text>
        </View>
      )}

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={loadOrders}
        renderItem={({ item }) => (
          <Card style={styles.orderCard}>
            <Card.Content>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={styles.total}>
                {formatCurrency(item.total, item.currency)}
              </Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text>No orders yet.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  profileCard: {
    borderRadius: 12,
  },
  sectionTitle: {
    marginTop: 16,
  },
  orderCard: {
    marginBottom: 12,
  },
  orderId: {
    fontWeight: '600',
  },
  total: {
    marginTop: 8,
    fontWeight: '700',
  },
  emptyState: {
    marginTop: 64,
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 160,
  },
  errorContainer: {
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#c62828',
  },
});

export default ProfileScreen;

