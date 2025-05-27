import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

interface ErrorMessagePageProps {
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconSize?: number;
  iconColor?: string;
  message: string;
  title?: string;
  containerStyle?: object;
  iconStyle?: object;
  textStyle?: object;
}

export default function ErrorMessagePage({
  iconName = "emoticon-cry-outline",
  iconSize = 64,
  iconColor = "black",
  message,
  title = "Error",
  containerStyle,
  iconStyle,
  textStyle,
}: ErrorMessagePageProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Stack.Screen options={{ title }} />
      <MaterialCommunityIcons
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={[styles.icon, iconStyle]}
      />
      <Text style={[styles.messageText, textStyle]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff', // Added background color for consistency
  },
  icon: {
    marginBottom: 20,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
