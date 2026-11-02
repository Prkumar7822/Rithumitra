export interface SensorReading {
  id?: number;
  device_id: string;
  field_id: string;
  parameter_id: number;
  value: string;
  timestamp: number;
  sample_id: number;
  is_synced?: boolean;
}

export interface BleMessage {
  status: string; // 'SENSOR_DATA', 'STARTED', 'STOPPED', 'PAUSED', 'TIME_SYNCED'
  device_id?: string | number;
  deviceId?: string | number;
  location_id?: string | number;
  locationId?: string | number;
  parameter_id?: number;
  parameterId?: number;
  value?: string;
  timestamp?: number;
}

export interface DiscoveredDevice {
  id: string;
  name: string | null;
  rssi: number | null;
}

export enum BleConnectionState {
  Disconnected = 'Disconnected',
  Scanning = 'Scanning',
  Connecting = 'Connecting',
  Connected = 'Connected',
  Error = 'Error'
}
