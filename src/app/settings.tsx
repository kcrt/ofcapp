import { View, Text, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import SquareButton from '@/components/SquareButton';
import { getDisplayLanguage, getDisplayString, getSupportedLanguages, setDisplayLanguage } from '@/utils/i18n';
import { useRouter } from 'expo-router';
import { SettingsManager } from '@/utils/settings';
import { Picker } from '@react-native-picker/picker';

export default function Settings() {
  const router = useRouter();

  const handleLanguageSelection = async (language: string) => {
    try {
      await SettingsManager.setLanguage(language);
      setDisplayLanguage(language);
      // reload the app to apply the language change
      router.replace('/settings');
    } catch (error) {
      console.warn('Failed to store language preference:', error);
    }
  };
  const languages = getSupportedLanguages();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: getDisplayString('@Settings') || 'Settings' }} />

      <Text style={styles.sectionTitle}>
        {getDisplayString('@Language') || 'Language'}
      </Text>
      <Text>{getDisplayString('@CurrentLanguage') || 'Current Language'}: {getDisplayLanguage()} ( {getDisplayString('@LanguageName')} )</Text>

      <Picker
        selectedValue={getDisplayLanguage()}
        onValueChange={(itemValue) => {handleLanguageSelection(itemValue)}}
        style={styles.picker}
        itemStyle={styles.pickerItem}
      >
        {languages.map((lang) => (
          <Picker.Item key={lang} label={`${getDisplayString('@LanguageName', lang)} ( ${lang} )`} value={lang} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  picker: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    ...Platform.select({
      web: {
        minHeight: 50,
        fontSize: 16,
        padding: 10,
        border: '1px solid #ddd',
      },
      default: {
        height: 50,
      }
    })
  },
  pickerItem: Platform.select({
    ios: {
      fontSize: 16,
      height: 100,
    },
    default: {}
  })
});