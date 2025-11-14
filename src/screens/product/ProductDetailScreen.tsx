import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { formatCurrency } from '../../utils/format';
import { COLORS } from '../../utils/constants';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addToCart } from '../../redux/slices/cartSlice';
import type { HomeStackParamList } from '../../navigation/AppNavigator';
import { fakestoreApi } from '../../services/api';
import type { Product } from '../../utils/types';

type ProductDetailRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector(state => state.products);
  const [product, setProduct] = useState<Product | undefined>(
    products.find(item => item.id === route.params.productId),
  );
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product) {
      fakestoreApi
        .get<Product>(`/products/${route.params.productId}`)
        .then(response => {
          setProduct(response.data);
        })
        .catch(err => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [product, route.params.productId]);

  const ratingLabel = useMemo(() => {
    if (!product?.rating) {
      return null;
    }
    return `${product.rating.rate} (${product.rating.count})`;
  }, [product]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!product || error) {
    return (
      <View style={styles.loader}>
        <Text>{error ?? 'Product not found.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {product.title}
        </Text>
        {ratingLabel ? (
          <Text style={styles.rating}>Rating: {ratingLabel}</Text>
        ) : null}
        <Text variant="titleLarge" style={styles.price}>
          {formatCurrency(product.price)}
        </Text>
        <Text style={styles.description}>{product.description}</Text>
        <Button
          mode="contained"
          onPress={() => {
            dispatch(addToCart(product));
            navigation.goBack();
          }}
        >
          Add to Cart
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 320,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  content: {
    gap: 16,
  },
  title: {
    color: COLORS.text,
    fontWeight: '600',
  },
  rating: {
    color: COLORS.muted,
  },
  price: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  description: {
    lineHeight: 20,
  },
});

export default ProductDetailScreen;

