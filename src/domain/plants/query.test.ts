import { buildPerenualQuery, normalizeQuery } from './query';

describe('plant query builders', () => {
  it('normalizes empty search queries', () => {
    expect(normalizeQuery('  ')).toBeUndefined();
    expect(normalizeQuery('fern')).toBe('fern');
  });

  it('builds perenual query from filters', () => {
    const query = buildPerenualQuery({
      query: ' aloe ',
      cycle: 'perennial',
      edible: false,
      hardiness: 5,
      indoor: true,
    });

    expect(query).toEqual({
      query: 'aloe',
      cycle: 'perennial',
      edible: false,
      poisonous: undefined,
      sunlight: undefined,
      watering: undefined,
      indoor: true,
      hardiness: 5,
    });
  });
});
