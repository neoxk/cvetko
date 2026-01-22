import type { PlantDetail } from '@domain/plants/detailTypes';
import type { PlantListItem } from '@domain/plants/types';
import type { WishlistItem } from '@domain/wishlist/types';

const nowIso = (): string => new Date().toISOString();

export const wishlistItemFromDetail = (detail: PlantDetail): WishlistItem => ({
  id: detail.id,
  source: 'app',
  name: detail.commonName ?? detail.scientificName,
  scientificName: detail.scientificName,
  imageUrl: detail.images[0]?.url ?? null,
  addedAt: nowIso(),
});

export const wishlistItemFromList = (item: PlantListItem): WishlistItem => ({
  id: item.id,
  source: 'app',
  name: item.commonName ?? item.scientificName,
  scientificName: item.scientificName,
  imageUrl: item.imageUrl ?? null,
  addedAt: nowIso(),
});
