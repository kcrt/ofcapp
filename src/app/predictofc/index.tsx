import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import formulas, { type Formula } from '@/utils/formulas';
import { getDisplayString as t } from '@/utils/i18n';

export default function ProbabilityPage() {
  const renderItem = ({ item }: { item: Formula }) => (
    <Link href={`/predictofc/${item.name}`} asChild>
      <TouchableOpacity style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{t(item.title)}</Text>
        {/*<Text style={styles.itemShortTitle}>{t(item.shorttitle)}</Text>*/}
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('@PredictOFC') }} />
      <Text style={styles.header}>{t('@AvailableCurves')}</Text>
      <FlatList
        data={formulas.filter((f) => f.output.mode === "ofc" || f.output.mode === "ed")}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android shadow
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  itemShortTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
