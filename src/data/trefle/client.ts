import { createHttpClient } from '@data/http/client';
import { withRetry } from '@data/http/retry';
import type { PaginatedResponse, PlantDetails, PlantSummary, RequestQuery } from '@data/types';
import {
  mapTrefleDetails,
  mapTrefleListResponse,
  type TrefleDetailResponse,
  type TrefleListResponse,
} from './mappers';

export type TrefleClientOptions = {
  token: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetcher?: typeof fetch;
};

export type TrefleListParams = {
  page?: number;
  filters?: Record<string, string | number | boolean>;
};

export type TrefleSearchParams = {
  query: string;
  page?: number;
};

const defaultBaseUrl = 'https://trefle.io/api/v1';

const buildFilterQuery = (filters?: Record<string, string | number | boolean>): RequestQuery => {
  if (!filters) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [`filter[${key}]`, value]),
  );
};

export const createTrefleClient = (options: TrefleClientOptions) => {
  const client = createHttpClient({
    baseUrl: options.baseUrl ?? defaultBaseUrl,
    serviceName: 'trefle',
    defaultQuery: { token: options.token },
    ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),
    ...(options.fetcher ? { fetcher: options.fetcher } : {}),
  });

  return {
    listPlants: async (params: TrefleListParams = {}): Promise<PaginatedResponse<PlantSummary>> => {
      const page = params.page ?? 1;
      const response = await withRetry(() =>
        client.get<TrefleListResponse>('/plants', {
          query: {
            page,
            ...buildFilterQuery(params.filters),
          },
        }),
      );
      return mapTrefleListResponse(response.data, page);
    },
    searchPlants: async (params: TrefleSearchParams): Promise<PaginatedResponse<PlantSummary>> => {
      const page = params.page ?? 1;
      const response = await withRetry(() =>
        client.get<TrefleListResponse>('/plants/search', {
          query: {
            q: params.query,
            page,
          },
        }),
      );
      return mapTrefleListResponse(response.data, page);
    },
    getPlantDetails: async (id: string): Promise<PlantDetails> => {
      const response = await withRetry(() => client.get<TrefleDetailResponse>(`/plants/${id}`));
      return mapTrefleDetails(response.data.data);
    },
  };
};
