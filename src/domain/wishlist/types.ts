import type { PlantSource } from '@domain/plants/types';

export type WishlistItem = {
  id: string;
  source: PlantSource;
  name: string;
  scientificName: string;
  imageUrl: string | null;
  addedAt: string;
};
