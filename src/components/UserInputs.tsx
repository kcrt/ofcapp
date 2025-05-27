import React from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Added for sex input
import { InputItemType } from '@/appdata/formulas.zod'; // Using @ alias for src

interface UserInputsProps {
  inputs: InputItemType[];
  currentValues: Record<string, string | number | boolean>; // input.name is the key
  onValueChange: (name: string, value: string | boolean) => void;
}

export default function UserInputs({ inputs, currentValues, onValueChange }: UserInputsProps) {
  const renderInput = (input: InputItemType) => {
    const value = currentValues[input.name];
    // Use caption if available, otherwise use name. For boolean, caption is mandatory.
    const label = 'caption' in input ? input.caption : input.name;

    switch (input.type) {
      case 'boolean':
        return (
          <View key={input.name} style={styles.switchRow}>
            <Text style={styles.label}>{label}:</Text>
            <Switch
              value={Boolean(value)}
              onValueChange={(newValue) => onValueChange(input.name, newValue)}
            />
          </View>
        );
      case 'sex':
        return (
          <View key={input.name} style={styles.factorRow}>
            <Text style={styles.label}>{label}:</Text>
            <TouchableOpacity
              onPress={() => onValueChange(input.name, !value)}
              style={styles.sexButton}
            >
              <MaterialCommunityIcons
                name={value ? "gender-female" : "gender-male"}
                size={24}
                color={value ? "#E91E63" : "#2196F3"} // Pink for female, Blue for male
              />
            </TouchableOpacity>
          </View>
        );
      case 'age':
      case 'IgE':
      case 'sIgE':
      default: // Default to text input for other types or if type is a generic string
        let keyboardType: 'default' | 'numeric' = 'default';
        if (input.type === 'age' || input.type === 'IgE' || input.type === 'sIgE') {
          keyboardType = 'numeric';
        }
        return (
          <View key={input.name} style={styles.inputRow}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              style={styles.input}
              value={String(value ?? '')} // Handle undefined/null initial values
              onChangeText={(text) => onValueChange(input.name, text)}
              keyboardType={keyboardType}
            />
            {/* Unit is not part of InputItemType, can be added to Zod if needed */}
            {/* {'unit' in input && input.unit && <Text style={styles.unit}>{input.unit}</Text>} */}
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {inputs.map(renderInput)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  // Copied factorRow from [modelname].tsx for consistency, can be merged/refactored with inputRow if identical
  factorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    // borderBottomWidth: 1, // Optional: if you want lines between items
    // borderBottomColor: '#eee',
    paddingHorizontal: 5, // Added for consistency
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    minWidth: 100, // Adjust as needed
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  unit: {
    fontSize: 16,
    marginLeft: 5,
  },
  sexButton: { // Copied from [modelname].tsx
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  // Added style for switch row if needed for different alignment
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Example: push switch to the right
    marginBottom: 10,
    paddingHorizontal: 5,
  }
});
