import { normalizeApiError } from '@data/errors';
import type { PaginatedResponse, PlantSummary } from '@data/types';
import type { PlantListFilters, PlantListItem } from '@domain/plants/types';
import { buildPerenualQuery } from '@domain/plants/query';
import type { createPerenualClient } from '@data/perenual/client';
type PerenualClient = ReturnType<typeof createPerenualClient>;

export type PlantRepositoryParams = {
  page?: number;
  filters?: PlantListFilters;
};

export type PlantRepository = {
  listPlants: (params: PlantRepositoryParams) => Promise<PaginatedResponse<PlantListItem>>;
};

export type PlantRepositoryOptions = {
  perenualClient: PerenualClient;
};

const mapSummaryToListItem = (summary: PlantSummary): PlantListItem => ({
  id: summary.id,
  commonName: summary.commonName,
  scientificName: summary.scientificName,
  imageUrl: summary.imageUrl,
});

const mapPaginatedResponse = (
  response: PaginatedResponse<PlantSummary>,
): PaginatedResponse<PlantListItem> => ({
  data: response.data.map(mapSummaryToListItem),
  page: response.page,
  total: response.total,
  totalPages: response.totalPages,
});

export const createPlantRepository = (options: PlantRepositoryOptions): PlantRepository => ({
  listPlants: async ({ page = 1, filters = {} }: PlantRepositoryParams) => {
    try {
      const response = await options.perenualClient.listPlants({
        page,
        ...buildPerenualQuery(filters),
      });
      return mapPaginatedResponse(response);
    } catch (error) {
      throw normalizeApiError(error, {
        service: 'perenual',
        message: 'Failed to load plant list',
        kind: 'unknown',
        retryable: false,
        context: { page },
      });
    }
  },
});
