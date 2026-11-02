import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useSensorStore } from '../store/useSensorStore';
import { COLORS } from '../constants/colors';
import { BleConnectionState, SensorReading, DiscoveredDevice } from '../models/sensorTypes';
import { insertReading, getUnsyncedReadings } from '../services/sqliteService';

interface ParameterMeta {
  id: number;
  name: string;
  unit: string;
  symbol: string;
  color: string;
}

const PARAMETERS: ParameterMeta[] = [
  { id: 1, name: 'Nitrogen', symbol: 'N', unit: 'mg/kg', color: '#2E7D32' },
  { id: 2, name: 'Phosphorus', symbol: 'P', unit: 'mg/kg', color: '#E65100' },
  { id: 3, name: 'Potassium', symbol: 'K', unit: 'mg/kg', color: '#1565C0' },
  { id: 4, name: 'Moisture', symbol: 'H2O', unit: '%', color: '#00838F' },
  { id: 5, name: 'pH', symbol: 'pH', unit: 'scale', color: '#6A1B9A' },
  { id: 6, name: 'EC', symbol: 'EC', unit: 'uS/cm', color: '#AD1457' },
  { id: 7, name: 'Temperature', symbol: 'Temp', unit: 'C', color: '#C62828' },
];

export default function DeviceConnectionScreen() {
  const {
    bleState,
    discoveredDevices,
    connectedDeviceId,
    sensingState,
    liveReadings,
    startScan,
    stopScan,
    connectDevice,
    disconnect,
    startSensing,
    pauseSensing,
    stopSensing,
    initServices,
  } = useSensorStore();

  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [lastAction, setLastAction] = useState<string>('');

  useEffect(() => {
    initServices();
    requestPermissions();
    loadReadings();
  }, []);

  // Reload SQLite count whenever new live readings arrive
  useEffect(() => {
    loadReadings();
  }, [liveReadings]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 31) {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);
        } else {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
        }
      } catch (e) {
        console.warn('Permission error:', e);
      }
    }
  };

  const handleConnect = async (device: DiscoveredDevice) => {
    setConnectingId(device.id);
    const success = await connectDevice(device.id);
    setConnectingId(null);
    if (!success) {
      setLastAction('Failed to connect to ' + (device.name || device.id));
    } else {
      setLastAction('Connected to ' + (device.name || device.id));
    }
  };

  const loadReadings = () => {
    try {
      const rows = getUnsyncedReadings();
      setReadings(rows || []);
    } catch (e: any) {
      setLastAction('Error reading DB: ' + (e?.message || 'Unknown error'));
    }
  };

  const handleInsertMockReading = () => {
    try {
      const randomParam = Math.floor(Math.random() * 7) + 1;
      const randomVal = (Math.random() * 50 + 10).toFixed(1);
      const newReading: SensorReading = {
        device_id: connectedDeviceId || 'SoilSmart_Simulated',
        field_id: '1',
        parameter_id: randomParam,
        value: randomVal,
        timestamp: Math.floor(Date.now() / 1000),
        sample_id: 1,
      };

      insertReading(newReading);
      setLastAction('Simulated: ' + (PARAMETERS[randomParam - 1]?.name || 'Param') + ' = ' + randomVal);
      loadReadings();
    } catch (e: any) {
      setLastAction('Insert failed: ' + (e?.message || 'Unknown error'));
    }
  };

  const getStatusColor = () => {
    switch (bleState) {
      case BleConnectionState.Connected:
        return '#4CAF50';
      case BleConnectionState.Scanning:
      case BleConnectionState.Connecting:
        return '#FF9800';
      case BleConnectionState.Error:
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const isScanning = bleState === BleConnectionState.Scanning;
  const isConnected = bleState === BleConnectionState.Connected;

  const isSoilDevice = (name: string | null): boolean => {
    if (!name) return false;
    const lower = name.toLowerCase();
    return (
      lower.includes('soil') ||
      lower.includes('smart') ||
      lower.includes('esp') ||
      lower.includes('node') ||
      lower.includes('bt')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Hardware Connection</Text>
        <Text style={styles.subtitle}>Scan, connect, and read your SoilSmart sensor</Text>

        {/* Connection Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            <View style={styles.statusInfo}>
              <Text style={styles.statusText}>{bleState}</Text>
              {isConnected && connectedDeviceId ? (
                <Text style={styles.connectedDetail}>Device ID: {connectedDeviceId}</Text>
              ) : null}
            </View>
            {isScanning && <ActivityIndicator size="small" color={COLORS.primary} />}
          </View>
        </View>

        {/* LIVE SENSING CONTROLS (Displayed when connected) */}
        {isConnected ? (
          <View style={styles.sensingCard}>
            <View style={styles.sensingHeaderRow}>
              <Text style={styles.sensingTitle}>Soil Sensing Probe</Text>
              <View
                style={[
                  styles.sensingBadge,
                  sensingState === 'STARTED'
                    ? styles.sensingBadgeActive
                    : sensingState === 'PAUSED'
                    ? styles.sensingBadgePaused
                    : styles.sensingBadgeStopped,
                ]}
              >
                <Text
                  style={[
                    styles.sensingBadgeText,
                    sensingState === 'STARTED'
                      ? styles.sensingTextActive
                      : sensingState === 'PAUSED'
                      ? styles.sensingTextPaused
                      : styles.sensingTextStopped,
                  ]}
                >
                  {sensingState}
                </Text>
              </View>
            </View>

            <Text style={styles.sensingHelp}>
              Insert the probe into the soil, then tap Start to begin collecting real-time NPK & moisture data.
            </Text>

            {/* Start / Pause / Stop Buttons */}
            <View style={styles.controlsRow}>
              <TouchableOpacity
                style={[
                  styles.ctrlBtn,
                  styles.startBtn,
                  sensingState === 'STARTED' && styles.ctrlBtnActive,
                ]}
                onPress={startSensing}
                activeOpacity={0.7}
              >
                <Text style={styles.ctrlBtnText}>▶ Start</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ctrlBtn,
                  styles.pauseBtn,
                  sensingState === 'PAUSED' && styles.ctrlBtnActive,
                ]}
                onPress={pauseSensing}
                activeOpacity={0.7}
              >
                <Text style={styles.ctrlBtnText}>⏸ Pause</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ctrlBtn,
                  styles.stopBtn,
                  sensingState === 'STOPPED' && styles.ctrlBtnActive,
                ]}
                onPress={stopSensing}
                activeOpacity={0.7}
              >
                <Text style={styles.ctrlBtnText}>⏹ Stop</Text>
              </TouchableOpacity>
            </View>

            {/* LIVE 7-IN-1 METRICS GRID */}
            <Text style={styles.metricsTitle}>Live Soil Metrics</Text>
            <View style={styles.metricsGrid}>
              {PARAMETERS.map((p) => {
                const liveVal = liveReadings[p.id];
                return (
                  <View key={p.id} style={styles.metricTile}>
                    <View style={styles.tileHeader}>
                      <Text style={[styles.tileSymbol, { color: p.color }]}>{p.symbol}</Text>
                      <Text style={styles.tileName}>{p.name}</Text>
                    </View>
                    <Text style={[styles.tileValue, { color: liveVal ? p.color : '#999' }]}>
                      {liveVal !== undefined ? liveVal : '--'}
                    </Text>
                    <Text style={styles.tileUnit}>{p.unit}</Text>
                  </View>
                );
              })}
            </View>

            {/* Disconnect Button */}
            <TouchableOpacity
              style={styles.disconnectBtn}
              onPress={disconnect}
              activeOpacity={0.7}
            >
              <Text style={styles.disconnectBtnText}>Disconnect Device</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* SCANNING & DEVICE DISCOVERY SECTION (When disconnected) */
          <>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, isScanning && styles.buttonDisabled]}
                onPress={startScan}
                disabled={isScanning}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>
                  {isScanning ? 'Scanning for Devices...' : 'Scan for Devices'}
                </Text>
              </TouchableOpacity>

              {isScanning ? (
                <TouchableOpacity
                  style={[styles.button, styles.buttonStop]}
                  onPress={stopScan}
                  activeOpacity={0.7}
                >
                  <Text style={styles.buttonText}>Stop Scan</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.devicesCard}>
              <View style={styles.deviceHeaderRow}>
                <Text style={styles.sectionTitle}>Available Devices</Text>
                <Text style={styles.deviceCountBadge}>{discoveredDevices.length} found</Text>
              </View>

              {isScanning && discoveredDevices.length === 0 ? (
                <View style={styles.emptyState}>
                  <ActivityIndicator size="small" color={COLORS.primary} style={{ marginBottom: 8 }} />
                  <Text style={styles.emptyText}>Scanning for nearby Bluetooth devices...</Text>
                  <Text style={styles.emptySubtext}>
                    Ensure your device is turned on and within range.
                  </Text>
                </View>
              ) : null}

              {!isScanning && discoveredDevices.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No devices detected yet.</Text>
                  <Text style={styles.emptySubtext}>
                    Turn on your hardware and tap "Scan for Devices".
                  </Text>
                </View>
              ) : null}

              {discoveredDevices.map((device) => {
                const isThisConnecting = connectingId === device.id;
                const isSoil = isSoilDevice(device.name);

                return (
                  <View key={device.id} style={styles.deviceItem}>
                    <View style={styles.deviceInfo}>
                      <View style={styles.deviceNameRow}>
                        <Text style={styles.deviceName}>
                          {device.name || 'Unnamed Device'}
                        </Text>
                        {isSoil ? (
                          <View style={styles.soilBadge}>
                            <Text style={styles.soilBadgeText}>Soil Device</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.deviceId}>{device.id}</Text>
                      {device.rssi !== null && (
                        <Text style={styles.deviceRssi}>Signal: {device.rssi} dBm</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.connectBtn,
                        isThisConnecting && styles.buttonDisabled,
                      ]}
                      onPress={() => handleConnect(device)}
                      disabled={isThisConnecting}
                      activeOpacity={0.7}
                    >
                      {isThisConnecting ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                      ) : (
                        <Text style={styles.connectBtnText}>Connect</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* SQLite Database Test Bench */}
        <View style={styles.testCard}>
          <Text style={styles.testTitle}>SQLite Local Database Storage</Text>
          <Text style={styles.testDesc}>
            All incoming BLE sensor readings are automatically saved here offline.
          </Text>

          <View style={styles.badgeRow}>
            <Text style={styles.badgeText}>
              Unsynced in DB: <Text style={styles.bold}>{readings.length}</Text>
            </Text>
          </View>

          {lastAction ? (
            <Text style={styles.actionFeedback}>{lastAction}</Text>
          ) : null}

          <View style={styles.testBtnRow}>
            <TouchableOpacity
              style={styles.insertBtn}
              onPress={handleInsertMockReading}
              activeOpacity={0.7}
            >
              <Text style={styles.btnTextWhite}>+ Insert Test Reading</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.refreshBtn}
              onPress={loadReadings}
              activeOpacity={0.7}
            >
              <Text style={styles.btnTextDark}>Refresh List</Text>
            </TouchableOpacity>
          </View>

          {readings.length > 0 && (
            <View style={styles.readingList}>
              <Text style={styles.listHeader}>Recent Records in soilsmart.sqlite:</Text>
              {readings.slice(0, 5).map((r, index) => {
                const pMeta = PARAMETERS.find((p) => p.id === r.parameter_id);
                return (
                  <View key={r.id || index} style={styles.readingItem}>
                    <Text style={styles.readingParam}>
                      {pMeta?.name || 'Param ' + r.parameter_id}:
                    </Text>
                    <Text style={styles.readingVal}>{r.value} {pMeta?.unit || ''}</Text>
                    <Text style={styles.readingDevice}>({r.device_id})</Text>
                  </View>
                );
              })}
              {readings.length > 5 && (
                <Text style={styles.moreCount}>+ {readings.length - 5} more records</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 6,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 18,
  },
  statusCard: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  connectedDetail: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sensingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sensingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sensingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  sensingBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  sensingBadgeActive: {
    backgroundColor: '#E8F5E9',
  },
  sensingBadgePaused: {
    backgroundColor: '#FFF3E0',
  },
  sensingBadgeStopped: {
    backgroundColor: '#ECEFF1',
  },
  sensingBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sensingTextActive: {
    color: '#2E7D32',
  },
  sensingTextPaused: {
    color: '#E65100',
  },
  sensingTextStopped: {
    color: '#546E7A',
  },
  sensingHelp: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 16,
    lineHeight: 18,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  ctrlBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startBtn: {
    backgroundColor: '#2E7D32',
  },
  pauseBtn: {
    backgroundColor: '#FF9800',
  },
  stopBtn: {
    backgroundColor: '#D32F2F',
  },
  ctrlBtnActive: {
    borderWidth: 2,
    borderColor: '#000',
  },
  ctrlBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  metricsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  metricTile: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tileSymbol: {
    fontSize: 12,
    fontWeight: '800',
  },
  tileName: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  tileValue: {
    fontSize: 22,
    fontWeight: '800',
    marginVertical: 2,
  },
  tileUnit: {
    fontSize: 11,
    color: '#888',
  },
  disconnectBtn: {
    backgroundColor: '#FDECEA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  disconnectBtnText: {
    color: '#C62828',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 18,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonStop: {
    backgroundColor: '#FF9800',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '600',
  },
  devicesCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  deviceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  deviceCountBadge: {
    fontSize: 12,
    color: COLORS.primary,
    backgroundColor: '#E8F5E9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  deviceInfo: {
    flex: 1,
    marginRight: 10,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  soilBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  soilBadgeText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  deviceId: {
    fontSize: 12,
    color: COLORS.textLight,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier',
  },
  deviceRssi: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  connectBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  connectBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  testCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  testTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  testDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 14,
  },
  badgeRow: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 13,
  },
  bold: {
    fontWeight: 'bold',
  },
  actionFeedback: {
    fontSize: 12,
    color: '#2E7D32',
    backgroundColor: '#F1F8E9',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  testBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  insertBtn: {
    flex: 2,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshBtn: {
    flex: 1,
    backgroundColor: '#EDEFEF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnTextWhite: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  btnTextDark: {
    color: COLORS.textDark,
    fontWeight: '600',
    fontSize: 13,
  },
  readingList: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  listHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  readingParam: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '500',
    flex: 2,
  },
  readingVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    flex: 1,
    textAlign: 'right',
  },
  readingDevice: {
    fontSize: 11,
    color: COLORS.textLight,
    flex: 1.5,
    textAlign: 'right',
  },
  moreCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
