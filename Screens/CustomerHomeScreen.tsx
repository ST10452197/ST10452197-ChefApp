import React, { useMemo, useState } from 'react';
import { FlatList, View, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import FilterChips, { CourseFilter } from '../components/FilterChips';
import MenuCard from '../components/MenuCard';
import MenuSheet from '../components/MenuSheet';
import { colors, spacing } from '../theme';
import type { MenuItemWithImage } from './types';

export default function CustomerHomeScreen() {
  const nav = useNavigation<any>();
  const route = useRoute<any>();

  // This is where the items arrive from the homescreen
  const initial: MenuItemWithImage[] = Array.isArray(route.params?.items)
    ? route.params.items
    : [];
  const [items] = useState<MenuItemWithImage[]>(initial); // this is the read-only
  const [filter, setFilter] = useState<CourseFilter>('all');
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(i => i.course === filter);
  }, [items, filter]);

  //images
  const imageFor = (name: string): ImageSourcePropType | undefined => {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar
        title="Tonight's Menu"
        logoSource={require('../assets/chefdininglogo.png')}
        onMenuPress={() => setMenuOpen(true)}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => {
          // 1) Prefer captured photo; 2) Local fallback by name
          const src: ImageSourcePropType | undefined =
            item.imageUri ? { uri: item.imageUri } : imageFor(item.name);
          return <MenuCard item={item} imageSource={src} />;
        }}
        contentContainerStyle={{ paddingBottom: spacing.s6 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <StatsCard items={items} />
            <FilterChips value={filter} onChange={setFilter} />
          </View>
        }
      />

      {/* simple dropdown for switching back */}
      <MenuSheet
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        actions={[
          {
            label: 'Switch to Chef view',
            onPress: () => nav.navigate('Home'),
          },
        ]}
      />
    </SafeAreaView>
  );
}
