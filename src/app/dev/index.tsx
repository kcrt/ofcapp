import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const devPages = [
  {
    title: 'Component Tests',
    description: 'Test various UI components',
    href: '/dev/components_test',
    iconName: 'construct-outline' as keyof typeof Ionicons.glyphMap,
  },
];

export default function DevIndex() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Development Tools</Text>

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