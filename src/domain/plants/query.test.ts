import { buildPerenualQuery, buildTrefleFilters, normalizeQuery } from './query';

describe('plant query builders', () => {
  it('normalizes empty search queries', () => {
    expect(normalizeQuery('  ')).toBeUndefined();
    expect(normalizeQuery('fern')).toBe('fern');
  });

  it('builds trefle filters with supported fields', () => {
    const filters = buildTrefleFilters({
      edible: true,
      poisonous: false,
      sunlight: 'full sun',
      query: 'ignored',
    });

    expect(filters).toEqual({
      edible: true,
      poisonous: false,
      sunlight: 'full sun',
    });
  });

  it('builds perenual query from filters', () => {
    const query = buildPerenualQuery({
      query: ' aloe ',
      cycle: 'perennial',
      edible: false,
      hardiness: 5,
    });

    expect(query).toEqual({
      query: 'aloe',
      cycle: 'perennial',
      edible: false,
      poisonous: undefined,
      sunlight: undefined,
      watering: undefined,
      hardiness: 5,
    });
  });
});
