import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

import type { Product } from '../utils/types';
import { COLORS } from '../utils/constants';
import { formatCurrency } from '../utils/format';

interface Props {
  product: Product;
  onPress: (productId: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onPress, onAddToCart }) => (
  <Card style={styles.card} onPress={() => onPress(product.id)}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: product.image }} style={styles.image} />
    </View>
    <Card.Content>
      <Text variant="titleMedium" numberOfLines={2} style={styles.title}>
        {product.title}
      </Text>
      <Text style={styles.price}>{formatCurrency(product.price)}</Text>
    </Card.Content>
    <Card.Actions>
      <Button onPress={() => onAddToCart(product)} mode="contained-tonal">
        Add to Cart
      </Button>
    </Card.Actions>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    color: COLORS.text,
    marginTop: 8,
  },
  price: {
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default ProductCard;

