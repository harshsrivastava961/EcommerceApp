import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chip } from 'react-native-paper';

import { CATEGORY_LABELS } from '../utils/constants';
import type { ProductCategory } from '../utils/types';

interface Props {
  categories: ProductCategory[];
  selectedCategory: ProductCategory;
  onSelect: (category: ProductCategory) => void;
}

const CategoryChips: React.FC<Props> = ({
  categories,
  selectedCategory,
  onSelect,
}) => (
  <View style={styles.container}>
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={categories}
      keyExtractor={item => item}
      renderItem={({ item }) => (
        <Chip
          style={styles.chip}
          selected={item === selectedCategory}
          onPress={() => onSelect(item)}
        >
          {CATEGORY_LABELS[item] ?? item}
        </Chip>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  chip: {
    marginHorizontal: 4,
  },
});

export default CategoryChips;

