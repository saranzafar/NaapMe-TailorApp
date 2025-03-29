import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';

const CheckEmailScreen = ({ navigation }) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.primary }]}>Check Your Email</Text>
            <Text style={[styles.subtitle, { color: colors.secondary }]}>
                We've sent you a password reset link. Please check your inbox and follow the instructions.
            </Text>

            <Button
                mode="contained"
                onPress={() => navigation.navigate('Login')}
                style={[styles.button, { backgroundColor: colors.primary }]}
            >
                Back to Login
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        marginTop: 20,
        width: '80%',
    },
});

export default CheckEmailScreen;
