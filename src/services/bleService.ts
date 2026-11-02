import { BleManager, Device, Subscription } from 'react-native-ble-plx';
import { BleConnectionState, BleMessage, DiscoveredDevice } from '../models/sensorTypes';

/**
 * UUIDs matching the ESP32 SoilSmart firmware.
 * These must match the UUIDs in the hardware BLE GATT profile.
 */
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const STATUS_CHAR_UUID = 'd74291c2-3e5f-463e-a89e-47347a4f7833';
const COMMAND_CHAR_UUID = '4d234454-cf6d-4a0f-adf2-f4911ba9ffa6';

/** Timeout for BLE scanning in milliseconds */
const SCAN_TIMEOUT_MS = 25000;

/**
 * Decode a base64 string to UTF-8 text.
 * react-native-ble-plx returns characteristic values as base64.
 */
const decodeBase64 = (base64: string): string => {
  try {
    const fn = (globalThis as any).atob ; return fn ? fn(base64) : '';
  } catch {
    return '';
  }
};

/**
 * Encode a UTF-8 string to base64 for writing to BLE characteristics.
 */
const encodeBase64 = (text: string): string => {
  try {
    const fn = (globalThis as any).btoa ; return fn ? fn(text) : '';
  } catch {
    return '';
  }
};

/**
 * BleService encapsulates all Bluetooth Low Energy interactions.
 * It scans for nearby BLE devices, provides discovered devices list,
 * connects to a selected device, subscribes to sensor data, and sends commands.
 */
class BleService {
  private manager: BleManager;
  private connectedDevice: Device | null = null;
  private monitorSubscription: Subscription | null = null;
  private scanTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private devicesMap: Map<string, Device> = new Map();

  private onDataReceived: ((data: BleMessage) => void) | null = null;
  private onStateChange: ((state: BleConnectionState) => void) | null = null;
  private onDeviceFound: ((device: DiscoveredDevice) => void) | null = null;

  public connectionState: BleConnectionState = BleConnectionState.Disconnected;
  public connectedDeviceId: string | null = null;

  constructor() {
    this.manager = new BleManager();
  }

  /**
   * Register callbacks for data, connection state, and discovered devices.
   */
  setListeners(
    dataListener: (data: BleMessage) => void,
    stateListener: (state: BleConnectionState) => void,
    deviceFoundListener?: (device: DiscoveredDevice) => void,
  ): void {
    this.onDataReceived = dataListener;
    this.onStateChange = stateListener;
    if (deviceFoundListener) {
      this.onDeviceFound = deviceFoundListener;
    }
  }

  private updateState(state: BleConnectionState): void {
    this.connectionState = state;
    this.onStateChange?.(state);
  }

  /**
   * Begin scanning for all nearby BLE devices.
   * Reports every discovered device to onDeviceFound listener.
   */
  startScanning(): void {
    // If already scanning, don't duplicate
    if (this.connectionState === BleConnectionState.Scanning) return;

    this.devicesMap.clear();
    this.updateState(BleConnectionState.Scanning);

    this.manager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error, device) => {
        if (error) {
          console.error('[BleService] Scan error:', error.message);
          this.updateState(BleConnectionState.Error);
          return;
        }

        if (device && device.id) {
          this.devicesMap.set(device.id, device);
          const name = device.name || device.localName || null;
          this.onDeviceFound?.({
            id: device.id,
            name: name,
            rssi: device.rssi,
          });
        }
      },
    );

    // Auto-stop scan after timeout
    this.scanTimeoutId = setTimeout(() => {
      if (this.connectionState === BleConnectionState.Scanning) {
        console.log('[BleService] Scan timed out');
        this.manager.stopDeviceScan();
        this.updateState(BleConnectionState.Disconnected);
      }
    }, SCAN_TIMEOUT_MS);
  }

  stopScanning(): void {
    this.manager.stopDeviceScan();
    this.clearScanTimeout();
    if (this.connectionState === BleConnectionState.Scanning) {
      this.updateState(BleConnectionState.Disconnected);
    }
  }

  private clearScanTimeout(): void {
    if (this.scanTimeoutId) {
      clearTimeout(this.scanTimeoutId);
      this.scanTimeoutId = null;
    }
  }

  /**
   * Connect to a specific device by its deviceId (MAC address or UUID).
   */
  async connectToDevice(deviceId: string): Promise<boolean> {
    this.stopScanning();
    this.updateState(BleConnectionState.Connecting);

    try {
      console.log('[BleService] Connecting to device:', deviceId);
      const connected = await this.manager.connectToDevice(deviceId, { requestMTU: 512 });
      const discovered = await connected.discoverAllServicesAndCharacteristics();
      this.connectedDevice = discovered;
      this.connectedDeviceId = deviceId;
      this.updateState(BleConnectionState.Connected);
      console.log('[BleService] Connected and services discovered for:', deviceId);

      // Log discovered services to help debug UUID matching
      try {
        const services = await discovered.services();
        console.log('[BleService] Available services:', services.map(s => s.uuid));
      } catch (e) {
        console.log('[BleService] Could not list services:', e);
      }

      // Subscribe to sensor data notifications
      this.monitorSubscription = discovered.monitorCharacteristicForService(
        SERVICE_UUID,
        STATUS_CHAR_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('[BleService] Monitor error:', error.message);
            if (error.message?.includes('disconnected') || error.message?.includes('closed')) {
              this.connectedDevice = null;
              this.connectedDeviceId = null;
              this.updateState(BleConnectionState.Disconnected);
            }
            return;
          }

          if (characteristic?.value) {
            const jsonStr = decodeBase64(characteristic.value);
            if (!jsonStr) return;
            try {
              const data: BleMessage = JSON.parse(jsonStr);
              console.log('[BleService] Received status:', data.status);
              this.onDataReceived?.(data);
            } catch (e) {
              console.error('[BleService] JSON parse error:', e, 'Payload:', jsonStr);
            }
          }
        },
      );

      // Send initial time sync command matching reference Kotlin app
      const unixTime = Math.floor(Date.now() / 1000);
      this.sendCommand('TIME:' + unixTime);

      return true;
    } catch (err: any) {
      console.error('[BleService] Connection failed:', err.message);
      this.connectedDevice = null;
      this.connectedDeviceId = null;
      this.updateState(BleConnectionState.Error);
      return false;
    }
  }

  /**
   * Send a command string to the ESP32 via the command characteristic.
   * Commands: 'START', 'STOP', 'PAUSE', 'TIME:<unix_timestamp>'
   */
  async sendCommand(command: string): Promise<void> {
    if (!this.connectedDevice) {
      console.warn('[BleService] Cannot send command: no device connected');
      return;
    }
    try {
      const base64Command = encodeBase64(command);
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        COMMAND_CHAR_UUID,
        base64Command,
      );
      console.log('[BleService] Command sent:', command);
    } catch (err: any) {
      console.error('[BleService] Send command failed:', err.message);
    }
  }

  /**
   * Gracefully disconnect from the BLE device and clean up subscriptions.
   */
  async disconnect(): Promise<void> {
    this.monitorSubscription?.remove();
    this.monitorSubscription = null;
    if (this.connectedDevice) {
      try {
        await this.connectedDevice.cancelConnection();
      } catch (err: any) {
        console.warn('[BleService] Disconnect warning:', err.message);
      }
      this.connectedDevice = null;
      this.connectedDeviceId = null;
    }
    this.updateState(BleConnectionState.Disconnected);
  }
}

export const bleService = new BleService();


