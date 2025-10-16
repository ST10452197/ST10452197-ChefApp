import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

type Props = {
  onPress: () => void;
  bottomInset?: number; 
};

export default function Fab({ onPress, bottomInset = 0 }: Props) {
  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: bottomInset + spacing.s4 }]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Add menu item"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.btn}
      >
        <Feather name="plus" size={28} color={colors.textOnGreen} />
      </Pressable>
    </View>
  );
}

const SIZE = 64;

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: spacing.s4,
  },
  btn: {
    width: SIZE,
    height: SIZE,
    borderRadius: radius.pill,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: 'rgba(0,0,0,0.35)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
});
