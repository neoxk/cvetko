import type { CareEvent } from '@domain/care/types';
import type { DatabaseClient } from '@data/db/client';
import { getDatabase } from '@data/db/connection';
import { logger } from '@utils/logger';

export type CareEventStore = {
  getAll: () => Promise<CareEvent[]>;
  add: (event: CareEvent) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getByEntryId: (entryId: string) => Promise<CareEvent[]>;
};

export class MemoryCareEventStore implements CareEventStore {
  private events = new Map<string, CareEvent>();

  async getAll(): Promise<CareEvent[]> {
    return Array.from(this.events.values());
  }

  async add(event: CareEvent): Promise<void> {
    this.events.set(event.id, event);
  }

  async remove(id: string): Promise<void> {
    this.events.delete(id);
  }

  async getByEntryId(entryId: string): Promise<CareEvent[]> {
    return Array.from(this.events.values()).filter((event) => event.entryId === entryId);
  }
}

const mapRowToCareEvent = (row: {
  id: string;
  garden_entry_id: string;
  plant_id: string;
  type: string;
  occurred_at: string;
  notes: string | null;
}): CareEvent => ({
  id: row.id,
  entryId: row.garden_entry_id,
  plantId: row.plant_id,
  type: row.type as CareEvent['type'],
  occurredAt: row.occurred_at,
  notes: row.notes ?? null,
});

export const createDbCareEventStore = (
  dbPromise: Promise<DatabaseClient> = getDatabase(),
): CareEventStore => ({
  getAll: async () => {
    const db = await dbPromise;
    logger.debug('DB care events getAll');
    const rows = await db.getAllAsync<{
      id: string;
      garden_entry_id: string;
      plant_id: string;
      type: string;
      occurred_at: string;
      notes: string | null;
    }>(
      `SELECT id, garden_entry_id, plant_id, type, occurred_at, notes
       FROM care_events
       ORDER BY occurred_at DESC`,
    );
    return rows.map(mapRowToCareEvent);
  },
  add: async (event) => {
    const db = await dbPromise;
    logger.debug('DB care events add', { id: event.id });
    await db.runAsync(
      `INSERT OR REPLACE INTO care_events
       (id, garden_entry_id, plant_id, type, occurred_at, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [event.id, event.entryId, event.plantId, event.type, event.occurredAt, event.notes],
    );
  },
  remove: async (id) => {
    const db = await dbPromise;
    logger.debug('DB care events remove', { id });
    await db.runAsync(`DELETE FROM care_events WHERE id = ?`, [id]);
  },
  getByEntryId: async (entryId) => {
    const db = await dbPromise;
    logger.debug('DB care events getByEntryId', { entryId });
    const rows = await db.getAllAsync<{
      id: string;
      garden_entry_id: string;
      plant_id: string;
      type: string;
      occurred_at: string;
      notes: string | null;
    }>(
      `SELECT id, garden_entry_id, plant_id, type, occurred_at, notes
       FROM care_events
       WHERE garden_entry_id = ?
       ORDER BY occurred_at DESC`,
      [entryId],
    );
    return rows.map(mapRowToCareEvent);
  },
});
