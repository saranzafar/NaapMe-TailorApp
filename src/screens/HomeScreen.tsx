import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, Text, Searchbar, Card, FAB, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { getMeasurements } from '../databases/database';
import { Measurement } from '../types/database';

// Separate ListEmptyComponent outside the render function
const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
        <Text>No measurements found</Text>
    </View>
);

const HomeScreen = ({ navigation }) => {
    const theme = useTheme();
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMeasurements, setFilteredMeasurements] = useState<Measurement[]>([]);

    // Fetch measurements
    const fetchMeasurements = async () => {
        try {
            const fetchedMeasurements = await getMeasurements();
            setMeasurements(fetchedMeasurements);
            setFilteredMeasurements(fetchedMeasurements);
        } catch (error) {
            console.error('Error fetching measurements:', error);
        }
    };

    // Refresh measurements when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchMeasurements();
        }, [])
    );

    // Search/Filter measurements
    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredMeasurements(measurements);
            return;
        }

        const filtered = measurements.filter(measurement =>
            measurement.customerName.toLowerCase().includes(query.toLowerCase()) ||
            measurement.phoneNumber.includes(query)
        );

        setFilteredMeasurements(filtered);
    };

    // Logout handler
    const handleLogout = async () => {
        try {
            await auth().signOut();
            navigation.replace('Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Navigation to measurement details
    const navigateToMeasurementDetail = (measurement: Measurement) => {
        navigation.navigate('MeasurementDetail', { measurement });
    };

    return (
        <View style={[styles.container]}>
            {/* App Header */}
            <Appbar.Header>
                <Appbar.Content title="NaapMe" />
                <Appbar.Action icon="logout" onPress={handleLogout} />
            </Appbar.Header>

            {/* Search Bar */}
            <Searchbar
                placeholder="Search by name or phone"
                onChangeText={handleSearch}
                value={searchQuery}
                style={[styles.searchBar, { backgroundColor: theme.colors.primaryContainer }]}
            />

            {/* Measurements List */}
            <FlatList
                data={filteredMeasurements}
                keyExtractor={(item) => item.id?.toString() || ''}
                ListEmptyComponent={ListEmptyComponent}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigateToMeasurementDetail(item)}>
                        <Card style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}>
                            <Card.Content>
                                <Text variant="titleMedium">{item.customerName}</Text>
                                <Text variant="bodyMedium">{item.phoneNumber}</Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                )}
            />

            {/* Floating Action Button */}
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => navigation.navigate('AddMeasurement')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchBar: {
        marginVertical: 10,
    },
    card: {
        marginVertical: 5,
        elevation: 2,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
});

export default HomeScreen;
