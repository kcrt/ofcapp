import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, Modal, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InputItemType } from '@/appdata/formulas.zod';
import { getDisplayString, MultilangString } from '@/utils/i18n';

const defaultLabels: Record<string, MultilangString | string> = {
  age: "@Age",
  IgE: "IgE",
  sIgE: "@Specific IgE",
  proteindose: "@Protein dose",
  sex: "@Sex"
};
const defaultUnits: Record<string, MultilangString | string> = {
  age: "@years_age",
  IgE: "IU/L",
  sIgE: "kUA/L",
  proteindose: "mg"
}

interface UserInputsProps {
  inputs: InputItemType[];
  currentValues: Record<string, string | number | boolean>;
  onValueChange: (name: string, value: string | number | boolean) => void;
}

export default function UserInputs({ inputs, currentValues, onValueChange }: UserInputsProps) {
  const renderInput = (input: InputItemType) => {
    const value = currentValues[input.name];

    const label = "caption" in input ? getDisplayString(input.caption) : 
                defaultLabels[input.type] ? getDisplayString(defaultLabels[input.type]) :
                input.name;
    const unit = "unit" in input ? getDisplayString(input.unit) :
                defaultUnits[input.type] ? getDisplayString(defaultUnits[input.type]) :
                '';

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
        return (
          <View key={input.name} style={styles.inputRow}>
            <Text style={styles.label}>{label}:</Text>
            {/* This container ensures the input field and unit take up remaining space consistently */}
            <View style={styles.inputAndUnitContainer}>
              <TextInput
                style={[styles.input, unit ? styles.inputWithUnit : {}]}
                value={String(value ?? '')}
                onChangeText={(text) => onValueChange(input.name, text)}
                keyboardType="numeric"
              />
              {unit && (
                <View style={styles.unitDisplayBox}>
                  <Text style={styles.unitDisplayText}>{unit}</Text>
                </View>
              )}
            </View>
          </View>
        );
      case 'proteindose': {
        const [modalVisible, setModalVisible] = useState(false);
        const currentValue = value !== undefined ? String(value) : '';
        const items = Array.isArray(input.items) ? input.items : [];

        return (
          <View key={input.name} style={styles.factorRow}>
            <Text style={styles.label}>{label}:</Text>
            <View style={styles.inputWithButtonContainer}>
              <TextInput
                style={[styles.input, styles.inputWithUnit]}
                value={currentValue}
                onChangeText={(text) => onValueChange(input.name, text)}
                keyboardType="numeric"
                placeholder="e.g. 100"
              />
              {unit && (
                <View style={styles.unitDisplayBox}>
                  <Text style={styles.unitDisplayText}>{unit}</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.modalOpenButtonChained}
                onPress={() => setModalVisible(true)}
              >
                <MaterialCommunityIcons name="menu-down" size={24} color="#333" />
              </TouchableOpacity>
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
      default:
        console.warn(`Unsupported input type: ${input.type} for ${input.name}`);
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
  inputRow: { // For rows with a label and a direct input control (e.g. age, IgE, sIgE)
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  factorRow: { // Used for rows where label and control are spaced apart (e.g., sex, proteindose)
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
    width: 130, // Ensures all labels have consistent width for alignment
  },
  input: {
    flex: 1, // Allows input to expand within its parent container
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 16,
    minHeight: 40, // Ensures a minimum touch target height
  },
  inputAndUnitContainer: { // Groups TextInput and its unit, allowing them to flex together
    flex: 1, // Takes remaining horizontal space in the row
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWithUnit: {
    borderTopRightRadius: 0, // To seamlessly join with the unit box
    borderBottomRightRadius: 0, // To seamlessly join with the unit box
  },
  inputWithButtonContainer: { // Groups TextInput, unit, and dropdown button for proteindose
    flex: 1, // Ensures this group takes available space next to the label
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOpenButtonChained: { // For the dropdown button in the proteindose input
    padding: 8,
    marginLeft: 0, // Aligns directly next to the input field or unit
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1, // Visually separates from the input field
    borderColor: '#ccc',
    height: 40, // Matches input height for alignment
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderTopRightRadius: 0, // Part of a chained group of components
    borderBottomRightRadius: 0, // Part of a chained group of components
  },
  sexButton: {
    flex: 1, // Allows the button to fill available space next to the label
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: { // For rows containing a label and a Switch component
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes label and switch to opposite ends
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  // Modal Styles
  modalOverlay: { // Covers the screen behind the modal
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dims the background to focus on the modal
  },
  modalContentView: { // The main container for modal content
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'stretch', // Ensures content like the title and items use available width
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Android shadow
    width: '80%', // Defines the modal's width relative to the screen
    maxHeight: '70%', // Prevents modal from being too tall on smaller screens
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: { // Individual selectable item in the modal
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Light separator line
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: { // Button to dismiss the modal
    marginTop: 20,
    backgroundColor: '#007AFF', // Standard blue for actions
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center', // Centers the button
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unitDisplayBox: { // Container for displaying the unit next to an input
    backgroundColor: '#f0f0f0', // Provides visual separation for the unit
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    height: 40, // Matches input height for alignment
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  unitDisplayText: {
    fontSize: 16,
    color: '#555', // Standard text color for units
  },
});
