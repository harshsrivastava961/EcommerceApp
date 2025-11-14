import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

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
import { SORT_OPTIONS } from '../../utils/constants';
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

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search products"
        value={searchQuery}
        onChangeText={text => dispatch(setSearchQuery(text))}
        style={styles.searchBar}
      />
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={category => dispatch(setSelectedCategory(category))}
      />
      <View style={styles.sortContainer}>
        {SORT_OPTIONS.map(option => (
          <Text
            key={option.value}
            style={[
              styles.sortOption,
              sortOption === option.value && styles.sortOptionSelected,
            ]}
            onPress={() =>
              dispatch(setSortOption(option.value as SortOption))
            }
          >
            {option.label}
          </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    marginBottom: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  sortOption: {
    marginRight: 12,
    marginTop: 4,
  },
  sortOptionSelected: {
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 64,
  },
});

export default HomeScreen;

