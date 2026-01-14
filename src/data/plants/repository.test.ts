import { createApiError } from '@data/errors';
import { createPlantRepository } from './repository';

const trefleClient = {
  listPlants: jest.fn(),
  searchPlants: jest.fn(),
};

const perenualClient = {
  listPlants: jest.fn(),
};

describe('plant repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps trefle pagination and summaries', async () => {
    trefleClient.listPlants.mockResolvedValue({
      data: [
        {
          id: '1',
          source: 'trefle',
          commonName: 'Rose',
          scientificName: 'Rosa',
          imageUrl: null,
        },
      ],
      page: 1,
      total: 10,
      totalPages: 2,
    });

    const repo = createPlantRepository({
      trefleClient: trefleClient as never,
      perenualClient: perenualClient as never,
    });

    const result = await repo.listPlants({ source: 'trefle', page: 1 });

    expect(result.totalPages).toBe(2);
    expect(result.data[0]?.scientificName).toBe('Rosa');
  });

  it('uses trefle search endpoint when query provided', async () => {
    trefleClient.searchPlants.mockResolvedValue({
      data: [],
      page: 1,
      total: 0,
      totalPages: 0,
    });

    const repo = createPlantRepository({
      trefleClient: trefleClient as never,
      perenualClient: perenualClient as never,
    });

    await repo.listPlants({ source: 'trefle', filters: { query: 'aloe' } });

    expect(trefleClient.searchPlants).toHaveBeenCalledWith({ query: 'aloe', page: 1 });
  });

  it('wraps unknown errors', async () => {
    perenualClient.listPlants.mockRejectedValue(new Error('oops'));

    const repo = createPlantRepository({
      trefleClient: trefleClient as never,
      perenualClient: perenualClient as never,
    });

    await expect(repo.listPlants({ source: 'perenual' })).rejects.toMatchObject({
      name: 'ApiError',
    });
  });

  it('passes through api errors', async () => {
    const apiError = createApiError('Failed', {
      kind: 'http',
      service: 'perenual',
      retryable: false,
      status: 400,
    });
    perenualClient.listPlants.mockRejectedValue(apiError);

    const repo = createPlantRepository({
      trefleClient: trefleClient as never,
      perenualClient: perenualClient as never,
    });

    await expect(repo.listPlants({ source: 'perenual' })).rejects.toBe(apiError);
  });
});
