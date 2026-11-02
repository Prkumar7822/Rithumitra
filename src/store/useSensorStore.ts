import { create } from 'zustand';
import { BleConnectionState, BleMessage, DiscoveredDevice } from '../models/sensorTypes';
import { bleService } from '../services/bleService';
import { initDb, insertReading, getUnsyncedReadings, markAsSynced } from '../services/sqliteService';
import { mqttService } from '../services/mqttService';

/** MQTT topic matching the Kotlin reference app */
const TELEMETRY_TOPIC = 'field/telemetry/gateway';

/** How often (ms) to check for unsynced readings and push to MQTT */
const SYNC_INTERVAL_MS = 3000;

const formatTimestamp = (epochSeconds: number): string => {
  const d = new Date(epochSeconds * 1000);
  const pad = (n: number) => (n < 10 ? '0' + n : String(n));
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    ' ' +
    pad(d.getHours()) +
    ':' +
    pad(d.getMinutes()) +
    ':' +
    pad(d.getSeconds())
  );
};

interface SensorState {
  bleState: BleConnectionState;
  discoveredDevices: DiscoveredDevice[];
  connectedDeviceId: string | null;
  sensingState: 'STARTED' | 'STOPPED' | 'PAUSED';
  liveReadings: Record<number, string>;
  currentFieldId: string;
  sampleId: number;
  isInitialized: boolean;

  // Actions
  startScan: () => void;
  stopScan: () => void;
  connectDevice: (deviceId: string) => Promise<boolean>;
  disconnect: () => void;
  startSensing: () => void;
  pauseSensing: () => void;
  stopSensing: () => void;
  syncNow: () => Promise<number>;
  sendCommand: (cmd: string) => void;
  setFieldId: (id: string) => void;
  initServices: () => void;
}

export const useSensorStore = create<SensorState>((set, get) => ({
  bleState: BleConnectionState.Disconnected,
  discoveredDevices: [],
  connectedDeviceId: null,
  sensingState: 'PAUSED',
  liveReadings: {},
  currentFieldId: '0',
  sampleId: 1,
  isInitialized: false,

  startScan: () => {
    set({ discoveredDevices: [] });
    bleService.startScanning();
  },

  stopScan: () => bleService.stopScanning(),

  connectDevice: async (deviceId: string) => {
    const success = await bleService.connectToDevice(deviceId);
    if (success) {
      set({ connectedDeviceId: deviceId, sensingState: 'PAUSED' });
    }
    return success;
  },

  disconnect: () => {
    bleService.disconnect();
    set({ connectedDeviceId: null, sensingState: 'PAUSED', liveReadings: {} });
  },

  startSensing: () => {
    const state = get();
    if (state.sensingState === 'STOPPED') {
      set({ sampleId: state.sampleId + 1 });
    }
    bleService.sendCommand('START');
    set({ sensingState: 'STARTED' });
  },

  pauseSensing: () => {
    bleService.sendCommand('PAUSE');
    set({ sensingState: 'PAUSED' });
  },

  stopSensing: () => {
    bleService.sendCommand('STOP');
    set({ sensingState: 'STOPPED' });
  },

  setFieldId: (id: string) => set({ currentFieldId: id || '0' }),

  syncNow: async (): Promise<number> => {
    if (!mqttService.isConnected) {
      mqttService.connect();
      // Give connection a moment
      await new Promise((r) => setTimeout(r, 1500));
    }

    if (!mqttService.isConnected) {
      console.log('[SensorStore] Cannot sync: MQTT broker not connected yet');
      return 0;
    }

    const unsynced = getUnsyncedReadings();
    let syncedCount = 0;

    for (const reading of unsynced) {
      const tsStr = formatTimestamp(reading.timestamp);
      const payload = [
        reading.device_id,
        reading.field_id,
        reading.parameter_id,
        reading.value,
        reading.sample_id,
        tsStr,
      ].join(', ');

      const success = await mqttService.publish(TELEMETRY_TOPIC, payload);
      if (success && reading.id) {
        markAsSynced(reading.id);
        syncedCount++;
      }
    }

    return syncedCount;
  },

  sendCommand: (cmd: string) => {
    const state = get();
    if (cmd === 'START' && state.sensingState === 'STOPPED') {
      set({ sampleId: state.sampleId + 1 });
    }
    bleService.sendCommand(cmd);
    if (cmd === 'START') set({ sensingState: 'STARTED' });
    if (cmd === 'PAUSE') set({ sensingState: 'PAUSED' });
    if (cmd === 'STOP') set({ sensingState: 'STOPPED' });
  },

  initServices: () => {
    // 1. Initialize local SQLite database
    initDb();

    // 2. Start MQTT connection to HiveMQ Cloud
    mqttService.connect();

    if (get().isInitialized) return;
    set({ isInitialized: true });

    // 3. Register BLE listeners
    bleService.setListeners(
      (data: BleMessage) => {
        const paramId = data.parameter_id ?? data.parameterId;
        const devId = String(data.device_id ?? data.deviceId ?? get().connectedDeviceId ?? 'SoilSmart_Node');
        const val = data.value;

        switch (data.status) {
          case 'SENSOR_DATA': {
            if (paramId === undefined || val === undefined) return;
            const state = get();

            // Update live readings in memory
            set((prev) => ({
              liveReadings: {
                ...prev.liveReadings,
                [paramId]: val,
              },
            }));

            // Insert into SQLite table
            const ts = data.timestamp ? Number(data.timestamp) : Math.floor(Date.now() / 1000);
            insertReading({
              device_id: devId,
              field_id: state.currentFieldId,
              parameter_id: paramId,
              value: val,
              timestamp: ts,
              sample_id: state.sampleId,
            });
            break;
          }
          case 'STARTED':
            set({ sensingState: 'STARTED' });
            break;
          case 'STOPPED':
            set({ sensingState: 'STOPPED' });
            break;
          case 'PAUSED':
            set({ sensingState: 'PAUSED' });
            break;
          case 'TIME_SYNCED':
            console.log('[SensorStore] Hardware time synced');
            break;
          default:
            console.log('[SensorStore] BLE status:', data.status);
        }
      },

      (state: BleConnectionState) => {
        set({ bleState: state });
        if (state === BleConnectionState.Disconnected) {
          set({ connectedDeviceId: null, sensingState: 'PAUSED' });
        }
      },

      (device: DiscoveredDevice) => {
        set((state) => {
          const index = state.discoveredDevices.findIndex((d) => d.id === device.id);
          if (index !== -1) {
            const updated = [...state.discoveredDevices];
            updated[index] = {
              ...updated[index],
              name: device.name || updated[index].name,
              rssi: device.rssi ?? updated[index].rssi,
            };
            return { discoveredDevices: updated };
          }
          return {
            discoveredDevices: [...state.discoveredDevices, device],
          };
        });
      },
    );

    // 4. Background sync loop: push unsynced SQLite readings to HiveMQ Cloud / AWS
    setInterval(async () => {
      if (!mqttService.isConnected) {
        mqttService.connect();
        return;
      }

      const unsynced = getUnsyncedReadings();
      if (unsynced.length === 0) return;

      for (const reading of unsynced) {
        const tsStr = formatTimestamp(reading.timestamp);
        const payload = [
          reading.device_id,
          reading.field_id,
          reading.parameter_id,
          reading.value,
          reading.sample_id,
          tsStr,
        ].join(', ');

        const success = await mqttService.publish(TELEMETRY_TOPIC, payload);
        if (success && reading.id) {
          markAsSynced(reading.id);
          console.log('[SensorStore] Auto-synced reading to cloud:', reading.id);
        }
      }
    }, SYNC_INTERVAL_MS);
  },
}));
