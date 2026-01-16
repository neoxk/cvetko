import { validateGardenForm } from './validation';

describe('validateGardenForm', () => {
  it('returns errors for required fields', () => {
    const errors = validateGardenForm({
      name: '',
      scientificName: '',
      location: '',
      plantedAt: '',
      notes: '',
    });

    expect(errors.name).toBe('Plant name is required.');
    expect(errors.plantedAt).toBe('Planting date is required.');
  });

  it('accepts valid values', () => {
    const errors = validateGardenForm({
      name: 'Rose',
      scientificName: 'Rosa',
      location: 'Balcony',
      plantedAt: '2024-01-01',
      notes: '',
    });

    expect(Object.keys(errors)).toHaveLength(0);
  });
});
