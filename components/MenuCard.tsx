
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import { colors, spacing, radius } from '../theme';
import type { MenuItem } from './StatsCard';

type Props = {
  item: MenuItem;
  onPress?: (item: MenuItem) => void;
  imageSource?: ImageSourcePropType; 
};

const formatZAR = (n: number) => `ZAR ${n}`;
const courseLabel: Record<MenuItem['course'], string> = {
  starter: 'STARTER',
  main: 'MAIN',
  dessert: 'DESSERT',
};

const IMAGE_SIZE = 160;

export default function MenuCard({ item, onPress, imageSource }: Props) {
  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={styles.cardWrap}
      android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
    >
      <View style={styles.card}>
        {/* PRICE (top-right) */}
        <Text style={styles.price}>{formatZAR(item.price)}</Text>

        {/* PHOTO */}
        <View style={styles.photoWrap}>
          {imageSource ? (
            <Image source={imageSource} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder} />
          )}
        </View>

        {/* TEXT BLOCK */}
        <View style={styles.textBlock}>
          <Text numberOfLines={2} style={styles.name}>
            {item.name}
          </Text>

          <View style={[styles.chip, chipTint[item.course]]}>
            <Text style={styles.chipText}>{courseLabel[item.course]}</Text>
          </View>

          <Text numberOfLines={2} style={styles.desc}>
            {item.description}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    paddingHorizontal: spacing.s4, 
    marginTop: spacing.s4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outline,
    overflow: 'hidden',

    shadowColor: 'rgba(0,0,0,0.12)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },

  photoWrap: {
    padding: spacing.s3,
    alignItems: 'flex-start', 
  },
  photo: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,       
    borderRadius: radius.sm,  
    resizeMode: 'cover',      
  },
  photoPlaceholder: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: radius.sm, 
    backgroundColor: '#E9ECEF',
  },

  textBlock: {
    paddingHorizontal: spacing.s3,
    paddingBottom: spacing.s4,
  },

  price: {
    position: 'absolute',
    right: spacing.s3,
    top: spacing.s3,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  name: {
    marginTop: spacing.s1,
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 26,
  },

  chip: {
    alignSelf: 'flex-start',
    marginTop: spacing.s2,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.s3,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },

  desc: {
    marginTop: spacing.s2,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

const chipTint = StyleSheet.create({
  starter: { backgroundColor: '#F8FAFF' },
  main:    { backgroundColor: '#FAFFF8' },
  dessert: { backgroundColor: '#FFF9F8' },
});
