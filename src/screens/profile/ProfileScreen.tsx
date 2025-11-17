import React, { useCallback, useMemo, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Chip, Text } from 'react-native-paper';
import {
  useFocusEffect,
  useNavigation,
  CompositeNavigationProp,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signOutUser } from '../../redux/slices/authSlice';
import { fetchUserOrders } from '../../redux/slices/orderSlice';
import { formatCurrency } from '../../utils/format';
import type { RootStackParamList, TabParamList } from '../../navigation/AppNavigator';

type ProfileNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Profile'>,
  StackNavigationProp<RootStackParamList>
>;

const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<ProfileNavigationProp>();
  const user = useAppSelector(state => state.auth.user);
  const { orders, loading, error } = useAppSelector(state => state.orders);
  const insets = useSafeAreaInsets();

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + (order.total ?? 0), 0),
    [orders],
  );
  const primaryCurrency = orders[0]?.currency ?? 'USD';

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

  const renderOrder = ({ item }: { item: (typeof orders)[number] }) => {
    const orderDate = new Date(item.createdAt).toLocaleString();
    const itemsCount = item.items?.reduce((sum, cartItem) => sum + cartItem.quantity, 0) ?? 0;
    return (
      <Card style={styles.orderCard}>
        <Card.Content style={styles.orderContent}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>#{item.id.slice(-6)}</Text>
            <Chip icon="currency-usd" compact textStyle={styles.orderAmountText}>
              {formatCurrency(item.total, item.currency)}
            </Chip>
          </View>
          <Text style={styles.orderDate}>{orderDate}</Text>
          <Text style={styles.orderItems}>{itemsCount} items</Text>
        </Card.Content>
      </Card>
    );
  };

  const listHeader = (
    <View style={styles.listHeader}>
      <Card style={styles.profileCard} mode="elevated">
        <Card.Content style={styles.profileContent}>
          <Avatar.Icon icon="account" size={52} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text variant="titleLarge" style={styles.profileTitle}>
              {user?.displayName || 'Welcome back'}
            </Text>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.profileActions}>
          <Button mode="contained-tonal" onPress={() => dispatch(signOutUser())}>
            Logout
          </Button>
        </Card.Actions>
      </Card>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Orders</Text>
          <Text style={styles.statValue}>{orders.length}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>
            {formatCurrency(totalSpent, primaryCurrency)}
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Order History
        </Text>
        {orders.length > 0 && (
          <Chip icon="refresh" compact onPress={loadOrders}>
            Refresh
          </Chip>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error loading orders: {error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top || 16 }]}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={loadOrders}
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Start shopping to see your order history here.
            </Text>
            <Button mode="contained" onPress={() => navigation.navigate('Shop')}>
              Browse Products
            </Button>
          </View>
        }
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  profileCard: {
    borderRadius: 20,
    backgroundColor: '#F8F5FF',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    backgroundColor: '#6C63FF',
  },
  profileInfo: {
    flex: 1,
  },
  profileTitle: {
    fontWeight: '700',
  },
  emailText: {
    color: '#5F6472',
    marginTop: 4,
  },
  profileActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    color: '#8A90A3',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  statValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1D21',
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  orderCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  orderContent: {
    gap: 6,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2F3142',
  },
  orderAmountText: {
    fontWeight: '700',
  },
  orderDate: {
    color: '#6D7285',
  },
  orderItems: {
    color: '#8A90A3',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    gap: 8,
  },
  emptyTitle: {
    fontWeight: '700',
    fontSize: 18,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#6D7285',
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
  listContent: {
    paddingBottom: 160,
  },
});

export default ProfileScreen;

