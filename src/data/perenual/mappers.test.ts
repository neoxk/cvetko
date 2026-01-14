import { mapPerenualDetails, mapPerenualListResponse, mapPerenualSummary } from './mappers';

describe('perenual mappers', () => {
  it('maps summary with image and scientific name array', () => {
    const summary = mapPerenualSummary({
      id: 44,
      common_name: 'Snake plant',
      scientific_name: ['Dracaena trifasciata'],
      default_image: {
        thumbnail: 'thumb',
        medium: 'medium',
      },
    });

    expect(summary).toEqual({
      id: '44',
      source: 'perenual',
      commonName: 'Snake plant',
      scientificName: 'Dracaena trifasciata',
      imageUrl: 'medium',
    });
  });

  it('maps details with edible and poisonous flags', () => {
    const details = mapPerenualDetails({
      id: 77,
      common_name: 'Test plant',
      scientific_name: 'Testus plantus',
      family: 'Testaceae',
      genus: 'Testus',
      cycle: 'perennial',
      watering: 'average',
      sunlight: ['full sun'],
      edible_fruit: true,
      edible_leaf: null,
      poisonous_to_humans: null,
      poisonous_to_pets: false,
      description: 'Example',
      default_image: null,
    });

    expect(details.edible).toBe(true);
    expect(details.poisonous).toBe(false);
    expect(details.family).toBe('Testaceae');
  });

  it('maps list response pagination', () => {
    const response = mapPerenualListResponse(
      {
        data: [
          {
            id: 5,
            common_name: 'Aloe',
            scientific_name: 'Aloe vera',
          },
        ],
        meta: { total: 40, last_page: 4 },
      },
      2,
    );

    expect(response.page).toBe(2);
    expect(response.totalPages).toBe(4);
    expect(response.data).toHaveLength(1);
  });
});
