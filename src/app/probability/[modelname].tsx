import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Button } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

// Define a maximum width for the page content
const PAGE_MAX_WIDTH = 600;
import formulas from '@/utils/formulas';
import ErrorMessagePage from '@/components/ErrorMessagePage';
import GraphArea from '@/components/GraphArea'; // Import the new component
import FactorInputController from '@/components/FactorInputController'; // Import the new FactorInputController component
import { type InputItemType as FormulaInputSchema } from '@/appdata/formulas.zod';
import { getDisplayString } from '@/utils/i18n';
import { parseReferenceLink, openLink } from '@/utils/links';
import { calculateAdjustedIntercept } from '@/utils/calculationHelpers'; // Import the new helper
import logistic from '@/utils/mathHelpers'; // Import the logistic function

// Component for selecting the primary factor
interface PrimaryFactorSelectorProps {
  primaryFactorCandidates: FormulaInputSchema[];
  selectedPrimaryFactorName?: string;
  onSelectPrimaryFactor: (name: string) => void;
}

function PrimaryFactorSelector({
  primaryFactorCandidates,
  selectedPrimaryFactorName,
  onSelectPrimaryFactor,
}: PrimaryFactorSelectorProps) {
  if (primaryFactorCandidates.length <= 1) {
    return null; // No need to select if only one or none
  }
  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.selectorLabel}>Select Primary Factor:</Text>
      <View style={styles.selectorButtons}>
        {primaryFactorCandidates.map(input => (
          <TouchableOpacity
            key={input.name}
            style={[
              styles.selectorButton,
              selectedPrimaryFactorName === input.name && styles.selectorButtonActive
            ]}
            onPress={() => onSelectPrimaryFactor(input.name)}
          >
            <Text 
              style={[
                styles.selectorButtonText,
                selectedPrimaryFactorName === input.name && styles.selectorButtonTextActive
              ]}
            >
              {getDisplayString('caption' in input && input.caption ? input.caption : input.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
  


export default function ProbabilityCurvePage() {

  const { modelname } = useLocalSearchParams<{ modelname: string }>();
  const model = formulas.find(f => f.name === modelname);
  if (!model) {
    return (
      <ErrorMessagePage
        title="Model Not Found"
        message={`Model not found: ${modelname}`}
      />
    );
  }
  const displayModelTitle = getDisplayString(model.shorttitle);

  const primaryFactorCandidates = useMemo(() => {
    if (!model) return [];
    return model.inputs.filter(
      input => (input.type === 'sIgE' || input.type === 'proteindose')
    );
  }, [model]);

  const [selectedPrimaryFactorName, setSelectedPrimaryFactorName] = useState<string | undefined>(() => {
    // Initialize with the first primary factor candidate if available
    const sIgECandidate = primaryFactorCandidates.find(input => input.type === 'sIgE' && input.mode === 'primary');
    if (sIgECandidate) {
      return sIgECandidate.name;
    } else if (primaryFactorCandidates.length > 0) {
      return primaryFactorCandidates[0].name;
    }
    return undefined;
  });
  const primaryInput = useMemo(() => {
    if (!model || !selectedPrimaryFactorName) return undefined;
    return model.inputs.find(input => input.name === selectedPrimaryFactorName);
  }, [model, selectedPrimaryFactorName]);
  if (!primaryInput) {
    return (
      <ErrorMessagePage
        title="Configuration Error"
        message={`No suitable primary factor (sIgE or proteindose) found or selected for model: ${modelname}`}
        iconName="alert-circle-outline"
      />
    );
  }
  
  const [factorValues, setFactorValues] = useState<{[key: string]: any}>({});
  const handleFactorChange = useCallback((name: string, value: any) => {
    setFactorValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const primaryBetaKey = `Log${primaryInput.name}`;
  const primaryBetaValue = model.output.result.beta[primaryBetaKey];

  const [calculatedPoint, setCalculatedPoint] = useState<{ x: number; y: number } | null>(null);

  const { minXValue, maxXValue, xAxisLabelsNumber } = useMemo(() => {
    if (!primaryInput) return { minXValue: 0, maxXValue: 1 };
    switch (primaryInput.type) {
      case 'sIgE':
        return { minXValue: -2, maxXValue: 3, xAxisLabelsNumber: 5 }; // Log10(0.01) to Log10(1000)
      case 'proteindose':
        return { minXValue: 0, maxXValue: 4, xAxisLabelsNumber: 4 }; // Log10(1) to Log10(10000)
      default:
        console.warn(`Unsupported primary input type: ${primaryInput.type}`);
        return { minXValue: 0, maxXValue: 1, xAxisLabelsNumber: 5 }; // Fallback for unsupported types
    }
  }, [primaryInput]);

  const adjustedIntercept = useMemo(() => {
    if (!model || !factorValues || Object.keys(factorValues).length === 0 || !primaryInput) return 0;
    return calculateAdjustedIntercept(model, factorValues, primaryInput.name);
  }, [model, factorValues, primaryInput]);

  // Calculate target proability based on current factor values
  useEffect(() => {
    if (!primaryInput || !isFinite(primaryBetaValue) || !isFinite(adjustedIntercept)) {
      setCalculatedPoint(null);
      return;
    }

    const primaryFactorValueString = factorValues[primaryInput.name];
    const parsedPrimaryFactorValue = parseFloat(primaryFactorValueString);

    if (!isNaN(parsedPrimaryFactorValue) && parsedPrimaryFactorValue > 0) {
      const logPrimaryFactorValue = Math.log10(parsedPrimaryFactorValue);
      const probability = logistic(adjustedIntercept, primaryBetaValue, logPrimaryFactorValue);
      setCalculatedPoint({ x: logPrimaryFactorValue, y: probability });
    } else {
      setCalculatedPoint(null);
    }
  }, [factorValues, primaryInput, adjustedIntercept, primaryBetaValue, minXValue, maxXValue]);

  // Generate points for the graph
  const points = useMemo(() => {
    if (!primaryInput || !isFinite(adjustedIntercept) || !isFinite(primaryBetaValue)) return [];
    const pts = [];
    const numPoints = 50; // 50 is enough
    for (let i = 0; i <= numPoints; i++) {
      const xValue = minXValue + (i / numPoints) * (maxXValue - minXValue);
      const probability = logistic(adjustedIntercept, primaryBetaValue, xValue);
      pts.push({ x: xValue, y: probability });
    }
    return pts;
  }, [adjustedIntercept, primaryBetaValue, minXValue, maxXValue, primaryInput]);

  const chartHeight = 300;
  const chartPadding = 50; 
  const actualDeviceWidth = Dimensions.get('window').width;
  const screenWidthForGraph = Math.min(actualDeviceWidth, PAGE_MAX_WIDTH) - (2 * 10); 

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContentContainer}>
      <Stack.Screen options={{ title: displayModelTitle }} />
      
      <PrimaryFactorSelector
        primaryFactorCandidates={primaryFactorCandidates}
        selectedPrimaryFactorName={selectedPrimaryFactorName}
        onSelectPrimaryFactor={setSelectedPrimaryFactorName}
      />

      {model.output.result.graph !== "hide" && primaryInput && (
      <GraphArea
        points={points}
        minXValue={minXValue} // Use generic minXValue
        maxXValue={maxXValue} // Use generic maxXValue
        xAxisLabelsNumber={xAxisLabelsNumber} // Use generic xAxisLabelsNumber
        highlightPoint={calculatedPoint}
        chartHeight={chartHeight}
        chartPadding={chartPadding}
        screenWidth={screenWidthForGraph}
        xAxisTitle={getDisplayString('caption' in primaryInput ? primaryInput.caption : primaryInput.name)}
        // Note: GraphArea might need to be updated to accept minXValue, maxXValue, and xAxisLabel
      />
      )}


      {calculatedPoint && (
        <Text style={styles.probabilityText}>
          Probability of failing OFC is: {(calculatedPoint.y * 100).toFixed(1)}%
        </Text>
      )}
      
      {model.inputs.length > 0 && (
        <View style={styles.controlsContainer}>
          <Text style={styles.subTitle}>Adjust factors:</Text>
          <FactorInputController
            modelInputs={model.inputs}
            setFactorValuesState={setFactorValues}
            currentFactorValues={factorValues}
            onFactorValueChange={handleFactorChange}
          />
         <Text style={styles.subTitleNote}>Curve adjusted for the factors set above.</Text>
        </View>
      )}
      
      {model.note && (
        <View style={styles.infoSection}>
          <Text style={styles.subTitle}>Note</Text>
          <Text style={styles.infoText}>{getDisplayString(model.note)}</Text>
        </View>
      )}

      {Object.keys(model.references).length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.subTitle}>References</Text>
          {Object.entries(model.references).map(([key, value]) => {
            const url = parseReferenceLink(value);
            return (
              <TouchableOpacity key={key} onPress={() => openLink(url)}>
                <Text style={styles.linkText}>
                  {key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContentContainer: {
    alignItems: 'center',
    paddingTop: 10, // Reduced top padding
    paddingBottom: 40,
    paddingHorizontal: 10, // This padding is accounted for in screenWidthForGraph
    maxWidth: PAGE_MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  selectorContainer: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  selectorLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  selectorButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  selectorButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  selectorButtonActive: {
    backgroundColor: '#007AFF',
  },
  selectorButtonText: {
    color: '#007AFF',
    fontSize: 13,
  },
  selectorButtonTextActive: {
    color: '#ffffff',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10, // Reduced margin
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  probabilityText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10, // Reduced margin
    color: '#007AFF',
  },
  subTitleNote: {
    fontSize: 12,
    marginTop: 5, // Added margin top for spacing
    marginBottom: 10, // Reduced margin
    textAlign: 'center',
    color: 'dimgray',
  },
  controlsContainer: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    maxWidth: 500,
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'left',
    color: '#333',
  },
  linkText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginBottom: 5,
  }
});
