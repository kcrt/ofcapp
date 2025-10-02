import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { setDisplayLanguage } from '@/utils/i18n';
import { SettingsManager } from '@/utils/settings';

export default function RootLayout() {
  const loadLanguageSettings = async () => {
    try {
      const language = await SettingsManager.getLanguage();
      setDisplayLanguage(language);
    } catch (error) {
      console.warn('Failed to load language preference:', error);
    }
  };

  useEffect(() => {
    loadLanguageSettings();
  }, []);

  return <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: '#00b0f6'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  />;
}
