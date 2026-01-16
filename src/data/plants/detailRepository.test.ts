import { createApiError } from '@data/errors';
import { MemoryCache } from '@data/cache';
import { createPlantDetailRepository } from './detailRepository';

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
      'plants:detail:1',
      {
        id: '1',
        commonName: 'Rose',
        scientificName: 'Rosa',
        family: null,
        genus: null,
        description: null,
        images: [],
        overview: [],
        care: [],
        growth: [],
        seasonal: [],
        safety: [],
        tolerance: [],
        ecology: [],
        anatomy: [],
        pests: [],
      },
      1000,
    );

    const repo = createPlantDetailRepository({
      perenualClient: perenualClient as never,
      cache,
    });

    const result = await repo.getPlantDetail({ id: '1' });

    expect(result.scientificName).toBe('Rosa');
    expect(perenualClient.getPlantDetails).not.toHaveBeenCalled();
  });

  it('maps and caches fetched detail', async () => {
    const cache = new MemoryCache(() => 1000);
    perenualClient.getPlantDetails.mockResolvedValue({
      id: '1',
      commonName: 'Rose',
      scientificName: 'Rosa',
      imageUrl: null,
      scientificNames: null,
      otherNames: null,
      family: null,
      genus: null,
      origin: null,
      type: null,
      dimensions: null,
      year: null,
      edible: null,
      poisonous: null,
      cycle: null,
      watering: null,
      wateringGeneralBenchmark: null,
      sunlight: null,
      pruningMonth: null,
      pruningCount: null,
      seeds: null,
      attracts: null,
      propagation: null,
      hardiness: null,
      flowers: null,
      floweringSeason: null,
      soil: null,
      pestSusceptibility: null,
      cones: null,
      fruits: null,
      edibleFruit: null,
      fruitingSeason: null,
      harvestSeason: null,
      harvestMethod: null,
      leaf: null,
      edibleLeaf: null,
      growthRate: null,
      maintenance: null,
      medicinal: null,
      poisonousToHumans: null,
      poisonousToPets: null,
      droughtTolerant: null,
      saltTolerant: null,
      thorny: null,
      invasive: null,
      rare: null,
      tropical: null,
      cuisine: null,
      indoor: null,
      careLevel: null,
      plantAnatomy: null,
      description: null,
    });

    const repo = createPlantDetailRepository({
      perenualClient: perenualClient as never,
      cache,
    });

    const result = await repo.getPlantDetail({ id: '1' });

    expect(result.scientificName).toBe('Rosa');
    expect(cache.get('plants:detail:1')).not.toBeNull();
  });

  it('passes through api errors', async () => {
    const apiError = createApiError('Failed', {
      kind: 'http',
      service: 'perenual',
      retryable: false,
      status: 400,
    });
    perenualClient.getPlantDetails.mockRejectedValue(apiError);
    const cache = new MemoryCache(() => 1000);

    const repo = createPlantDetailRepository({
      perenualClient: perenualClient as never,
      cache,
    });

    await expect(repo.getPlantDetail({ id: '1' })).rejects.toBe(apiError);
  });
});
