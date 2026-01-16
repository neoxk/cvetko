export const cacheTtlMs = {
  plantList: 5 * 60 * 1000,
  plantSearch: 2 * 60 * 1000,
  plantDetails: 10 * 60 * 1000,
  careGuides: 24 * 60 * 60 * 1000,
  pests: 24 * 60 * 60 * 1000,
};

export const cacheKeys = {
  perenualPlantList: (page: number) => `perenual:plants:list:${page}`,
  perenualSearch: (query: string, page: number) => `perenual:plants:search:${query}:${page}`,
  perenualDetails: (id: string) => `perenual:plants:detail:${id}`,
  plantDetail: (id: string) => `plants:detail:${id}`,
  perenualCareGuides: (page: number) => `perenual:care-guides:${page}`,
  perenualPests: (page: number) => `perenual:pests:${page}`,
};
