import type { PlantDetails } from '@data/types';
import type { PlantDetail, PlantDetailImage } from './detailTypes';

const formatBoolean = (value: boolean | null | undefined): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  return value ? 'Yes' : 'No';
};

const formatList = (values: string[] | null | undefined): string | null => {
  if (!values || values.length === 0) {
    return null;
  }
  return values.join(', ');
};

const formatRange = (min: number | null, max: number | null): string | null => {
  if (min === null && max === null) {
    return null;
  }
  if (min !== null && max !== null) {
    return min === max ? String(min) : `${min} - ${max}`;
  }
  return min !== null ? `${min}+` : `Up to ${max ?? ''}`.trim();
};

const formatDimensions = (
  dimensions: PlantDetails['dimensions'],
): string | null => {
  if (!dimensions) {
    return null;
  }
  const range = formatRange(dimensions.min, dimensions.max);
  if (!range && !dimensions.unit) {
    return null;
  }
  const unit = dimensions.unit ? ` ${dimensions.unit}` : '';
  const type = dimensions.type ? `${dimensions.type}: ` : '';
  return `${type}${range ?? ''}${unit}`.trim();
};

const formatBenchmark = (
  benchmark: PlantDetails['wateringGeneralBenchmark'],
): string | null => {
  if (!benchmark || !benchmark.value) {
    return null;
  }
  return benchmark.unit ? `${benchmark.value} ${benchmark.unit}` : benchmark.value;
};

const formatPruningCount = (
  pruning: PlantDetails['pruningCount'],
): string | null => {
  if (!pruning) {
    return null;
  }
  const amount = pruning.amount ?? null;
  const interval = pruning.interval ?? null;
  if (amount === null && !interval) {
    return null;
  }
  return [amount !== null ? String(amount) : null, interval]
    .filter(Boolean)
    .join(' ');
};

const toTitleCase = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const buildSection = (items: Array<{ label: string; value: string | null }>): PlantDetail['care'] =>
  items.filter((item) => item.value) as PlantDetail['care'];

export const mapPlantDetailsToDetail = (details: PlantDetails): PlantDetail => {
  const images: PlantDetailImage[] = details.imageUrl
    ? [{ url: details.imageUrl, alt: details.commonName ?? details.scientificName }]
    : [];

  const overview = buildSection([
    details.commonName ? { label: 'Common name', value: details.commonName } : null,
    details.scientificNames && details.scientificNames.length > 0
      ? { label: 'Scientific names', value: details.scientificNames.join(', ') }
      : null,
    details.otherNames && details.otherNames.length > 0
      ? { label: 'Other names', value: details.otherNames.join(', ') }
      : null,
    details.family ? { label: 'Family', value: details.family } : null,
    details.genus ? { label: 'Genus', value: details.genus } : null,
    details.origin ? { label: 'Origin', value: formatList(details.origin) } : null,
    details.type ? { label: 'Type', value: details.type } : null,
  ].filter(Boolean) as PlantDetail['overview']);

  const care = buildSection([
    details.watering ? { label: 'Watering', value: details.watering } : null,
    formatBenchmark(details.wateringGeneralBenchmark)
      ? { label: 'Watering benchmark', value: formatBenchmark(details.wateringGeneralBenchmark) }
      : null,
    details.sunlight ? { label: 'Sunlight', value: formatList(details.sunlight) } : null,
    details.soil ? { label: 'Soil', value: formatList(details.soil) } : null,
    details.pruningMonth ? { label: 'Pruning months', value: formatList(details.pruningMonth) } : null,
    formatPruningCount(details.pruningCount)
      ? { label: 'Pruning count', value: formatPruningCount(details.pruningCount) }
      : null,
    details.careLevel ? { label: 'Care level', value: details.careLevel } : null,
    details.maintenance ? { label: 'Maintenance', value: details.maintenance } : null,
  ].filter(Boolean) as PlantDetail['care']);

  const growth = buildSection([
    details.cycle ? { label: 'Life cycle', value: details.cycle } : null,
    formatDimensions(details.dimensions)
      ? { label: 'Dimensions', value: formatDimensions(details.dimensions) }
      : null,
    details.hardiness
      ? { label: 'Hardiness', value: formatRange(details.hardiness.min, details.hardiness.max) }
      : null,
    details.growthRate ? { label: 'Growth rate', value: details.growthRate } : null,
    details.indoor !== null ? { label: 'Indoor', value: formatBoolean(details.indoor) } : null,
    details.tropical !== null ? { label: 'Tropical', value: formatBoolean(details.tropical) } : null,
    details.rare !== null ? { label: 'Rare', value: formatBoolean(details.rare) } : null,
    details.invasive !== null ? { label: 'Invasive', value: formatBoolean(details.invasive) } : null,
    details.thorny !== null ? { label: 'Thorny', value: formatBoolean(details.thorny) } : null,
  ].filter(Boolean) as PlantDetail['growth']);

  const seasonal = buildSection([
    details.flowers !== null ? { label: 'Flowers', value: formatBoolean(details.flowers) } : null,
    details.floweringSeason ? { label: 'Flowering season', value: details.floweringSeason } : null,
    details.cones !== null ? { label: 'Cones', value: formatBoolean(details.cones) } : null,
    details.fruits !== null ? { label: 'Fruits', value: formatBoolean(details.fruits) } : null,
    details.edibleFruit !== null
      ? { label: 'Edible fruit', value: formatBoolean(details.edibleFruit) }
      : null,
    details.fruitingSeason ? { label: 'Fruiting season', value: details.fruitingSeason } : null,
    details.harvestSeason ? { label: 'Harvest season', value: details.harvestSeason } : null,
    details.harvestMethod ? { label: 'Harvest method', value: details.harvestMethod } : null,
    details.seeds !== null ? { label: 'Seeds', value: String(details.seeds) } : null,
    details.leaf !== null ? { label: 'Leaf', value: formatBoolean(details.leaf) } : null,
    details.edibleLeaf !== null
      ? { label: 'Edible leaf', value: formatBoolean(details.edibleLeaf) }
      : null,
  ].filter(Boolean) as PlantDetail['seasonal']);

  const safety = buildSection([
    details.medicinal !== null
      ? { label: 'Medicinal', value: formatBoolean(details.medicinal) }
      : null,
    details.poisonousToHumans !== null
      ? { label: 'Poisonous to humans', value: formatBoolean(details.poisonousToHumans) }
      : null,
    details.poisonousToPets !== null
      ? { label: 'Poisonous to pets', value: formatBoolean(details.poisonousToPets) }
      : null,
    details.cuisine !== null ? { label: 'Cuisine', value: formatBoolean(details.cuisine) } : null,
  ].filter(Boolean) as PlantDetail['safety']);

  const tolerance = buildSection([
    details.droughtTolerant !== null
      ? { label: 'Drought tolerant', value: formatBoolean(details.droughtTolerant) }
      : null,
    details.saltTolerant !== null
      ? { label: 'Salt tolerant', value: formatBoolean(details.saltTolerant) }
      : null,
  ].filter(Boolean) as PlantDetail['tolerance']);

  const ecology = buildSection([
    details.attracts ? { label: 'Attracts', value: formatList(details.attracts) } : null,
    details.propagation ? { label: 'Propagation', value: formatList(details.propagation) } : null,
  ].filter(Boolean) as PlantDetail['ecology']);

  const anatomy = buildSection(
    (details.plantAnatomy ?? [])
      .map((entry) => {
        const label = entry.part ? toTitleCase(entry.part) : 'Anatomy';
        const value = formatList(entry.colors);
        return value ? { label, value } : null;
      })
      .filter(Boolean) as Array<{ label: string; value: string }>,
  );

  return {
    id: details.id,
    commonName: details.commonName,
    scientificName: details.scientificName,
    family: details.family,
    genus: details.genus,
    description: details.description,
    images,
    overview,
    care,
    growth,
    seasonal,
    safety,
    tolerance,
    ecology,
    anatomy,
    pests: details.pestSusceptibility ?? [],
  };
};
