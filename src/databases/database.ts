// databases/database.ts

import SQLite from 'react-native-sqlite-storage';
import auth from '../firebase/config';
import { Measurement } from '../types/database';

// Open the database connection
const db = SQLite.openDatabase({ name: 'app.db', location: 'default' });

// Initialize your measurements table with a uid column if it doesn't exist.
export const initDatabase = async () => {
    (await db).transaction(tx => {
        // Drop the measurements table if it exists
        // tx.executeSql(
        //     'DROP TABLE IF EXISTS measurements',
        //     [],
        //     () => console.log('Table dropped successfully'),
        //     (_tx, error) => console.log('Error dropping table:', error)
        // );
        // Create the new measurements table with the updated structure
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT,
        phoneNumber TEXT,
        fields TEXT, -- Stored as JSON string
        uid TEXT
        )`,
            [],
            () => console.log('Table created successfully'),
            (_tx, error) => console.log('Error creating table:', error)
        );
    });
};


// Add a measurement while tagging it with the current user's UID
export const addMeasurement = async (measurement: Measurement): Promise<number> => {
    console.log('Adding measurement:', measurement);

    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    // Assign the authenticated user's UID
    measurement.uid = user.uid;

    // Convert the fields array to a JSON string for storage
    const fieldsStr = JSON.stringify(measurement.fields);

    try {
        const database = await db; // Ensure the database instance is available
        return new Promise<number>((resolve, reject) => {
            database.transaction(
                tx => {
                    tx.executeSql(
                        'INSERT INTO measurements (customerName, phoneNumber, fields, uid) VALUES (?, ?, ?, ?)',
                        [measurement.customerName, measurement.phoneNumber, fieldsStr, measurement.uid],
                        (_tx, result) => {
                            console.log('Measurement added successfully. Insert ID:', result.insertId);
                            resolve(result.insertId);
                        },
                        (_tx, error) => {
                            const errorMsg = error ? error.message : 'Unknown error';
                            console.error('Error inserting measurement:', errorMsg);
                            reject(error || new Error('Unknown error during measurement insertion'));
                            return false; // Error handled flag
                        }
                    );
                },
                transactionError => {
                    console.error('Transaction error:', transactionError);
                    reject(transactionError);
                }
            );
        });
    } catch (error) {
        console.error('Error in addMeasurement function:', error);
        throw error;
    }
};

// Fetch only the measurements for the current user
export const getMeasurements = async (): Promise<Measurement[]> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }

    try {
        const database = await db;
        return new Promise<Measurement[]>((resolve, reject) => {
            database.transaction(
                tx => {
                    tx.executeSql(
                        'SELECT * FROM measurements WHERE uid = ?',
                        [user.uid],
                        (_tx, results) => {
                            const measurements: Measurement[] = [];
                            for (let i = 0; i < results.rows.length; i++) {
                                let item = results.rows.item(i);
                                try {
                                    // Parse the stored JSON string back to an array
                                    item.fields = JSON.parse(item.fields);
                                } catch (err) {
                                    console.error('Error parsing fields JSON:', err);
                                    item.fields = [];
                                }
                                measurements.push(item);
                            }
                            console.log('Fetched measurements:', measurements);
                            resolve(measurements);
                        },
                        (_tx, error) => {
                            console.error('Error fetching measurements:', error);
                            reject(error);
                            return false;
                        }
                    );
                },
                transactionError => {
                    console.error('Transaction error while fetching measurements:', transactionError);
                    reject(transactionError);
                }
            );
        });
    } catch (error) {
        console.error('Error in getMeasurements function:', error);
        throw error;
    }
};

// Delete measurement remains the same (you may want to add a uid check as well if needed)
export const deleteMeasurement = async (id: number): Promise<any> => {
    if (id === undefined || id === null) {
        throw new Error('Invalid measurement id');
    }

    try {
        const database = await db;
        return new Promise<any>((resolve, reject) => {
            database.transaction(
                tx => {
                    tx.executeSql(
                        'DELETE FROM measurements WHERE id = ?',
                        [id],
                        (_tx, results) => {
                            console.log('Measurement deleted successfully. Results:', results);
                            resolve(results);
                        },
                        (_tx, error) => {
                            console.error('Error deleting measurement:', error);
                            reject(error);
                            return false;
                        }
                    );
                },
                transactionError => {
                    console.error('Transaction error while deleting measurement:', transactionError);
                    reject(transactionError);
                }
            );
        });
    } catch (error) {
        console.error('Error in deleteMeasurement function:', error);
        throw error;
    }
};

export const updateMeasurement = async (measurement: Measurement): Promise<void> => {
    if (measurement.id === null || measurement.id === undefined) {
        throw new Error('Measurement ID is required for update.');
    }
    const fieldsStr = JSON.stringify(measurement.fields);
    const database = await db;
    return new Promise<void>((resolve, reject) => {
        database.transaction(
            tx => {
                tx.executeSql(
                    'UPDATE measurements SET customerName = ?, phoneNumber = ?, fields = ? WHERE id = ?',
                    [measurement.customerName, measurement.phoneNumber, fieldsStr, measurement.id],
                    () => {
                        console.log('Measurement updated successfully.');
                        resolve();
                    },
                    (_tx, error) => {
                        console.error('Error updating measurement:', error);
                        reject(error);
                        return false;
                    }
                );
            },
            transactionError => {
                console.error('Transaction error while updating measurement:', transactionError);
                reject(transactionError);
            }
        );
    });
};
