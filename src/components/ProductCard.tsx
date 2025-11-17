import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { Button, Card, Text, IconButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import type { Product } from '../utils/types';
import { COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/format';

interface Props {
  product: Product;
  onPress: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onPress, onAddToCart }) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleAddToCart = () => {
    // Prevent card press when button is clicked
    onAddToCart(product);
    
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Show toast notification
    Toast.show({
      type: 'success',
      text1: 'Added to Cart!',
      text2: product.title.substring(0, 30) + '...',
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  return (
    <Card style={styles.card} elevation={2}>
      <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(product.id)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {product.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {product.rating.rate}</Text>
            </View>
          )}
        </View>
        <Card.Content style={styles.cardContent}>
          <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
            {product.title}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
            {product.rating && (
              <Text style={styles.reviews}>({product.rating.count})</Text>
            )}
          </View>
        </Card.Content>
      </TouchableOpacity>
      <Card.Actions style={styles.actions}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Button
            mode="contained"
            onPress={handleAddToCart}
            style={styles.addButton}
            labelStyle={styles.addButtonLabel}
            icon="cart-plus"
          >
            Add to Cart
          </Button>
        </Animated.View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    position: 'relative',
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  cardContent: {
    paddingBottom: 8,
  },
  title: {
    color: COLORS.text,
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  price: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  reviews: {
    color: '#666',
    fontSize: 12,
  },
  actions: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    justifyContent: 'center',
  },
  addButton: {
    flex: 1,
    borderRadius: 8,
  },
  addButtonLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductCard;

