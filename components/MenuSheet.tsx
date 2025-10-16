import React from 'react';
import { Modal, View, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Action = { label: string; onPress: () => void };

export default function MenuSheet({
  visible,
  onClose,
  actions,
  top = 56,
  right = spacing.s4,
}: {
  visible: boolean;
  onClose: () => void;
  actions: Action[];
  top?: number;
  right?: number;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      {/* backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* menu panel (top-right) */}
      <View style={[styles.panel, { top, right }]}>
        {actions.map((a, i) => (
          <Pressable
            key={i}
            onPress={() => {
              onClose();
              a.onPress();
            }}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: '#F0F2F4' }]}
            accessibilityRole="button"
          >
            <Text style={styles.text}>{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.12)' },
  panel: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.outline,
    overflow: 'hidden',
    minWidth: 200,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  row: { paddingVertical: 12, paddingHorizontal: spacing.s4 },
  text: { fontWeight: '700', color: colors.textPrimary },
});
