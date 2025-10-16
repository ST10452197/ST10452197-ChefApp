import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing, type } from '../theme';

type Props = {
  title?: string;
  onMenuPress?: () => void;        
  logoSource?: any;                
};

export default function TopBar({
  title = "Tonight's Menu",
  onMenuPress,
  logoSource,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();

  const toggleMenu = () => {
    onMenuPress?.();              
    setMenuOpen(v => !v);
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.green }}>
        <StatusBar style="light" />
        <View style={styles.bar}>
          <Pressable
            style={styles.leftSlot}
            accessibilityRole="button"
            accessibilityLabel="App logo"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {}}
          >
            {/* empty; visible logo is absolutely positioned */}
          </Pressable>

          {/* CENTER: title */}
          <View style={styles.center}>
            <Text numberOfLines={1} style={[type.titleLg, { color: colors.textOnGreen }]}>
              {title}
            </Text>
          </View>

          {/* RIGHT: hamburger */}
          <Pressable
            style={styles.rightSlot}
            onPress={toggleMenu}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="menu" size={24} color={colors.iconOnGreen} />
          </Pressable>

          {/* OVERLAY: big logo that does not affect layout */}
          {logoSource && (
            <View pointerEvents="none" style={styles.logoOverlay}>
              <Image source={logoSource} style={styles.logoImage} />
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* ==== TOP-RIGHT DROPDOWN as MODAL (sits above ALL content) ==== */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        {/* Backdrop */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setMenuOpen(false)}
          accessibilityLabel="Close menu"
        />

        {/* Menu card anchored under the bar at top-right */}
        <View
          style={[
            styles.menuCard,
            {
              top: insets.top + BAR_HEIGHT - 6,
              right: spacing.s4,
            },
          ]}
        >
          <Text style={styles.menuTitle}>Switch view</Text>

          {/* Example actions – wire these in HomeScreen via navigation as needed */}
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
            }}
            accessibilityRole="button"
          >
            <Feather name="users" size={18} color={colors.textPrimary} />
            <Text style={styles.menuItemText}>Customer view</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setMenuOpen(false);
            }}
            accessibilityRole="button"
          >
            <Feather name="users" size={18} color={colors.textPrimary} />
            <Text style={styles.menuItemText}>Chef view</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const BAR_HEIGHT = 56;

const LOGO_WIDTH = 100;    
const LOGO_HEIGHT = 250;    

const styles = StyleSheet.create({
  bar: {
    height: BAR_HEIGHT,
    backgroundColor: colors.green,
    paddingHorizontal: spacing.s4,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',      
    elevation: 6,              
    zIndex: 1000,              
    shadowColor: '#2E7D32',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  leftSlot: {
    width: 56,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  rightSlot: {
    width: 56,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  logoOverlay: {
    position: 'absolute',
    left: spacing.s4,
    top: 0,
    height: BAR_HEIGHT,
    justifyContent: 'center',
  },
  logoImage: { width: LOGO_WIDTH, height: LOGO_HEIGHT, resizeMode: 'contain' },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  menuCard: {
    position: 'absolute',
    minWidth: 220,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  menuTitle: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  menuItemText: { color: colors.textPrimary, fontWeight: '600' },
});
