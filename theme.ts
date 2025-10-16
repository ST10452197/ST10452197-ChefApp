// theme.ts
export const colors = {
  green: '#2E7D32',
  bg: '#F7F7F7',
  surface: '#FFFFFF',
  textOnGreen: '#FFFFFF',
  textPrimary: '#1C1C1C',
  textSecondary: '#6F6F6F',
  outline: '#E0E0E0',
  price: '#111111',
  iconOnGreen: '#FFFFFF',
};

export const spacing = { s1: 4, s2: 8, s3: 12, s4: 16, s5: 20, s6: 24 };
export const radius  = { sm: 8, lg: 12, xl: 16, pill: 999 };

export const type = {
  titleLg: { fontSize: 18, fontWeight: '600' as const, lineHeight: 22, letterSpacing: 0.2 },


  label:   { fontSize: 14, fontWeight: '800' as const, lineHeight: 18, letterSpacing: 0.3 },
};
