import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { colors, spacing, radius, type } from '../theme';
import type { MenuItem } from '../components/StatsCard';
import type { MenuItemWithImage } from '../Screens/types';

type Course = MenuItem['course'];

/** Local fallback images by name (same prefixes as HomeScreen) */
const imageForName = (name: string) => {
  try {
    if (name.startsWith('Dark Chocolate Fondant')) {
      return require('../assets/Dark Chocolate Fondant,vanilla ice cream.jpg');
    }
    if (name.startsWith('Ribeye')) {
      return require('../assets/Ribeye 300g,mushroom jus,charred onion.jpg');
    }
    if (name.startsWith('Herb-Crusted')) {
      return require('../assets/Herb-crusted JingKlip,lemon caper butter.jpg');
    }
    if (name.startsWith('Peri-Peri Prawns')) {
      return require('../assets/Peri-Peri Prawns, garlic butter, lemons.jpg');
    }
    if (name.startsWith('Roasted Beet Carpaccio')) {
      return require('../assets/Roasted Beet Beet Carpoaccio , feta , Pictachio.jpg');
    }
    if (name.startsWith('Peri-Peri Half Chicken')) {
      return require('../assets/Peri-Peri Half Chicken,pap & chakalaka.jpg');
    }
    if (name.startsWith('Grilled Halloumi')) {
      return require('../assets/grilled Halloumi, lemon-mint dressing.jpg');
    }
    if (name.startsWith('Malva Pudding, warm custard')) {
      return require('../assets/Malva Pudding,warm custard.jpg');
    }
    if (name.startsWith('Amarula Baked Cheesecake caramel crumb')) {
      return require('../assets/Amarula Baked Cheesecake, caramel crumb.jpg');
    }
    return undefined;
  } catch {
    return undefined;
  }
};

export default function AddItemScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // callbacks passed from Home via navigate()
  const onAdd =
    route?.params?.onAdd as undefined | ((item: MenuItemWithImage) => void);
  const onDelete =
    route?.params?.onDelete as undefined | ((id: string) => void);

  // ===== LOCAL COPY of saved items for immediate UI updates on delete =====
  const passedItems: MenuItemWithImage[] = Array.isArray(route.params?.items)
    ? route.params.items
    : [];
  const [savedItems, setSavedItems] = useState<MenuItemWithImage[]>(passedItems);

  // Keep local list in sync if Home refreshes and navigation params change
  useEffect(() => {
    setSavedItems(passedItems);
  }, [route.params?.items]); // eslint-disable-line react-hooks/exhaustive-deps

  // form state
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [course, setCourse] = useState<Course | null>(null);
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const priceNumber = useMemo(() => {
    const n = Number(price.replace(/[^\d]/g, ''));
    return Number.isFinite(n) ? n : NaN;
  }, [price]);

  const valid = useMemo(() => {
    const nameOk = name.trim().length >= 2;
    const descOk = desc.trim().length >= 3;
    const courseOk = course !== null;
    const priceOk = Number.isFinite(priceNumber) && priceNumber >= 0;
    return nameOk && descOk && courseOk && priceOk;
  }, [name, desc, course, priceNumber]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to attach a dish picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1], // square crop fits your cards
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const save = () => {
    if (!valid) {
      Alert.alert('Incomplete', 'Please fill all fields correctly before saving.');
      return;
    }
    const newItem: MenuItemWithImage = {
      id: Date.now().toString(),
      name: name.trim(),
      description: desc.trim(),
      course: course as Course,
      price: priceNumber,
      imageUri,
    };

    if (typeof onAdd === 'function') {
      onAdd(newItem);
      navigation.goBack();
    } else {
      Alert.alert('Saved', 'Item captured. (Connect to Home state to see it appear.)', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  // ===== Robust back: fall back to 'Home' if there's no back stack =====
  const goBackSafe = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home'); // ensure it returns to your HomeScreen.tsx
    }
  };

  // ===== Delete handler: optimistic UI + call back to Home =====
  const handleDelete = (id: string) => {
    // Update this screen immediately
    setSavedItems(prev => prev.filter(i => i.id !== id));
    // Then inform Home (if the function exists)
    if (typeof onDelete === 'function') {
      onDelete(id);
    } else {
      console.warn('onDelete handler missing from navigation params.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* TOP BAR */}
      <View style={styles.bar}>
        <Pressable
          onPress={goBackSafe}  // ← use robust back
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.leftRight}
        >
          <Text style={styles.barAction}>{'\u2039'} BACK</Text>
        </Pressable>

        <View style={styles.center}>
          <Text style={styles.barTitle}>Add Item</Text>

          {/* LOGO SIZE — tweak width/height here */}
          <Image
            source={require('../assets/chefdininglogo.png')}
            style={{ width: 320, height: 80, resizeMode: 'contain', marginTop: 4 }}
          />
        </View>

        <Pressable
          onPress={save}
          accessibilityRole="button"
          accessibilityLabel="Save item"
          disabled={!valid}
          style={styles.leftRight}
        >
          <Text style={[styles.barAction, !valid && { opacity: 0.5 }]}>SAVE</Text>
        </Pressable>
      </View>

      {/* VERTICAL SCROLLER (entire page) */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: spacing.s6 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* FORM */}
          <View style={styles.form}>
            <Text style={styles.label}>DISH NAME:</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g, Grilled Halloumi"
              placeholderTextColor="#9AA0A6"
              style={[styles.input, !name.trim() && styles.inputInvalid]}
            />
            {!name.trim() && <Text style={styles.helper}>Please enter a name</Text>}

            <Text style={styles.label}>Short Description</Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="e.g, Lemon–mint Dressing…"
              placeholderTextColor="#9AA0A6"
              style={[styles.textarea, !desc.trim() && styles.inputInvalid]}
              multiline
            />
            {!desc.trim() && <Text style={styles.helper}>Please enter short description</Text>}

            {/* Course chips */}
            <View style={{ height: spacing.s3 }} />
            <View style={styles.rowChips}>
              <Chip text="STARTER" active={course === 'starter'} onPress={() => setCourse('starter')} />
              <Chip text="MAIN" active={course === 'main'} onPress={() => setCourse('main')} />
              <Chip text="DESSERT" active={course === 'dessert'} onPress={() => setCourse('dessert')} />
            </View>
            {!course && <Text style={styles.helper}>Select a course</Text>}

            {/* Price */}
            <View style={{ height: spacing.s3 }} />
            <Text style={styles.label}>Price (ZAR)</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              keyboardType="number-pad"
              placeholder="e.g, 90"
              placeholderTextColor="#9AA0A6"
              style={[
                styles.input,
                (!Number.isFinite(priceNumber) || priceNumber < 0) && styles.inputInvalid,
              ]}
            />
            {(!Number.isFinite(priceNumber) || priceNumber < 0) && (
              <Text style={styles.helper}>Enter a valid non-negative number</Text>
            )}

            {/* Photo controls */}
            <View style={{ height: spacing.s4 }} />
            <Text style={styles.label}>Dish Photo (optional)</Text>
            <View style={styles.photoRow}>
              <Pressable
                onPress={pickImage}
                style={styles.addPhotoBtn}
                accessibilityRole="button"
                accessibilityLabel="Add photo"
              >
                <Text style={styles.addPhotoText}>{imageUri ? 'Change Photo' : 'Add Photo'}</Text>
              </Pressable>

              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.preview} />
              ) : (
                <View style={[styles.preview, styles.previewPlaceholder]}>
                  <Text style={{ color: colors.textSecondary }}>No image</Text>
                </View>
              )}
            </View>
          </View>

          {/* SAVED DISHES (HORIZONTAL) */}
          <View style={{ paddingHorizontal: spacing.s4, marginTop: spacing.s4 }}>
            <Text style={[type.label, { color: colors.textPrimary, marginBottom: spacing.s2 }]}>
              Saved dishes
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: spacing.s4 }}
            >
              {savedItems.map((it) => {
                // Prefer user photo, else fallback by name
                const src = it.imageUri ? { uri: it.imageUri } : imageForName(it.name);

                return (
                  <View
                    key={it.id}
                    style={{
                      width: 240,
                      marginRight: spacing.s3,
                      backgroundColor: colors.surface,
                      borderRadius: radius.lg,
                      borderWidth: 1,
                      borderColor: colors.outline,
                      overflow: 'hidden',
                    }}
                  >
                    {/* thumbnail */}
                    {src ? (
                      <Image
                        source={src}
                        style={{
                          width: '100%',
                          height: 100,
                          resizeMode: 'cover',
                        }}
                      />
                    ) : (
                      <View style={{ width: '100%', height: 120, backgroundColor: '#E9ECEF' }} />
                    )}

                    {/* text */}
                    <View style={{ padding: spacing.s3 }}>
                      <Text
                        style={{ fontWeight: '800', color: colors.textPrimary }}
                        numberOfLines={2}
                      >
                        {it.name}
                      </Text>
                      <Text style={{ marginTop: 4, color: colors.textSecondary }}>
                        ZAR {it.price}
                      </Text>
                    </View>

                    {/* delete */}
                    <Pressable
                      onPress={() => handleDelete(it.id)} // ← robust delete
                      style={{
                        backgroundColor: '#D32F2F',
                        paddingVertical: 10,
                        alignItems: 'center',
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${it.name}`}
                    >
                      <Text style={{ color: '#fff', fontWeight: '800' }}>Delete</Text>
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Chip({
  text,
  active,
  onPress,
}: {
  text: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && { color: colors.textOnGreen }]}>{text}</Text>
    </Pressable>
  );
}

const BAR_HEIGHT = 130;

const styles = StyleSheet.create({
  bar: {
    height: BAR_HEIGHT,
    backgroundColor: colors.green,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.s4,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  leftRight: { width: 64, height: 44, justifyContent: 'center' },
  center: { flex: 1, alignItems: 'center' },
  barTitle: { ...type.titleLg, color: colors.textOnGreen },
  barAction: { fontWeight: '800', color: colors.textOnGreen, letterSpacing: 0.4 },

  form: { padding: spacing.s4 },
  label: { fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.s1 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.s3,
  },
  textarea: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.s3,
    paddingTop: spacing.s2,
    textAlignVertical: 'top',
  },
  inputInvalid: { borderColor: '#CF3B37' },
  helper: { color: '#CF3B37', marginTop: spacing.s1 },

  rowChips: { flexDirection: 'row', gap: spacing.s3 },

  chip: {
    height: 36,
    minWidth: 92,
    paddingHorizontal: spacing.s3,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  chipInactive: { backgroundColor: colors.surface, borderColor: colors.outline },
  chipActive: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { fontWeight: '800', color: colors.textPrimary },

  photoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.s3 },
  addPhotoBtn: {
    height: 40,
    paddingHorizontal: spacing.s3,
    backgroundColor: colors.green,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: { color: colors.textOnGreen, fontWeight: '800' },

  preview: {
    width: 90,
    height: 90,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.outline,
    backgroundColor: colors.surface,
  },
  previewPlaceholder: { alignItems: 'center', justifyContent: 'center' },
});
