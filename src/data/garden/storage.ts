import type { GardenEntry } from '@domain/garden/types';
import type { DatabaseClient } from '@data/db/client';
import { getDatabase } from '@data/db/connection';
import { logger } from '@utils/logger';

export type GardenStore = {
  getAll: () => Promise<GardenEntry[]>;
  add: (entry: GardenEntry) => Promise<void>;
  update: (entry: GardenEntry) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getById: (id: string) => Promise<GardenEntry | null>;
};

export class MemoryGardenStore implements GardenStore {
  private entries = new Map<string, GardenEntry>();

  async getAll(): Promise<GardenEntry[]> {
    return Array.from(this.entries.values());
  }

  async add(entry: GardenEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  async update(entry: GardenEntry): Promise<void> {
    this.entries.set(entry.id, entry);
  }

  async remove(id: string): Promise<void> {
    this.entries.delete(id);
  }

  async getById(id: string): Promise<GardenEntry | null> {
    return this.entries.get(id) ?? null;
  }
}

const mapRowToGardenEntry = (row: {
  id: string;
  plant_id: string;
  name: string;
  scientific_name: string;
  image_url: string | null;
  location: string | null;
  planted_at: string;
  watering: string | null;
  sunlight: string | null;
  cycle: string | null;
  hardiness_min: number | null;
  hardiness_max: number | null;
  description: string | null;
  last_watered_at: string | null;
  notes: string | null;
}): GardenEntry => ({
  id: row.id,
  plantId: row.plant_id,
  name: row.name,
  scientificName: row.scientific_name,
  imageUrl: row.image_url ?? null,
  location: row.location ?? null,
  plantedAt: row.planted_at,
  watering: row.watering ?? null,
  sunlight: row.sunlight ?? null,
  cycle: row.cycle ?? null,
  hardinessMin: row.hardiness_min ?? null,
  hardinessMax: row.hardiness_max ?? null,
  description: row.description ?? null,
  lastWateredAt: row.last_watered_at ?? null,
  notes: row.notes ?? null,
});

export const createDbGardenStore = (
  dbPromise: Promise<DatabaseClient> = getDatabase(),
): GardenStore => ({
  getAll: async () => {
    const db = await dbPromise;
    logger.debug('DB garden getAll');
    const rows = await db.getAllAsync<{
      id: string;
      plant_id: string;
      name: string;
      scientific_name: string;
      image_url: string | null;
      location: string | null;
      planted_at: string;
      watering: string | null;
      sunlight: string | null;
      cycle: string | null;
      hardiness_min: number | null;
      hardiness_max: number | null;
      description: string | null;
      last_watered_at: string | null;
      notes: string | null;
    }>(
      `SELECT id, plant_id, name, scientific_name, image_url, location, planted_at,
              watering, sunlight, cycle, hardiness_min, hardiness_max, description,
              last_watered_at, notes
       FROM garden_entries
       ORDER BY planted_at DESC`,
    );
    return rows.map(mapRowToGardenEntry);
  },
  add: async (entry) => {
    const db = await dbPromise;
    logger.debug('DB garden add', { id: entry.id });
    await db.runAsync(
      `INSERT OR REPLACE INTO garden_entries
       (id, plant_id, name, scientific_name, image_url, source, location, planted_at,
        watering, sunlight, cycle, hardiness_min, hardiness_max, description,
        last_watered_at, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.id,
        entry.plantId,
        entry.name,
        entry.scientificName,
        entry.imageUrl,
        'app',
        entry.location,
        entry.plantedAt,
        entry.watering,
        entry.sunlight,
        entry.cycle,
        entry.hardinessMin,
        entry.hardinessMax,
        entry.description,
        entry.lastWateredAt,
        entry.notes,
      ],
    );
  },
  update: async (entry) => {
    const db = await dbPromise;
    logger.debug('DB garden update', { id: entry.id });
    await db.runAsync(
      `UPDATE garden_entries
       SET plant_id = ?, name = ?, scientific_name = ?, image_url = ?, source = ?, location = ?, planted_at = ?,
           watering = ?, sunlight = ?, cycle = ?, hardiness_min = ?, hardiness_max = ?, description = ?,
           last_watered_at = ?, notes = ?
       WHERE id = ?`,
      [
        entry.plantId,
        entry.name,
        entry.scientificName,
        entry.imageUrl,
        'app',
        entry.location,
        entry.plantedAt,
        entry.watering,
        entry.sunlight,
        entry.cycle,
        entry.hardinessMin,
        entry.hardinessMax,
        entry.description,
        entry.lastWateredAt,
        entry.notes,
        entry.id,
      ],
    );
  },
  remove: async (id) => {
    const db = await dbPromise;
    logger.debug('DB garden remove', { id });
    await db.runAsync(`DELETE FROM garden_entries WHERE id = ?`, [id]);
  },
  getById: async (id) => {
    const db = await dbPromise;
    logger.debug('DB garden getById', { id });
    const row = await db.getFirstAsync<{
      id: string;
      plant_id: string;
      name: string;
      scientific_name: string;
      image_url: string | null;
      location: string | null;
      planted_at: string;
      watering: string | null;
      sunlight: string | null;
      cycle: string | null;
      hardiness_min: number | null;
      hardiness_max: number | null;
      description: string | null;
      last_watered_at: string | null;
      notes: string | null;
    }>(
      `SELECT id, plant_id, name, scientific_name, image_url, location, planted_at,
              watering, sunlight, cycle, hardiness_min, hardiness_max, description,
              last_watered_at, notes
       FROM garden_entries
       WHERE id = ?
       LIMIT 1`,
      [id],
    );
    return row ? mapRowToGardenEntry(row) : null;
  },
});
