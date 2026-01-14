import { MemoryCache } from './index';
import { cacheKeys } from './keys';
import { invalidateAllPlantDetails, invalidatePlantDetail } from './invalidation';

describe('cache invalidation', () => {
  it('invalidates a single plant detail entry', () => {
    const cache = new MemoryCache(() => 1000);
    cache.set(cacheKeys.plantDetail('perenual', '1'), { id: '1' }, 1000);

    invalidatePlantDetail(cache, 'perenual', '1');

    expect(cache.get(cacheKeys.plantDetail('perenual', '1'))).toBeNull();
  });

  it('clears cached plant details', () => {
    const cache = new MemoryCache(() => 1000);
    cache.set(cacheKeys.plantDetail('perenual', '1'), { id: '1' }, 1000);
    cache.set(cacheKeys.plantDetail('trefle', '2'), { id: '2' }, 1000);

    invalidateAllPlantDetails(cache);

    expect(cache.get(cacheKeys.plantDetail('perenual', '1'))).toBeNull();
    expect(cache.get(cacheKeys.plantDetail('trefle', '2'))).toBeNull();
  });
});
