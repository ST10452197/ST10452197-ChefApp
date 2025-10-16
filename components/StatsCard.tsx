import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, type } from '../theme';

export type Course = 'starter' | 'main' | 'dessert';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number; 
};

type Props = {
  items: MenuItem[];
};

export default function StatsCard({ items }: Props) {
  const stats = useMemo(() => {
    const total = items.length;

    const avg = (course: Course) => {
      const list = items.filter(i => i.course === course);
      if (list.length === 0) return 0;
      const sum = list.reduce((s, i) => s + i.price, 0);
      return Math.round(sum / list.length);
    };

    return {
      total,
      avgStarter: avg('starter'),
      avgMain: avg('main'),
      avgDessert: avg('dessert'),
    };
  }, [items]);

  return (
    <View style={styles.shadowWrap}>
      <View style={styles.card}>
        <Col number={String(stats.total)} labelTop="total" />
        <Col number={String(stats.avgStarter)} labelTop="average" labelBottom="starter" />
        <Col number={String(stats.avgMain)} labelTop="average" labelBottom="main" />
        <Col number={String(stats.avgDessert)} labelTop="average" labelBottom="dessert" />
      </View>
    </View>
  );
}

function Col({
  number,
  labelTop,
  labelBottom,
}: {
  number: string;
  labelTop: string;
  labelBottom?: string;
}) {
  return (
    <View style={styles.col}>
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.label}>{labelTop}</Text>
      {labelBottom ? <Text style={styles.label}>{labelBottom}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    marginHorizontal: spacing.s4, // 16
    marginTop: spacing.s4,
    shadowColor: 'rgba(46, 125, 50, 0.45)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
    borderRadius: radius.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg, // 12
    borderWidth: 1,
    borderColor: colors.outline,
    paddingVertical: spacing.s4, // 16
    paddingHorizontal: spacing.s4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.s2,
  },
  number: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 26,
  },
  label: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
