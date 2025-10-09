import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppMode = 'normal' | 'super' | 'god';

export interface AppSettings {
  language: string;
  mode: AppMode;
  // Add more settings here as needed
}

const SETTINGS_KEYS = {
  LANGUAGE: '@ofcapp_language',
  MODE: '@ofcapp_mode',
  // Add more setting keys here
} as const;

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  mode: 'normal',
};

export class SettingsManager {
  // Get a specific setting value
  static async getSetting<K extends keyof AppSettings>(
    key: K
  ): Promise<AppSettings[K]> {
    try {
      const storageKey = SETTINGS_KEYS[key.toUpperCase() as keyof typeof SETTINGS_KEYS];
      const value = await AsyncStorage.getItem(storageKey);
      return value !== null ? (value as AppSettings[K]) : DEFAULT_SETTINGS[key];
    } catch (error) {
      console.warn(`Failed to load setting "${key}":`, error);
      return DEFAULT_SETTINGS[key];
    }
  }

  // Set a specific setting value
  static async setSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    try {
      const storageKey = SETTINGS_KEYS[key.toUpperCase() as keyof typeof SETTINGS_KEYS];
      await AsyncStorage.setItem(storageKey, value as string);
    } catch (error) {
      console.warn(`Failed to save setting "${key}":`, error);
      throw error;
    }
  }

  // Get all settings
  static async getAllSettings(): Promise<AppSettings> {
    const settings: AppSettings = { ...DEFAULT_SETTINGS };

    try {
      const promises = Object.keys(DEFAULT_SETTINGS).map(async (key) => {
        const value = await this.getSetting(key as keyof AppSettings);
        settings[key as keyof AppSettings] = value;
      });

      await Promise.all(promises);
    } catch (error) {
      console.warn('Failed to load some settings:', error);
    }

    return settings;
  }

  // Clear all settings (reset to defaults)
  static async clearAllSettings(): Promise<void> {
    try {
      const promises = Object.values(SETTINGS_KEYS).map(key =>
        AsyncStorage.removeItem(key)
      );
      await Promise.all(promises);
    } catch (error) {
      console.warn('Failed to clear settings:', error);
      throw error;
    }
  }

  // Convenience methods for common settings
  static async getLanguage(): Promise<string> {
    return await this.getSetting('language');
  }

  static async setLanguage(language: string): Promise<void> {
    await this.setSetting('language', language);
  }

  static async getMode(): Promise<AppMode> {
    return await this.getSetting('mode');
  }

  static async setMode(mode: AppMode): Promise<void> {
    await this.setSetting('mode', mode);
  }
}