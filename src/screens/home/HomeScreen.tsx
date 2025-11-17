import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Searchbar, Text, Chip, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import CategoryChips from '../../components/CategoryChips';
import ProductCard from '../../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchCategories,
  fetchProducts,
  setSearchQuery,
  setSelectedCategory,
  setSortOption,
} from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { SORT_OPTIONS, COLORS } from '../../utils/constants';
import type { Product, SortOption } from '../../utils/types';
import type { HomeStackParamList } from '../../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const { products, loading, categories, selectedCategory, searchQuery, sortOption } =
    useAppSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ category: selectedCategory }));
  }, [dispatch, selectedCategory]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase();
    return products.filter(product =>
      product.title.toLowerCase().includes(normalizedQuery),
    );
  }, [products, searchQuery]);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  // const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[styles.safeArea]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Shop
        </Text>
      </View>
      <Searchbar
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={text => dispatch(setSearchQuery(text))}
        style={styles.searchBar}
        icon="magnify"
        clearIcon="close-circle"
      />
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={category => dispatch(setSelectedCategory(category))}
      />
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {SORT_OPTIONS.map(option => (
          <Chip
            key={option.value}
            selected={sortOption === option.value}
            onPress={() => dispatch(setSortOption(option.value as SortOption))}
            style={styles.sortChip}
            mode={sortOption === option.value ? 'flat' : 'outlined'}
          >
            {option.label}
          </Chip>
        ))}
      </View>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={productId =>
                navigation.navigate('ProductDetail', { productId })
              }
              onAddToCart={handleAddToCart}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text>No products found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontWeight: '700',
    color: COLORS.text,
  },
  searchBar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    elevation: 2,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 4,
  },
  sortChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 64,
    padding: 32,
  },
});

export default HomeScreen;

