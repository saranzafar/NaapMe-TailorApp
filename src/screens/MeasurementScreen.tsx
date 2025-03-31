// src/screens/AddMeasurementScreen.tsx
import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
} from 'react-native';
import {
    Appbar,
    TextInput,
    Button,
    useTheme,
    IconButton,
} from 'react-native-paper';
import { Measurement, MeasurementField } from '../types/database';
import { addMeasurement, updateMeasurement } from '../databases/database';

const DEFAULT_REQUIRED_FIELDS: MeasurementField[] = [
    { key: 'قمیض', value: '', isRequired: true },
    { key: 'تیرہ', value: '', isRequired: true },
    { key: 'بازو', value: '', isRequired: true },
    { key: 'چوڑائی', value: '', isRequired: true },
];

const AddMeasurementScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const editMeasurement = route.params?.measurement;

    // State for form fields
    const [customerName, setCustomerName] = useState(editMeasurement?.customerName || '');
    const [phoneNumber, setPhoneNumber] = useState(editMeasurement?.phoneNumber || '');
    const [fields, setFields] = useState<MeasurementField[]>(
        editMeasurement?.fields || [...DEFAULT_REQUIRED_FIELDS]
    );

    // Add a new custom field
    const addCustomField = () => {
        setFields([
            ...fields,
            { key: '', value: '', isRequired: false },
        ]);
    };

    // Update a specific field
    const updateField = (index: number, updates: Partial<MeasurementField>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    // Remove a field
    const removeField = (index: number) => {
        const newFields = fields.filter((_, idx) => idx !== index);
        setFields(newFields);
    };

    // Validate form
    const validateForm = () => {
        // Check required fields
        const missingRequiredFields = fields
            .filter(field => field.isRequired)
            .some(field => !field.value.trim());

        if (!customerName.trim()) {
            alert('Customer name is required');
            return false;
        }

        if (!phoneNumber.trim()) {
            alert('Phone number is required');
            return false;
        }

        if (missingRequiredFields) {
            alert('Please fill all required fields');
            return false;
        }

        return true;
    };

    // Save measurement
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        const measurement: Measurement = {
            id: editMeasurement?.id ?? null,
            customerName,
            phoneNumber,
            fields: fields.filter(field => field.key.trim() && field.value.trim()),
        };

        try {
            if (editMeasurement) {
                // Call update function if editing
                await updateMeasurement(measurement);
            } else {
                // Otherwise, add new measurement
                await addMeasurement(measurement);
            }
            navigation.goBack();
        } catch (error) {
            console.error('Error saving measurement:', error);
            alert('Failed to save measurement');
        }
    };



    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* App Header */}
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={editMeasurement ? 'Edit Measurement' : 'Add Measurement'} />
            </Appbar.Header>

            <ScrollView>
                {/* Customer Info Inputs */}
                <TextInput
                    label="Customer Name"
                    value={customerName}
                    onChangeText={setCustomerName}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.input}
                />

                {/* Dynamic Measurement Fields */}
                {fields.map((field, index) => (
                    <View key={index} style={styles.fieldContainer}>
                        <TextInput
                            label="Field Name"
                            value={field.key}
                            onChangeText={(text) => updateField(index, { key: text })}
                            mode="outlined"
                            style={styles.halfInput}
                        />
                        <TextInput
                            label="Value"
                            value={field.value}
                            onChangeText={(text) => updateField(index, { value: text })}
                            mode="outlined"
                            style={styles.halfInput}
                        />
                        {!field.isRequired && (
                            <IconButton
                                icon="delete"
                                onPress={() => removeField(index)}
                            />
                        )}
                    </View>
                ))}

                {/* Add Custom Field Button */}
                <Button
                    mode="outlined"
                    onPress={addCustomField}
                    style={styles.addFieldButton}
                >
                    Add Custom Field
                </Button>

                {/* Save Button */}
                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    Save Measurement
                </Button>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input: {
        margin: 10,
    },
    fieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
    },
    halfInput: {
        flex: 1,
        marginHorizontal: 5,
    },
    addFieldButton: {
        margin: 10,
    },
    saveButton: {
        margin: 10,
    },
});

export default AddMeasurementScreen;
function alert(_arg0: string) {
    throw new Error('Function not implemented.');
}

