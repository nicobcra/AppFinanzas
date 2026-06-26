import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Servicio para almacenar de forma segura datos sensibles como JWT tokens.
 * Utiliza expo-secure-store en iOS y Android, con un fallback en memoria para Web.
 */
class SecureStorageService {
  private memoryStorage: Record<string, string> = {};

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      this.memoryStorage[key] = value;
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // Ignorar fallos de cuota o privacidad en web
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return this.memoryStorage[key] || localStorage.getItem(key) || null;
    }
    return await SecureStore.getItemAsync(key);
  }

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      delete this.memoryStorage[key];
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  }
}

export const secureStorage = new SecureStorageService();
export default secureStorage;
