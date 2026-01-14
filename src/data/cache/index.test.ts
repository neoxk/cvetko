import { MemoryCache } from './index';

describe('MemoryCache', () => {
  it('returns cached value before expiry', () => {
    let now = 1000;
    const cache = new MemoryCache(() => now);

    cache.set('key', 'value', 500);
    expect(cache.get('key')).toBe('value');

    now = 1200;
    expect(cache.get('key')).toBe('value');
  });

  it('expires values after ttl', () => {
    let now = 1000;
    const cache = new MemoryCache(() => now);

    cache.set('key', 'value', 300);
    now = 1400;
    expect(cache.get('key')).toBeNull();
  });

  it('clears values', () => {
    const cache = new MemoryCache(() => 1000);

    cache.set('key', 'value', 1000);
    cache.clear();

    expect(cache.get('key')).toBeNull();
  });
});
