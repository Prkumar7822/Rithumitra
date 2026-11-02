import { open, type DB } from '@op-engineering/op-sqlite';
import { SensorReading } from '../models/sensorTypes';

let db: DB | null = null;

/**
 * Initialize the SQLite database and create the sensor_readings table if it doesn't exist.
 * Uses executeSync for DDL to ensure the table is ready before any reads/writes.
 */
export const initDb = (): void => {
  if (db) return; // Prevent re-initialization
  db = open({ name: 'soilsmart.sqlite' });
  db.executeSync(
    'CREATE TABLE IF NOT EXISTS sensor_readings (' +
      'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
      'device_id TEXT NOT NULL, ' +
      'field_id TEXT NOT NULL, ' +
      'parameter_id INTEGER NOT NULL, ' +
      'value TEXT NOT NULL, ' +
      'timestamp INTEGER NOT NULL, ' +
      'sample_id INTEGER NOT NULL, ' +
      'is_synced INTEGER DEFAULT 0' +
    ')',
  );
};

/**
 * Insert a new sensor reading into the local database.
 * Uses executeSync to avoid race conditions with the background sync loop.
 */
export const insertReading = (reading: SensorReading): void => {
  if (!db) initDb();
  db!.executeSync(
    'INSERT INTO sensor_readings (device_id, field_id, parameter_id, value, timestamp, sample_id) VALUES (?, ?, ?, ?, ?, ?)',
    [
      reading.device_id,
      reading.field_id,
      reading.parameter_id,
      reading.value,
      reading.timestamp,
      reading.sample_id,
    ],
  );
};

/**
 * Fetch up to 50 unsynced readings from the local database.
 * op-sqlite QueryResult shape: { rows: Array<Record<string, Scalar>> }
 */
export const getUnsyncedReadings = (): SensorReading[] => {
  if (!db) initDb();
  const result = db!.executeSync(
    'SELECT * FROM sensor_readings WHERE is_synced = 0 LIMIT 50',
  );
  return (result.rows || []) as unknown as SensorReading[];
};

/**
 * Mark a specific reading as synced after successful MQTT publish.
 */
export const markAsSynced = (id: number): void => {
  if (!db) initDb();
  db!.executeSync(
    'UPDATE sensor_readings SET is_synced = 1 WHERE id = ?',
    [id],
  );
};
