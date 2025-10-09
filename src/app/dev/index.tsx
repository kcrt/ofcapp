import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SettingsManager, AppMode } from '@/utils/settings';
import SquareButton from '@/components/SquareButton';
import StackScreenWithMenu from '@/components/StackScreenWithMenu';

const devPages = [
  {
    title: 'Component Tests',
    description: 'Test various UI components',
    href: '/dev/components_test',
    iconName: 'construct-outline' as keyof typeof Ionicons.glyphMap,
  },
];

const modes: Array<{ mode: AppMode; icon: keyof typeof Ionicons.glyphMap }> = [
  { mode: 'normal', icon: 'person-outline' },
  { mode: 'super', icon: 'flash-outline' },
  { mode: 'god', icon: 'thunderstorm-outline' },
];

export default function DevIndex() {
  const [currentMode, setCurrentMode] = useState<AppMode>('normal');

  useEffect(() => {
    loadMode();
  }, []);

  const loadMode = async () => {
    const mode = await SettingsManager.getMode();
    setCurrentMode(mode);
  };

  const handleModeChange = async (mode: AppMode) => {
    await SettingsManager.setMode(mode);
    setCurrentMode(mode);
  };

  return (
    <>
      <StackScreenWithMenu options={{ title: 'Development Tools' }} />
      <ScrollView style={styles.container}>
      <Text style={styles.title}>Development Tools</Text>

      <View style={styles.modeSelector}>
        <Text style={styles.modeLabel}>Mode:</Text>
        <View style={styles.modeButtons}>
          {modes.map(({ mode, icon }) => (
            <View key={mode} style={styles.modeButtonWrapper}>
              <SquareButton
                title={mode}
                iconName={`Ionicons.${icon}`}
                size={90}
                onPress={() => handleModeChange(mode)}
                mode={currentMode === mode ? 'current' : undefined}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.grid}>
        {devPages.map((page, index) => (
          <Link key={index} href={page.href} style={styles.linkCard}>
            <View style={styles.card}>
              <Ionicons name={page.iconName} size={32} color="#333333" />
              <Text style={styles.cardTitle}>{page.title}</Text>
              <Text style={styles.cardDescription}>{page.description}</Text>
            </View>
          </Link>
        ))}
      </View>
    </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333',
  },
  modeSelector: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333',
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  modeButtonWrapper: {
    margin: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  linkCard: {
    width: '45%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333333',
  },
  cardDescription: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666666',
  },
});