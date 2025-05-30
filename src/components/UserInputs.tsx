import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Added for sex input
import { InputItemType } from '@/appdata/formulas.zod'; // Using @ alias for src
import { getDisplayString } from '@/utils/i18n';

interface UserInputsProps {
  inputs: InputItemType[];
  currentValues: Record<string, string | number | boolean>; // input.name is the key
  onValueChange: (name: string, value: string | number | boolean) => void; // Allow number for proteindose
}

export default function UserInputs({ inputs, currentValues, onValueChange }: UserInputsProps) {
  const renderInput = (input: InputItemType) => {
    const value = currentValues[input.name];
    // Use caption if available, otherwise use name. For boolean, caption is mandatory.
    const label = 'caption' in input && input.caption ? getDisplayString(input.caption) : input.name;

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
      case 'proteindose': {
        const [modalVisible, setModalVisible] = useState(false);
        const currentValue = value !== undefined ? String(value) : '';
        // Ensure input.items is an array and has the expected tuple structure
        const items = Array.isArray(input.items) ? input.items : [];

        return (
          <View key={input.name} style={styles.factorRow}>
            <Text style={styles.label}>{label}:</Text>
            <View style={styles.inputWithButtonContainer}>
              <TextInput
                style={styles.input}
                value={currentValue}
                onChangeText={(text) => onValueChange(input.name, text)}
                keyboardType="numeric"
                placeholder="e.g. 100"
              />
              <TouchableOpacity
                style={styles.modalOpenButton}
                onPress={() => setModalVisible(true)}
              >
                <MaterialCommunityIcons name="menu-down" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.unit}>mg</Text>
            </View>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                <View style={styles.modalContentView}>
                  <Text style={styles.modalTitle}>Select Dose for {label}</Text>
                  <ScrollView>
                    {items.map(([itemLabel, itemValue], index) => (
                      <TouchableOpacity
                        key={`${input.name}-modal-item-${index}`}
                        style={styles.modalItem}
                        onPress={() => {
                          onValueChange(input.name, itemValue); // Pass numeric value
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalItemText}>{`${itemLabel} (${itemValue} mg)`}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalCloseButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </Modal>
          </View>
        );
      }
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
  factorRow: { // Retained for consistency, used by proteindose now
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    minWidth: 100, // Adjust as needed for label width
    // flex: 0.4, // Example: give label a fixed proportion
  },
  input: {
    flex: 1, // Input field takes most space in its container
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 16,
    minHeight: 40,
  },
  inputWithButtonContainer: {
    flex: 1, // This container takes the remaining space in factorRow
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1, // For debugging layout
    // borderColor: 'red',
  },
  modalOpenButton: {
    padding: 8,
    marginLeft: 0, // No margin, input border and button border should touch or be close
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    height: 40, // Match input height
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  unit: {
    fontSize: 16,
    marginLeft: 8,
    color: '#555',
  },
  sexButton: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContentView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'stretch', // Stretch items to fill width
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Modal width
    maxHeight: '70%', // Modal max height
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
