import type { MenuItem } from '../components/StatsCard';

export type MenuItemWithImage = MenuItem & {
  imageUri?: string; // optional local photo picked on AddItem
};
