// Shared TypeScript types

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnvironmentData {
  id: string;
  temperature: number;
  humidity: number;
  timestamp: Date;
  sensorId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

