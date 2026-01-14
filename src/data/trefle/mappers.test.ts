import { mapTrefleDetails, mapTrefleListResponse, mapTrefleSummary } from './mappers';

describe('trefle mappers', () => {
  it('maps summary with fallbacks', () => {
    const summary = mapTrefleSummary({
      id: 12,
      slug: 'ficus-elastica',
      common_name: null,
      scientific_name: '',
      image_url: null,
    });

    expect(summary).toEqual({
      id: '12',
      source: 'trefle',
      commonName: null,
      scientificName: 'ficus-elastica',
      imageUrl: null,
    });
  });

  it('maps details with hardiness and family fallback', () => {
    const details = mapTrefleDetails({
      id: 9,
      slug: 'lavandula',
      common_name: 'Lavender',
      scientific_name: 'Lavandula',
      image_url: null,
      family_common_name: 'Mint family',
      genus: 'Lavandula',
      year: 1753,
      edible: false,
      poisonous: null,
      sunlight: ['full sun'],
      hardiness: { min: 5, max: 9 },
      description: 'Fragrant plant',
    });

    expect(details.family).toBe('Mint family');
    expect(details.hardiness).toEqual({ min: 5, max: 9 });
    expect(details.description).toBe('Fragrant plant');
  });

  it('maps list response pagination', () => {
    const response = mapTrefleListResponse(
      {
        data: [
          {
            id: 1,
            slug: 'rose',
            common_name: 'Rose',
            scientific_name: 'Rosa',
            image_url: null,
          },
        ],
        meta: { total: 10, total_pages: 2 },
      },
      1,
    );

    expect(response.total).toBe(10);
    expect(response.totalPages).toBe(2);
    expect(response.data).toHaveLength(1);
  });
});
