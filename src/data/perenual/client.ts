import { createHttpClient } from '@data/http/client';
import { withRetry } from '@data/http/retry';
import { createAppError } from '@utils/errors';
import type { PaginatedResponse, PlantDetails, PlantSummary } from '@data/types';
import {
  mapPerenualDetails,
  mapPerenualListResponse,
  type PerenualDetailResponse,
  type PerenualDetail,
  type PerenualListResponse,
} from './mappers';

export type PerenualClientOptions = {
  apiKey: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetcher?: typeof fetch;
};

export type PerenualListParams = {
  page?: number;
  query?: string;
  order?: 'asc' | 'desc';
  edible?: boolean;
  poisonous?: boolean;
  cycle?: string;
  sunlight?: string;
  watering?: string;
  indoor?: boolean;
  hardiness?: number;
};

const defaultBaseUrl = 'https://perenual.com/api/v2';

export const createPerenualClient = (options: PerenualClientOptions) => {
  const client = createHttpClient({
    baseUrl: options.baseUrl ?? defaultBaseUrl,
    serviceName: 'perenual',
    defaultQuery: { key: options.apiKey },
    ...(options.timeoutMs !== undefined ? { timeoutMs: options.timeoutMs } : {}),
    ...(options.fetcher ? { fetcher: options.fetcher } : {}),
  });

  return {
    listPlants: async (
      params: PerenualListParams = {},
    ): Promise<PaginatedResponse<PlantSummary>> => {
      const page = params.page ?? 1;
      const response = await withRetry(() =>
        client.get<PerenualListResponse>('/species-list', {
          query: {
            page,
            q: params.query,
            order: params.order,
          edible: params.edible,
          poisonous: params.poisonous,
          cycle: params.cycle,
          sunlight: params.sunlight,
          watering: params.watering,
          indoor: params.indoor,
          hardiness: params.hardiness,
        },
      }),
    );
      return mapPerenualListResponse(response.data, page);
    },
    getPlantDetails: async (id: string | number): Promise<PlantDetails> => {
      const response = await withRetry(() =>
        client.get<PerenualDetailResponse | PerenualDetail>(`/species/details/${id}`),
      );
      const payload =
        (response.data as PerenualDetailResponse).data ?? (response.data as PerenualDetail);
      if (!payload) {
        throw createAppError('ApiError', 'Perenual returned empty detail payload', {
          details: { id },
        });
      }
      return mapPerenualDetails(payload);
    },
  };
};
