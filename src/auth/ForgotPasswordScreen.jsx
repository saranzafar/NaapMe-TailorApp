import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { sendPasswordResetEmail } from '@react-native-firebase/auth';

const ForgotPasswordScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Enter a valid email');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await sendPasswordResetEmail(email);
            navigation.replace('CheckEmail'); // Navigate to next screen
        } catch (err) {
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email format.');
                    break;
                case 'auth/network-request-failed':
                    setError('Network error. Check your connection.');
                    break;
                default:
                    setError('Failed to send reset email. Try again.');
            }
        }

        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.primary }]}>Forgot Password</Text>
            <Text style={[styles.subtitle, { color: colors.secondary }]}>
                Enter your email to receive a password reset link.
            </Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                mode="outlined"
                theme={{ colors: { primary: colors.primary, background: colors.background } }}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
                mode="contained"
                onPress={handleResetPassword}
                loading={loading}
                disabled={loading}
                style={[styles.button, { backgroundColor: colors.primary }]}
            >
                Send Reset Link
            </Button>

            <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButton}>
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
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    button: {
        marginVertical: 10,
    },
    backButton: {
        marginTop: 10,
    },
});

export default ForgotPasswordScreen;
