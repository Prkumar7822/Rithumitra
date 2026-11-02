import { create } from 'zustand';

export interface FieldAlert {
  id: string;
  title: string;
  timeAgo: string;
  priority: 'Red' | 'Orange' | 'Amber';
}

export interface FeedItem {
  id: string;
  time: string;
  tag?: string;
  title: string;
  description?: string;
  type: 'critical' | 'alert' | 'routine';
}

export interface FieldInfo {
  id: string;
  name: string;
  acres: number;
  crop: string;
  soilStatus: string;
}

export interface SoilHealth {
  nitrogen: string;
  moisture: string;
}

export interface WeatherData {
  condition: string;
  temp: number;
  humidity: number;
}

interface HomeState {
  selectedField: FieldInfo;
  weather: WeatherData;
  soilHealth: SoilHealth;
  alerts: FieldAlert[];
  feeds: FeedItem[];
  
  setSelectedField: (field: FieldInfo) => void;
}

const mockField: FieldInfo = {
  id: '1',
  name: 'Paddy Field',
  acres: 3.5,
  crop: 'Paddy',
  soilStatus: 'HEALTHY SOIL',
};

const mockWeather: WeatherData = {
  condition: 'Sunny Day',
  temp: 32,
  humidity: 45,
};

const mockSoilHealth: SoilHealth = {
  nitrogen: 'Optimal',
  moisture: '72%',
};

const mockAlerts: FieldAlert[] = [
  { id: '1', title: 'Low moisture detected in Field 2', timeAgo: '2 hours ago', priority: 'Amber' },
  { id: '2', title: 'Nitrogen level dropping', timeAgo: '5 hours ago', priority: 'Orange' },
  { id: '3', title: 'Pest risk alert', timeAgo: '18 hours ago', priority: 'Red' },
];

const mockFeeds: FeedItem[] = [
  { 
    id: '1', 
    time: '07:00 AM', 
    tag: 'CRITICAL TASK', 
    title: 'Inspect Corn Sprouts', 
    description: 'Check for early leaf wilting in Section B.',
    type: 'critical'
  },
  { 
    id: '2', 
    time: '09:00 AM', 
    title: 'Low moisture in Field 2', 
    description: '2 hours ago',
    type: 'alert'
  },
  { 
    id: '3', 
    time: '11:30 AM', 
    title: 'Irrigation Maintenance', 
    type: 'routine'
  },
];

export const useHomeStore = create<HomeState>((set) => ({
  selectedField: mockField,
  weather: mockWeather,
  soilHealth: mockSoilHealth,
  alerts: mockAlerts,
  feeds: mockFeeds,

  setSelectedField: (field) => set({ selectedField: field }),
}));
