import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius } from '../theme';

export type CourseFilter = 'all' | 'starter' | 'main' | 'dessert';

type Props = {
  value: CourseFilter;
  onChange: (v: CourseFilter) => void;
};

export default function FilterChips({ value, onChange }: Props) {
  const Chip = ({
    label,
    val,
  }: {
    label: string;
    val: CourseFilter;
  }) => {
    const active = value === val;
    return (
      <Pressable
        onPress={() => onChange(val)}
        accessibilityRole="button"
        accessibilityLabel={`Filter ${label}`}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
      >
        <Text style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
          {label.toUpperCase()}
        </Text>
      </Pressable>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rowContent}
      style={styles.row}
    >
      <Chip label="Starter"  val="starter" />
      <Chip label="Main"     val="main" />
      <Chip label="Dessert"  val="dessert" />
      <Chip label="All"      val="all" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: spacing.s6,            
  },
  rowContent: {
    paddingHorizontal: spacing.s4,    
    columnGap: spacing.s3,            
  },
  chip: {
    minWidth: 92,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.s4,
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
    shadowColor: 'rgba(255, 255, 255, 0.18)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  chipActive: {
    backgroundColor: colors.green,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  chipTextInactive: {
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: colors.textOnGreen,
  },
});
