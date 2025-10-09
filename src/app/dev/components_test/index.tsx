import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import SquareButton from '@/components/SquareButton';
import StackScreenWithMenu from '@/components/StackScreenWithMenu';

export default function ComponentsTestIndex() {
  return (
    <>
      <StackScreenWithMenu options={{ title: 'Component Tests' }} />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Component Tests</Text>
        <Text style={styles.subtitle}>Select a component to test</Text>

        <View style={styles.buttonGrid}>
          <Link href="/dev/components_test/square_button" asChild>
            <SquareButton title="SquareButton" iconName="Ionicons.cube" />
          </Link>

          <Link href="/dev/components_test/user_inputs" asChild>
            <SquareButton title="UserInputs" iconName="Ionicons.list" />
          </Link>
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
    marginBottom: 10,
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666666',
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
});
