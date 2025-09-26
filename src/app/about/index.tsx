import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
import { Stack, router } from "expo-router";
import { useState } from "react";
import HeaderBackButton from "@/components/HeaderBackButton";
import Constants from 'expo-constants';
import packageJson from '@/../package.json';

export default function About() {
    const appName = Constants.expoConfig?.name || 'OFCApp';
    const appVersion = packageJson.version || '0.0.0';
    const appDescription = Constants.expoConfig?.description || 'Thank you for using our app!';
    const [clickCount, setClickCount] = useState(0);

    const handleIconClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);

        if (newCount === 20) {
            router.push('/dev');
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: `About ${appName}`,
                }}
            />
            <TouchableWithoutFeedback onPress={handleIconClick}>
                <Image source={require('@/../assets/images/icon.png')} style={styles.logo} />
            </TouchableWithoutFeedback>
            <Text style={styles.title}>{appName}</Text>
            <Text style={styles.version}>Version {appVersion}</Text>
            <Text style={styles.description}>
                {appDescription}
            </Text>
            <Text style={styles.footer}>© {new Date().getFullYear()} Kyohei Takahashi, NHO Sagamihara Hospital {appName} Team</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    version: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#444',
        marginBottom: 30,
        lineHeight: 24,
    },
    footer: {
        fontSize: 12,
        color: '#888',
        position: 'absolute',
        bottom: 20,
    }
});
