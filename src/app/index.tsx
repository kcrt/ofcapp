import { View, StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import SquareButton, { SquareButtonProps } from '@/components/SquareButton';
import { getDisplayString, MultilangString } from '@/utils/i18n';

const buttons: { title: MultilangString; href: string; disabled?: boolean, iconName: string, mode?: SquareButtonProps["mode"] }[] = [
  // { title: '@Today', href: '/today', iconName: 'Ionicons.today-outline', disabled: true },
  // { title: '@All', href: '/all', iconName: 'Ionicons.apps-outline', disabled: true },
  { title: '@PredictOFC', href: '/predictofc', iconName: 'MaterialCommunityIcons.chart-bell-curve-cumulative' },
  { title: '@Information documents', href: '/info', iconName: 'Ionicons.document-text-outline', disabled: true },
  { title: '@AllergyExaminationAid', href: '/allergy', iconName: 'FontAwesome6.hands-holding-child', disabled: true },
  { title: '@AppQuestionnaire', href: 'https://forms.gle/axgPsMXfcsfCGkvj8', iconName: 'MaterialCommunityIcons.clipboard-edit-outline', mode: 'important' },
  { title: '@Settings', href: '/settings', iconName: 'Ionicons.settings-outline' },
  { title: '@AboutApp', href: '/about', iconName: 'Ionicons.information-circle-outline' },
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
