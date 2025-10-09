import React from 'react';
import { Stack } from 'expo-router';
import HeaderMenu from './HeaderMenu';
import type { StackNavigationOptions } from '@react-navigation/stack';

export interface StackScreenWithMenuProps {
  options?: Omit<StackNavigationOptions, 'headerRight'>;
}

export default function StackScreenWithMenu({ options }: StackScreenWithMenuProps) {
  return (
    <Stack.Screen
      options={{
        ...options,
        headerRight: ({ tintColor }) => <HeaderMenu tintColor={tintColor} />,
      }}
    />
  );
}
