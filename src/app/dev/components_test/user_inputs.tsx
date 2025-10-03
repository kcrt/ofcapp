import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import UserInputs from '@/components/UserInputs';
import { InputItemType } from '@/appdata/formulas.zod';

export default function UserInputsTest() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    age: 5,
    sex: false,
    IgE: 100,
    sIgE_egg: 10.0,
    proteindose: 100,
    atopic: false,
  });

  const testInputs: InputItemType[] = [
    {
      type: 'proteindose',
      name: 'proteindose',
      caption: { en: 'Heated egg white protein dose', ja: '加熱卵白タンパク量' },
      items: [
        ['1/32 egg', 100],
        ['1/16 egg', 200],
        ['1/8 egg', 400],
        ['1/4 egg', 800],
        ['1/2 egg', 1600],
        ['1 egg', 3200],
      ],
    },
    {
      type: 'age',
      name: 'age',
      min: 0,
      max: 18,
    },
    {
      type: 'sex',
      name: 'sex',
    },
    {
      type: 'IgE',
      name: 'IgE',
      min: 0,
      max: 10000,
    },
    {
      type: 'sIgE',
      name: 'sIgE_egg',
      caption: { en: 'Egg white sIgE', ja: '卵白特異的IgE' },
      min: 0,
      max: 100,
    },
    {
      type: 'boolean',
      name: 'atopic',
      caption: { en: 'Atopic dermatitis', ja: 'アトピー性皮膚炎' },
    }
  ];

  const handleValueChange = (name: string, value: string | number | boolean) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>UserInputs Component Test</Text>

      <View style={styles.section}>
        <UserInputs
          inputs={testInputs}
          currentValues={values}
          onValueChange={handleValueChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Values</Text>
        <View style={styles.valuesContainer}>
          {Object.entries(values).map(([key, value]) => (
            <Text key={key} style={styles.valueText}>
              {key}: {String(value)}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Out of Range Test</Text>
        <UserInputs
          inputs={[
            {
              type: 'age',
              name: 'age_test',
              min: 0,
              max: 18,
            },
          ]}
          currentValues={{ age_test: 25 }}
          onValueChange={handleValueChange}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  valuesContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 4,
  },
  valueText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    marginBottom: 4,
  },
});