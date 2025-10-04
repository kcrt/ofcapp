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
      case 'sIgE': {
        // Check if numeric input is outside valid range
        const isOutOfRange = ('min' in input || 'max' in input) && value !== undefined && value !== '' && (() => {
          const numValue = parseFloat(String(value));
          if (!isNaN(numValue)) {
            const min = 'min' in input && typeof input.min === 'number' ? input.min : -Infinity;
            const max = 'max' in input && typeof input.max === 'number' ? input.max : Infinity;
            return numValue < min || numValue > max;
          }
          return false;
        })();

        return (
          <View key={input.name} style={styles.inputColumn}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>{label}:</Text>
              <View style={styles.inputAndUnitContainer}>
                <TextInput
                  style={[
                    styles.input,
                    unit ? styles.inputWithUnit : {},
                    isOutOfRange ? styles.inputOutOfRange : {}
                  ]}
                  value={String(value ?? '')}
                  onChangeText={(text) => onValueChange(input.name, text)}
                  keyboardType="decimal-pad"
                />
                {unit && (
                  <View style={styles.unitDisplayBox}>
                    <Text style={styles.unitDisplayText}>{unit}</Text>
                  </View>
                )}
              </View>
            </View>
            {isOutOfRange && (
              <Text style={styles.warningText}>
                ⚠️ {getDisplayString('@Value outside recommended range')} ({('min' in input && typeof input.min === 'number') ? input.min : '?'}-{('max' in input && typeof input.max === 'number') ? input.max : '?'} {unit || ''})
              </Text>
            )}
          </View>
        );
      }
      case 'proteindose': {
        const [modalVisible, setModalVisible] = useState(false);
        const currentValue = value !== undefined ? String(value) : '';
        const items = Array.isArray(input.items) ? input.items : [];

        return (
          <View key={input.name} style={styles.inputColumn}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>{label}:</Text>
              <View style={styles.inputWithButtonContainer}>
                <TextInput
                  style={[styles.input, styles.inputWithUnit]}
                  value={currentValue}
                  onChangeText={(text) => onValueChange(input.name, text)}
                  keyboardType="decimal-pad"
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
                  <MaterialCommunityIcons name="menu-down" size={20} color="#333" />
                </TouchableOpacity>
              </View>
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
                        <Text style={styles.modalItemText}>{`${getDisplayString(itemLabel)} (${itemValue} mg)`}</Text>
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
  inputColumn: {
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 16,
    marginRight: 8,
    width: 95,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 16,
    minHeight: 40,
  },
  inputAndUnitContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  inputWithUnit: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputWithButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  modalOpenButtonChained: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginLeft: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    flexShrink: 0,
  },
  sexButton: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxHeight: '70%',
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
  unitDisplayBox: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
    flexShrink: 0,
  },
  unitDisplayText: {
    fontSize: 14,
    color: '#555',
  },
  inputOutOfRange: {
    borderColor: '#FF8C00',
    borderWidth: 2,
    backgroundColor: '#FFF8DC',
  },
  warningText: {
    fontSize: 12,
    color: '#FF8C00',
    marginTop: 4,
    paddingLeft: 103,
    fontStyle: 'italic',
  },
});
