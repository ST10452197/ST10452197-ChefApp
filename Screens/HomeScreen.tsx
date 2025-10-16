import React, { useMemo, useState } from 'react';
import { FlatList, View, ImageSourcePropType } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import TopBar from '../components/TopBar';
import StatsCard from '../components/StatsCard';
import FilterChips, { CourseFilter } from '../components/FilterChips';
import MenuCard from '../components/MenuCard';
import Fab from '../components/Fab';
import { colors, spacing } from '../theme';
import type { MenuItemWithImage } from './types';

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState<MenuItemWithImage[]>([
    { id: '1', name: 'Grilled Halloumi, lemon–mint dressing', description: 'Charred Cypriot halloumi with lemon–mint dressing and a whisper of chilli.', course: 'starter', price: 90 },
    { id: '2', name: 'Peri-Peri Prawns, garlic butter, lemon', description: 'Pan-seared prawns in garlic butter, finished with bright lemon and peri-peri heat.', course: 'starter', price: 115 },
    { id: '3', name: 'Ribeye 300g, mushroom jus, charred onion', description: 'Flame-grilled ribeye, rich mushroom jus and charred onion petals.', course: 'main', price: 220 },
    { id: '4', name: 'Herb-Crusted Kingklip, lemon caper butter', description: 'Oven-baked fillet with parsley crust and lemon–caper butter.', course: 'main', price: 205 },
    { id: '5', name: 'Dark Chocolate Fondant, vanilla ice cream', description: 'Molten-centred fondant, vanilla ice cream and cocoa dust.', course: 'dessert', price: 95 },
    { id: '6', name: 'Roasted Beet Carpaccio, feta, pistachio', description: 'Butternut & Coconut Soup, toasted seeds.', course: 'starter', price: 220 },
    { id: '7', name: 'Peri-Peri Half Chicken,pap & chakalaka', description: 'Fire-roasted and brushed with house peri peri;served with papa & chakalaka', course: 'main', price: 165 },
    { id: '8', name: 'Malva Pudding, warm custard', description: 'classic SA sponge soaked in caramel sauce with warm custard ', course: 'dessert', price: 85 },
    { id: '9', name: 'Amarula Baked Cheesecake caramel crumb', description: 'Creamy Amarula cheesecake with salted caramel crumb', course: 'dessert', price: 90 },
  ]);

  const [filter, setFilter] = useState<CourseFilter>('all');

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(i => i.course === filter);
  }, [items, filter]);

  //images im using for the menu items
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

  const goToAddItem = () => {
    nav.navigate('AddItem', {
      items, 
      onAdd: (newItem: MenuItemWithImage) => {
        setItems(prev => [newItem, ...prev]);
      },
      onDelete: (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <TopBar
        logoSource={require('../assets/chefdininglogo.png')}
        onMenuPress={() => {}}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => {
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

      

      <Fab bottomInset={insets.bottom} onPress={goToAddItem} />
    </SafeAreaView>
  );
}
