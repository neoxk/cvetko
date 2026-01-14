export const cacheTtlMs = {
  plantList: 5 * 60 * 1000,
  plantSearch: 2 * 60 * 1000,
  plantDetails: 10 * 60 * 1000,
  careGuides: 24 * 60 * 60 * 1000,
  pests: 24 * 60 * 60 * 1000,
};

export const cacheKeys = {
  treflePlantList: (page: number) => `trefle:plants:list:${page}`,
  trefleSearch: (query: string, page: number) => `trefle:plants:search:${query}:${page}`,
  trefleDetails: (id: string) => `trefle:plants:detail:${id}`,
  perenualPlantList: (page: number) => `perenual:plants:list:${page}`,
  perenualSearch: (query: string, page: number) => `perenual:plants:search:${query}:${page}`,
  perenualDetails: (id: string) => `perenual:plants:detail:${id}`,
  plantDetail: (source: string, id: string) => `plants:detail:${source}:${id}`,
  perenualCareGuides: (page: number) => `perenual:care-guides:${page}`,
  perenualPests: (page: number) => `perenual:pests:${page}`,
};
