import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

const LandingScreen = ({ navigation }) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            {/* Top Image */}
            <Image source={require('../../assets/landing.png')} style={styles.image} resizeMode="contain" />

            {/* Text Section */}
            <Text variant="titleLarge" style={[styles.title, { color: theme.colors.primary }]}>
                Manage Your Customers' Measurements Easily
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
                Save and access customer measurements anytime, anywhere.
            </Text>

            {/* Buttons Section */}
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginButton}
                    buttonColor={theme.colors.primary}
                >
                    Login
                </Button>
                <Button mode="outlined" onPress={() => navigation.navigate('Signup')} style={styles.registerButton}>
                    Register
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: 250,
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
    subtitle: {
        textAlign: 'center',
        color: 'gray',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    loginButton: {
        flex: 1,
        marginRight: 10,
        borderRadius: 8,
    },
    registerButton: {
        flex: 1,
        borderRadius: 8,
    },
});

export default LandingScreen;
