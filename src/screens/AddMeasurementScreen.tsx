import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, TextInput, Button, useTheme, IconButton } from 'react-native-paper';
import { Measurement, MeasurementField } from '../types/database';
import { addMeasurement } from '../databases/database';
import auth from '../firebase/config';

const DEFAULT_REQUIRED_FIELDS: MeasurementField[] = [
    { key: 'قمیض', value: '', isRequired: true },
    { key: 'تیرہ', value: '', isRequired: true },
    { key: 'بازو', value: '', isRequired: true },
    { key: 'چوڑائی', value: '', isRequired: true },
    { key: 'شلوار', value: '', isRequired: true },
    { key: 'پانچہ', value: '', isRequired: true },
];

const AddMeasurementScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const editMeasurement = route.params?.measurement;

    const [customerName, setCustomerName] = useState(editMeasurement?.customerName || '');
    const [phoneNumber, setPhoneNumber] = useState(editMeasurement?.phoneNumber || '');
    const [fields, setFields] = useState<MeasurementField[]>(
        editMeasurement?.fields || [...DEFAULT_REQUIRED_FIELDS]
    );

    const addCustomField = () => {
        setFields([...fields, { key: '', value: '', isRequired: false }]);
    };

    const updateField = (index: number, updates: Partial<MeasurementField>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_, idx) => idx !== index);
        setFields(newFields);
    };

    const validateForm = () => {
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

    const handleSave = async () => {
        if (!validateForm()) { return; }

        // Get current user's UID
        const currentUser = auth.currentUser;
        if (!currentUser) {
            alert('User not authenticated');
            return;
        }

        const measurement: Measurement = {
            id: editMeasurement?.id ?? null,
            userId: currentUser.uid,
            customerName,
            phoneNumber,
            fields: fields.filter(field => field.key.trim() && field.value.trim()),
        };

        try {
            await addMeasurement(measurement);
            navigation.goBack();
        } catch (error) {
            console.error('Error saving measurement:', error);
            alert('Failed to save measurement');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title={editMeasurement ? 'Edit Measurement' : 'Add Measurement'} />
            </Appbar.Header>
            <ScrollView>
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
                            <IconButton icon="delete" onPress={() => removeField(index)} />
                        )}
                    </View>
                ))}
                <Button mode="outlined" onPress={addCustomField} style={styles.addFieldButton}>
                    Add Custom Field
                </Button>
                <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
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

