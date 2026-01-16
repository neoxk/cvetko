import { createApiError } from '@data/errors';
import { createPlantRepository } from './repository';

const perenualClient = {
  listPlants: jest.fn(),
};

describe('plant repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('maps perenual pagination and summaries', async () => {
    perenualClient.listPlants.mockResolvedValue({
      data: [
        {
          id: '1',
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
      perenualClient: perenualClient as never,
    });

    const result = await repo.listPlants({ page: 1 });

    expect(result.totalPages).toBe(2);
    expect(result.data[0]?.scientificName).toBe('Rosa');
  });

  it('wraps unknown errors', async () => {
    perenualClient.listPlants.mockRejectedValue(new Error('oops'));

    const repo = createPlantRepository({
      perenualClient: perenualClient as never,
    });

    await expect(repo.listPlants({})).rejects.toMatchObject({
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
      perenualClient: perenualClient as never,
    });

    await expect(repo.listPlants({})).rejects.toBe(apiError);
  });
});
