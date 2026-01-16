import type { GardenFormValues } from './types';

export type GardenFormErrors = Partial<Record<keyof GardenFormValues, string>>;

const isValidDate = (value: string): boolean => !Number.isNaN(Date.parse(value));

export const validateGardenForm = (values: GardenFormValues): GardenFormErrors => {
  const errors: GardenFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Plant name is required.';
  }

  if (!values.plantedAt.trim()) {
    errors.plantedAt = 'Planting date is required.';
  } else if (!isValidDate(values.plantedAt)) {
    errors.plantedAt = 'Enter a valid date.';
  }

  return errors;
};
