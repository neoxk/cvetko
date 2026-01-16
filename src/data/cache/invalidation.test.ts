import { MemoryCache } from './index';
import { cacheKeys } from './keys';
import { invalidateAllPlantDetails, invalidatePlantDetail } from './invalidation';

describe('cache invalidation', () => {
  it('invalidates a single plant detail entry', () => {
    const cache = new MemoryCache(() => 1000);
    cache.set(cacheKeys.plantDetail('1'), { id: '1' }, 1000);

    invalidatePlantDetail(cache, '1');

    expect(cache.get(cacheKeys.plantDetail('1'))).toBeNull();
  });

  it('clears cached plant details', () => {
    const cache = new MemoryCache(() => 1000);
    cache.set(cacheKeys.plantDetail('1'), { id: '1' }, 1000);
    cache.set(cacheKeys.plantDetail('2'), { id: '2' }, 1000);

    invalidateAllPlantDetails(cache);

    expect(cache.get(cacheKeys.plantDetail('1'))).toBeNull();
    expect(cache.get(cacheKeys.plantDetail('2'))).toBeNull();
  });
});
