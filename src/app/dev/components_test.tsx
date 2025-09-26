import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SquareButton from '@/components/SquareButton';

export default function ComponentsTest() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Component Tests</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SquareButton</Text>
        <View style={styles.buttonRow}>
          <SquareButton title="計算" iconName="calculator" />
          <SquareButton title="計算" iconName="calculator" mode="demo" />
          <SquareButton title="新機能" iconName="flask" mode="beta" />
          <SquareButton title="警告" iconName="warning" mode="important" />
          <SquareButton title="新着" iconName="sparkles" mode="new" />
          <SquareButton title="無効" iconName="ban" disabled />
        </View>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#555555',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});