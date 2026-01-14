import type { PlantDetails } from '@data/types';
import type { PlantDetail, PlantDetailImage, PlantDetailSource } from './detailTypes';

export const mapPlantDetailsToDetail = (
  details: PlantDetails,
  source: PlantDetailSource,
): PlantDetail => {
  const images: PlantDetailImage[] = details.imageUrl
    ? [{ url: details.imageUrl, alt: details.commonName ?? details.scientificName }]
    : [];

  const care = [
    details.watering ? { label: 'Watering', value: details.watering } : null,
    details.sunlight && details.sunlight.length > 0
      ? { label: 'Sunlight', value: details.sunlight.join(', ') }
      : null,
  ].filter(Boolean) as PlantDetail['care'];

  const growth = [
    details.cycle ? { label: 'Life cycle', value: details.cycle } : null,
    details.hardiness
      ? {
          label: 'Hardiness',
          value: `${details.hardiness.min ?? '?'} - ${details.hardiness.max ?? '?'}`,
        }
      : null,
    details.edible !== null
      ? { label: 'Edible', value: details.edible ? 'Yes' : 'No' }
      : null,
    details.poisonous !== null
      ? { label: 'Poisonous', value: details.poisonous ? 'Yes' : 'No' }
      : null,
  ].filter(Boolean) as PlantDetail['growth'];

  return {
    id: details.id,
    source,
    commonName: details.commonName,
    scientificName: details.scientificName,
    family: details.family,
    genus: details.genus,
    description: details.description,
    images,
    care,
    growth,
    pests: [],
  };
};
