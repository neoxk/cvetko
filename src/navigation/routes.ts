import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PlantSource } from '@domain/plants/types';

export const Routes = {
  RootTabs: 'RootTabs',
  PlantDetail: 'PlantDetail',
  GardenForm: 'GardenForm',
  Browse: 'Browse',
  Calendar: 'Calendar',
  Garden: 'Garden',
  Wishlist: 'Wishlist',
  Settings: 'Settings',
} as const;

export type RootTabParamList = {
  Browse: undefined;
  Calendar: undefined;
  Garden: undefined;
  Wishlist: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  RootTabs: NavigatorScreenParams<RootTabParamList>;
  PlantDetail: { id: string; source: PlantSource };
  GardenForm: { id?: string };
};
