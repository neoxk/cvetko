export type DbSchema = {
  version: number;
  statements: string[];
};

export const dbSchema: DbSchema = {
  version: 1,
  statements: [
    `CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS wishlist_items (
      id TEXT PRIMARY KEY NOT NULL,
      source TEXT NOT NULL,
      name TEXT NOT NULL,
      scientific_name TEXT NOT NULL,
      image_url TEXT,
      added_at TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS garden_entries (
      id TEXT PRIMARY KEY NOT NULL,
      plant_id TEXT NOT NULL,
      source TEXT NOT NULL,
      name TEXT NOT NULL,
      scientific_name TEXT NOT NULL,
      image_url TEXT,
      location TEXT,
      planted_at TEXT NOT NULL,
      last_watered_at TEXT,
      last_fertilized_at TEXT,
      notes TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS calendar_tasks (
      id TEXT PRIMARY KEY NOT NULL,
      plant_id TEXT NOT NULL,
      plant_name TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL,
      recurrence TEXT,
      completed_at TEXT,
      notes TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS kv_store (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );`,
  ],
};
