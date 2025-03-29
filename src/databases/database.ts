// src/databases/database.ts
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Measurement } from '../types/database';

// Configure SQLite for better error handling and Promise support
SQLite.enablePromise(true);

// Database configuration
const DATABASE_NAME = 'NaapMe.db';

// Singleton database instance
let databaseInstance: SQLiteDatabase | null = null;

// Open or create the database
export const openDatabase = async (): Promise<SQLiteDatabase> => {
    try {
        if (databaseInstance) {
            return databaseInstance;
        }

        const db = await SQLite.openDatabase({ name: DATABASE_NAME, location: 'default' });

        // Ensure the measurements table exists
        await createMeasurementsTable(db);

        databaseInstance = db;
        return db;
    } catch (error) {
        console.error('Database opening error:', error);
        throw error;
    }
};

// Create measurements table
const createMeasurementsTable = async (db: SQLiteDatabase): Promise<void> => {
    // const dropQuery = 'DROP TABLE IF EXISTS measurements';

    const createQuery = `
        CREATE TABLE IF NOT EXISTS measurements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            phone_number TEXT NOT NULL,
            measurement_data TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            // tx.executeSql(
            //     dropQuery,
            //     [],
            //     () => console.log('Old table dropped successfully.')
            // );

            tx.executeSql(
                createQuery,
                [],
                () => {
                    resolve();
                },
                (_, error) => {
                    console.error('Error creating table:', error);
                    reject(error);
                }
            );
        });
    });
};

// Add or update measurement
export const addMeasurement = async (measurement: Measurement): Promise<number> => {

    try {
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                if (measurement.id) {
                    // Update existing measurement
                    tx.executeSql(
                        `UPDATE measurements 
                        SET customer_name = ?, 
                            phone_number = ?, 
                            measurement_data = ? 
                        WHERE id = ?`,
                        [
                            measurement.customerName,
                            measurement.phoneNumber,
                            JSON.stringify(measurement.fields),
                            measurement.id,
                        ],
                        (_, resultSet) => {
                            console.log('Measurement updated successfully:', resultSet);
                            resolve(measurement.id!);
                        },
                        (_, error) => {
                            console.error('Error updating measurement:', error);
                            reject(error);
                            return true; // Stop transaction on error
                        }
                    );
                } else {

                    // Insert new measurement
                    tx.executeSql(
                        `INSERT INTO measurements 
                        (customer_name, phone_number, measurement_data) 
                        VALUES (?, ?, ?)`,
                        [
                            measurement.customerName,
                            measurement.phoneNumber,
                            JSON.stringify(measurement.fields),
                        ],
                        (_, resultSet) => {
                            console.log('Measurement inserted successfully:', resultSet);
                            resolve(resultSet.insertId); // Ensure insertId is returned
                        },
                        (_, error) => {
                            console.error('Error inserting measurement:', error);
                            reject(error);
                            return true; // Stop transaction on error
                        }
                    );
                }
            },
                (transactionError) => {
                    console.error('Transaction Error:', transactionError);
                    reject(transactionError);
                });
        });
    } catch (error) {
        console.error('Measurement save error:', error);
        throw error;
    }
};

// Fetch all measurements
export const getMeasurements = async (): Promise<Measurement[]> => {
    try {
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM measurements ORDER BY created_at DESC',
                    [],
                    (_, resultSet) => {
                        const measurements: Measurement[] = resultSet.rows.raw().map(row => ({
                            id: row.id,
                            customerName: row.customer_name,
                            phoneNumber: row.phone_number,
                            fields: row.measurement_data ? JSON.parse(row.measurement_data) : [],
                            createdAt: row.created_at || new Date().toISOString(), // Ensure valid timestamp
                        }));
                        resolve(measurements);
                    },
                    (_, error) => {
                        console.error('Error fetching measurements:', error);
                        reject(error);
                    }
                );
            });
        });
    } catch (error) {
        console.error('Get measurements error:', error);
        throw error;
    }
};


// Delete a measurement
export const deleteMeasurement = async (id: number): Promise<void> => {
    try {
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM measurements WHERE id = ?',
                    [id],
                    () => {
                        resolve();
                    },
                    (_, error) => {
                        console.error('Error deleting measurement:', error);
                        reject(error);
                    }
                );
            });
        });
    } catch (error) {
        console.error('Delete measurement error:', error);
        throw error;
    }
};
