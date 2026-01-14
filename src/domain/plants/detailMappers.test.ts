import { mapPlantDetailsToDetail } from './detailMappers';

describe('mapPlantDetailsToDetail', () => {
  it('maps details with sections', () => {
    const detail = mapPlantDetailsToDetail(
      {
        id: '1',
        source: 'perenual',
        commonName: 'Rose',
        scientificName: 'Rosa',
        imageUrl: 'image',
        family: 'Rosaceae',
        genus: 'Rosa',
        year: null,
        edible: true,
        poisonous: false,
        cycle: 'perennial',
        watering: 'average',
        sunlight: ['full sun'],
        hardiness: { min: 3, max: 8 },
        description: 'Pretty',
      },
      'perenual',
    );

    expect(detail.images).toHaveLength(1);
    expect(detail.care).toHaveLength(2);
    expect(detail.growth).toHaveLength(4);
  });

  it('handles missing optional data', () => {
    const detail = mapPlantDetailsToDetail(
      {
        id: '2',
        source: 'trefle',
        commonName: null,
        scientificName: 'Abies',
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
      },
      'trefle',
    );

    expect(detail.images).toHaveLength(0);
    expect(detail.care).toHaveLength(0);
    expect(detail.growth).toHaveLength(0);
  });
});
