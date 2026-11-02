import Paho from 'paho-mqtt';

/**
 * HiveMQ Cloud Broker configuration matching the reference Kotlin implementation.
 * We connect securely via WebSocket Secure (WSS) on port 8884.
 */
const BROKER_HOST = 'a89b032424ec493f8559fc941abb3618.s1.eu.hivemq.cloud';
const BROKER_PORT = 8884;
const BROKER_PATH = '/mqtt';
const MQTT_USER = 'Soil_smart';
const MQTT_PASS = 'Soil_smart_8883';

class MqttService {
  private client: Paho.Client | null = null;
  private _isConnected = false;
  private isConnecting = false;

  get isConnected(): boolean {
    return this._isConnected;
  }

  connect(): void {
    if (this._isConnected || this.isConnecting) return;
    this.isConnecting = true;

    try {
      const clientId = 'SoilSmart-' + Math.random().toString(16).substring(2, 8);
      this.client = new Paho.Client(BROKER_HOST, BROKER_PORT, BROKER_PATH, clientId);

      this.client.onConnectionLost = (responseObject) => {
        console.log('[MqttService] Connection lost:', responseObject.errorMessage);
        this._isConnected = false;
        this.isConnecting = false;
        // Auto-reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };

      this.client.connect({
        useSSL: true,
        userName: MQTT_USER,
        password: MQTT_PASS,
        timeout: 8,
        keepAliveInterval: 30,
        cleanSession: true,
        onSuccess: () => {
          console.log('[MqttService] Connected to HiveMQ Cloud via WSS 8884!');
          this._isConnected = true;
          this.isConnecting = false;
        },
        onFailure: (err) => {
          console.error('[MqttService] Connection failed:', err.errorMessage);
          this._isConnected = false;
          this.isConnecting = false;
          // Retry after 5 seconds
          setTimeout(() => this.connect(), 5000);
        },
      });
    } catch (err: any) {
      console.error('[MqttService] Error initializing Paho MQTT:', err?.message || err);
      this.isConnecting = false;
    }
  }

  /**
   * Publish telemetry payload to the specified MQTT topic.
   */
  publish(topic: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.client || !this._isConnected) {
        resolve(false);
        return;
      }
      try {
        const msg = new Paho.Message(message);
        msg.destinationName = topic;
        msg.qos = 1;
        this.client.send(msg);
        console.log('[MqttService] Published to', topic, ':', message);
        resolve(true);
      } catch (err: any) {
        console.error('[MqttService] Publish failed:', err?.message || err);
        resolve(false);
      }
    });
  }

  disconnect(): void {
    if (this.client && this._isConnected) {
      try {
        this.client.disconnect();
      } catch (e) {
        // ignore
      }
      this.client = null;
      this._isConnected = false;
    }
  }
}

export const mqttService = new MqttService();
