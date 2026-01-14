import { normalizeApiError } from '@data/errors';
import type { PaginatedResponse, PlantSummary } from '@data/types';
import type { PlantListFilters, PlantListItem, PlantSource } from '@domain/plants/types';
import { buildPerenualQuery, buildTrefleFilters, normalizeQuery } from '@domain/plants/query';
import type { createPerenualClient } from '@data/perenual/client';
import type { createTrefleClient } from '@data/trefle/client';

type TrefleClient = ReturnType<typeof createTrefleClient>;
type PerenualClient = ReturnType<typeof createPerenualClient>;

export type PlantRepositoryParams = {
  source: PlantSource;
  page?: number;
  filters?: PlantListFilters;
};

export type PlantRepository = {
  listPlants: (params: PlantRepositoryParams) => Promise<PaginatedResponse<PlantListItem>>;
};

export type PlantRepositoryOptions = {
  trefleClient: TrefleClient;
  perenualClient: PerenualClient;
};

const mapSummaryToListItem = (summary: PlantSummary): PlantListItem => ({
  id: summary.id,
  source: summary.source,
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
  listPlants: async ({ source, page = 1, filters = {} }: PlantRepositoryParams) => {
    try {
      if (source === 'trefle') {
        const query = normalizeQuery(filters.query);
        const response = query
          ? await options.trefleClient.searchPlants({ query, page })
          : await options.trefleClient.listPlants({
              page,
              filters: buildTrefleFilters(filters),
            });
        return mapPaginatedResponse(response);
      }

      const response = await options.perenualClient.listPlants({
        page,
        ...buildPerenualQuery(filters),
      });
      return mapPaginatedResponse(response);
    } catch (error) {
      throw normalizeApiError(error, {
        service: source,
        message: 'Failed to load plant list',
        kind: 'unknown',
        retryable: false,
        context: { page, source },
      });
    }
  },
});
