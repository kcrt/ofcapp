import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface HeaderBackButtonProps {
    color?: string;
    size?: number;
    destination?: string;
}

export default function HeaderBackButton({ color = "black", size = 24, destination = '/' }: HeaderBackButtonProps) {
    const router = useRouter();

    return (
        <TouchableOpacity onPress={() => router.replace(destination)} style={styles.button}>
            <Ionicons name="arrow-back" size={size} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginLeft: 10,
    },
});
