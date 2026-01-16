import type { NavigatorScreenParams } from '@react-navigation/native';

export const Routes = {
  RootTabs: 'RootTabs',
  PlantDetail: 'PlantDetail',
  GardenDetail: 'GardenDetail',
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
  PlantDetail: { id: string };
  GardenDetail: { id: string };
  GardenForm: {
    id?: string;
    plant?: {
      id: string;
      name: string;
      scientificName: string;
      imageUrl: string | null;
      watering: string | null;
      sunlight: string | null;
      cycle: string | null;
      hardinessMin: number | null;
      hardinessMax: number | null;
      description: string | null;
    };
  };
};
