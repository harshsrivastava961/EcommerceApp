import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

import { COLORS } from '../utils/constants';

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const QuantitySelector: React.FC<Props> = ({
  quantity,
  onIncrease,
  onDecrease,
}) => (
  <View style={styles.container}>
    <IconButton icon="minus" onPress={onDecrease} />
    <Text style={styles.quantity}>{quantity}</Text>
    <IconButton icon="plus" onPress={onIncrease} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantity: {
    minWidth: 32,
    textAlign: 'center',
    color: COLORS.text,
  },
});

export default QuantitySelector;

