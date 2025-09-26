import { View, StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import SquareButton from '@/components/SquareButton';
import { Ionicons } from '@expo/vector-icons';
import { getDisplayString, MultilangString } from '@/utils/i18n';

const buttons: { title: MultilangString; href: string; disabled?: boolean, iconName: keyof typeof Ionicons.glyphMap, mode?: string}[] = [
  { title: '@Today', href: '/today', iconName: 'calendar-outline', mode: "demo" },
  { title: '@All', href: '/all', iconName: 'apps-outline', disabled: true },
  { title: '@PredictOFC', href: '/predictofc', iconName: 'stats-chart-outline' },
  { title: '@Information documents', href: '/info', iconName: 'document-text-outline', disabled: true },
  { title: '@Settings', href: '/settings', iconName: 'settings-outline' },
  { title: '@AboutApp', href: '/about', iconName: 'information-circle-outline' },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "OFCApp" }} />
      <FlatList
        numColumns={2}
        data={buttons}
        renderItem={({ item }) => (
          <SquareButton
            key={item.href}
            title={getDisplayString(item.title)}
            disabled={item.disabled}
            href={item.href}
            iconName={item.iconName}
            mode={item.mode}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around', // This will distribute space around items
    alignItems: 'flex-start', // Align items to the start of the cross axis
    width: '100%',
  },
});
