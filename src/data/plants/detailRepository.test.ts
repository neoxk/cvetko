import { createApiError } from '@data/errors';
import { MemoryCache } from '@data/cache';
import { createPlantDetailRepository } from './detailRepository';

const trefleClient = {
  getPlantDetails: jest.fn(),
};

const perenualClient = {
  getPlantDetails: jest.fn(),
};

describe('plant detail repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns cached detail when available', async () => {
    const cache = new MemoryCache(() => 1000);
    cache.set(
      'plants:detail:perenual:1',
      {
        id: '1',
        source: 'perenual',
        commonName: 'Rose',
        scientificName: 'Rosa',
        family: null,
        genus: null,
        description: null,
        images: [],
        care: [],
        growth: [],
        pests: [],
      },
      1000,
    );

    const repo = createPlantDetailRepository({
      trefleClient: trefleClient as never,
      perenualClient: perenualClient as never,
      cache,
    });

    const result = await repo.getPlantDetail({ id: '1', source: 'perenual' });

    expect(result.scientificName).toBe('Rosa');
    expect(perenualClient.getPlantDetails).not.toHaveBeenCalled();
  });

  it('maps and caches fetched detail', async () => {
    const cache = new MemoryCache(() => 1000);
    perenualClient.getPlantDetails.mockResolvedValue({
      id: '1',
      source: 'perenual',
      commonName: 'Rose',
      scientificName: 'Rosa',
      imageUrl: null,
      family: null,
      genus: null,
      year: null,
      edible: null,
      poisonous: null,
      cycle: null,
      watering: null,
      sunlight: null,
      hardiness: null,
      description: null,
    });

    const repo = createPlantDetailRepository({
      trefleClient: trefleClient as never,
      perenualClient: perenualClient as never,
      cache,
    });

    const result = await repo.getPlantDetail({ id: '1', source: 'perenual' });

    expect(result.scientificName).toBe('Rosa');
    expect(cache.get('plants:detail:perenual:1')).not.toBeNull();
  });

  it('passes through api errors', async () => {
    const apiError = createApiError('Failed', {
      kind: 'http',
      service: 'trefle',
      retryable: false,
      status: 400,
    });
    trefleClient.getPlantDetails.mockRejectedValue(apiError);
    const cache = new MemoryCache(() => 1000);

    const repo = createPlantDetailRepository({
      trefleClient: trefleClient as never,
      perenualClient: perenualClient as never,
      cache,
    });

    await expect(repo.getPlantDetail({ id: '1', source: 'trefle' })).rejects.toBe(apiError);
  });
});
