import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { createUserWithEmailAndPassword } from '@react-native-firebase/auth';
import auth from '../firebase/config';

const SignupScreen = ({ navigation }) => {
    const { colors } = useTheme(); // Access theme colors

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateInputs = () => {
        if (!email.trim()) { return 'Email is required'; }
        if (!/\S+@\S+\.\S+/.test(email)) { return 'Enter a valid email'; }
        if (!password.trim()) { return 'Password is required'; }
        if (password.length < 6) { return 'Password must be at least 6 characters'; }
        if (password !== confirmPassword) { return 'Passwords do not match'; }
        return null;
    };

    const handleSignup = async () => {
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.replace('Home');
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email format.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak.');
                    break;
                default:
                    setError('Signup failed. Please try again later.');
            }
        }

        setLoading(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.secondary }]}>
                Create an account so you can explore all the existing jobs
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
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: colors.primary, background: colors.background } }}
                right={
                    <TextInput.Icon
                        icon={showPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: colors.primary, background: colors.background } }}
                right={
                    <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                }
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Button
                mode="contained"
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
                style={[styles.signupButton, { backgroundColor: colors.primary }]}
            >
                Sign Up
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.createAccount, { color: colors.primary }]}>
                    Already have an account
                </Text>
            </TouchableOpacity>

            {/* OR Continue with */}
            <Text style={styles.orText}>Or sign up with</Text>
            <View style={styles.socialIcons}>
                <TouchableOpacity style={styles.iconButton}>
                    <TextInput.Icon icon="google" size={24} mode="outlined" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <TextInput.Icon icon="facebook" size={24} mode="outlined" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <TextInput.Icon icon="apple" size={24} mode="outlined" />
                </TouchableOpacity>
            </View>

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
    signupButton: {
        marginVertical: 10,
    },
    createAccount: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
    },
    orText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginVertical: 15,
        marginTop: 35,
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 40,
    },
    iconButton: {
        padding: 4,
        borderRadius: 10,
    },
});

export default SignupScreen;
