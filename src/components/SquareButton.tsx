import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Platform, View, Dimensions, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const defaultButtonSize = 128;
const marginSize = 10;

interface SquareButtonProps {
  title: string;
  href?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
}

export default function SquareButton({ title, href, iconName, size, disabled, onPress }: SquareButtonProps) {
  const currentButtonSize = size || defaultButtonSize;
  const buttonContent = (
    <TouchableOpacity
      style={{...styles.button, ...{width: currentButtonSize, height: currentButtonSize}}}
      disabled={disabled}
      onPress={onPress}
    >
      <Ionicons name={iconName} size={currentButtonSize * 0.4} color={disabled ? "#aaaaaa" : "#333333"} />
      <Text style={[styles.buttonText, disabled && styles.disabledButtonText]}>{title}</Text>
    </TouchableOpacity>
  );

  if (disabled) {
    return buttonContent;
  } else if (onPress) {
    return buttonContent;
  } else if (href) {
    return (
      <Link push href={href} asChild>
        {buttonContent}
      </Link>
    );
  } else {
    return buttonContent;
  }
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
});
