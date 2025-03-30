import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, Text, Card, Button, useTheme } from 'react-native-paper';
import { deleteMeasurement } from '../databases/database';
import { Measurement } from '../types/database';

const MeasurementDetailScreen = ({ route, navigation }) => {
    const theme = useTheme();
    const { measurement } = route.params as { measurement: Measurement };

    const handleDelete = async () => {
        Alert.alert(
            'Delete Measurement',
            'Are you sure you want to delete this measurement?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteMeasurement(measurement.id!, measurement.userId);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={theme.colors.primary} />
                <Appbar.Content title="Measurement Details" titleStyle={styles.appbarTitle} />
                <Appbar.Action icon="pencil" onPress={() => navigation.navigate('AddMeasurement', { measurement })} />
                <Appbar.Action icon="delete" onPress={handleDelete} />
            </Appbar.Header>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge">{measurement.customerName}</Text>
                    <Text variant="bodyMedium">Phone: {measurement.phoneNumber}</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Measurements</Text>
                    {measurement.fields.map((field, index) => (
                        <View key={index} style={styles.measurementRow}>
                            <Text variant="bodyMedium" style={styles.fieldKey}>
                                {field.key}:
                            </Text>
                            <Text variant="bodyMedium">{field.value}</Text>
                        </View>
                    ))}
                </Card.Content>
            </Card>

            <View style={styles.actions}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate('AddMeasurement', { measurement })}
                >
                    Edit
                </Button>
                <Button mode="outlined" onPress={handleDelete} textColor="red">
                    Delete
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    appbarTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    card: {
        marginVertical: 8,
    },
    measurementRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    fieldKey: {
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingHorizontal: 10,
    },
});

export default MeasurementDetailScreen;
