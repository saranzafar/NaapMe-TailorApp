import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged } from '@react-native-firebase/auth';

import SignupScreen from '../auth/SignupScreen';
import LoginScreen from '../auth/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import auth from '../firebase/config';
import LandingScreen from '../auth/LandingScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import CheckEmailScreen from '../auth/CheckEmailScreen';
import AddMeasurementScreen from '../screens/MeasurementScreen';
import MeasurementDetailScreen from '../screens/MeasurementDetailScreen';

const Stack = createStackNavigator();

const Navigation = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={user ? 'Home' : 'Landing'}
                screenOptions={{ headerShown: false }}
            >
                {/* Auth Screens  */}
                <Stack.Screen name="Landing" component={LandingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="CheckEmail" component={CheckEmailScreen} />

                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="AddMeasurement" component={AddMeasurementScreen} />
                <Stack.Screen name="MeasurementDetail" component={MeasurementDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Navigation;
