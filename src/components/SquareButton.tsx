import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Platform, View, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import * as Icons from '@expo/vector-icons';

const defaultButtonSize = 128;
const marginSize = 10;

export interface SquareButtonProps {
  title: string;
  href?: string;
  iconName: string; // Format: "IconFamily.icon-name" e.g., "Ionicons.apps-outline"
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
  mode?: 'demo' | 'beta' | 'important' | 'new' | 'current';
}

// see `https://icons.expo.fyi/Index` to find icon

export default function SquareButton({ title, href, iconName, size, disabled, onPress, mode }: SquareButtonProps) {
  const currentButtonSize = size || defaultButtonSize;

  const [iconFamily, iconNameOnly] = iconName.split('.');
  const IconComponent = Icons[iconFamily as keyof typeof Icons] as any;

  const buttonInnerContent = (
    <>
      <IconComponent name={iconNameOnly} size={currentButtonSize * 0.4} color={disabled ? "#aaaaaa" : "#333333"} />
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>{title}</Text>
    </>
  );

  const buttonContent = (
    <View style={{position: 'relative'}}>
      {href && !disabled ? (
        <Link push href={href} asChild>
          <Pressable
            style={{...styles.button, ...{width: currentButtonSize, height: currentButtonSize}}}
          >
            {buttonInnerContent}
          </Pressable>
        </Link>
      ) : href && disabled ? (
        <View style={{...styles.button, ...{width: currentButtonSize, height: currentButtonSize}}}>
          {buttonInnerContent}
        </View>
      ) : (
        <TouchableOpacity
          style={{...styles.button, ...{width: currentButtonSize, height: currentButtonSize}}}
          disabled={disabled}
          onPress={onPress}
        >
          {buttonInnerContent}
        </TouchableOpacity>
      )}
      {mode && (
        <View style={[
          styles.ribbon,
          mode === 'demo' && styles.demoRibbon,
          mode === 'beta' && styles.betaRibbon,
          mode === 'important' && styles.importantRibbon,
          mode === 'new' && styles.newRibbon,
          mode === 'current' && styles.currentRibbon,
        ]}>
          <Text style={[
            styles.ribbonText,
            mode === 'demo' && styles.demoText,
            mode === 'beta' && styles.betaText,
            mode === 'important' && styles.importantText,
            mode === 'new' && styles.newText,
            mode === 'current' && styles.currentText,
          ]}>
            {mode.toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );

  return buttonContent;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    margin: marginSize,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    fontSize: 14, // Adjusted for potentially smaller space
    color: '#333333',
    textAlign: 'center',
    marginTop: 8, // Space between icon and text
  },
  disabledButtonText: {
    color: '#aaaaaa',
  },
  ribbon: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    transform: [{ rotate: '15deg' }],
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  demoRibbon: {
    backgroundColor: '#FFD700',
    borderColor: '#000000',
  },
  betaRibbon: {
    backgroundColor: '#4A90E2',
    borderColor: '#2C5282',
  },
  importantRibbon: {
    backgroundColor: '#E53E3E',
    borderColor: '#C53030',
  },
  newRibbon: {
    backgroundColor: '#38A169',
    borderColor: '#2F855A',
  },
  currentRibbon: {
    backgroundColor: '#4A90E2',
    borderColor: '#2C5282',
  },
  ribbonText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  demoText: {
    color: '#000000',
  },
  betaText: {
    color: '#FFFFFF',
  },
  importantText: {
    color: '#FFFFFF',
  },
  newText: {
    color: '#FFFFFF',
  },
  currentText: {
    color: '#FFFFFF',
  },
});
