import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { Measurement } from '../types/database';

SQLite.enablePromise(true);

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
        console.log('Database opened successfully.');

        // Ensure the measurements table exists
        await createMeasurementsTable(db);
        databaseInstance = db;
        return db;
    } catch (error) {
        console.error('Database opening error:', error);
        throw error;
    }
};

// Create measurements table (drop old table if needed to update schema)
const createMeasurementsTable = async (db: SQLiteDatabase): Promise<void> => {
    // const dropQuery = 'DROP TABLE IF EXISTS measurements'; // Force recreate for schema update
    const createQuery = `
    CREATE TABLE IF NOT EXISTS measurements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        measurement_data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;

    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            // tx.executeSql(dropQuery, [], () => console.log('Old table dropped successfully.'));
            tx.executeSql(
                createQuery,
                [],
                () => {
                    console.log('Measurements table created.');
                    resolve();
                },
                (_, error) => {
                    console.error('Error creating table:', error);
                    reject(error);
                    return true;
                }
            );
        });
    });
};

// Add or update measurement
export const addMeasurement = async (measurement: Measurement): Promise<number> => {
    try {
        const db = await openDatabase();
        console.log('Measurement in DB: ', measurement);

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                if (measurement.id) {
                    // Update existing measurement
                    tx.executeSql(
                        `UPDATE measurements 
            SET customer_name = ?, 
                phone_number = ?, 
                measurement_data = ? 
            WHERE id = ? AND user_id = ?`,
                        [
                            measurement.customerName,
                            measurement.phoneNumber,
                            JSON.stringify(measurement.fields),
                            measurement.id,
                            measurement.userId,
                        ],
                        (_, resultSet) => {
                            console.log('Measurement updated successfully:', resultSet);
                            resolve(measurement.id!);
                        },
                        (_, error) => {
                            console.error('Error updating measurement:', error);
                            reject(error);
                            return true;
                        }
                    );
                } else {
                    console.log('Inside insert...');
                    // Insert new measurement (include user_id)
                    tx.executeSql(
                        `INSERT INTO measurements 
             (user_id, customer_name, phone_number, measurement_data) 
             VALUES (?, ?, ?, ?)`,
                        [
                            measurement.userId,
                            measurement.customerName,
                            measurement.phoneNumber,
                            JSON.stringify(measurement.fields),
                        ],
                        (_, resultSet) => {
                            console.log('Measurement inserted successfully:', resultSet);
                            resolve(resultSet.insertId);
                        },
                        (_, error) => {
                            console.error('Error inserting measurement:', error);
                            reject(error);
                            return true;
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

// Fetch all measurements for the given user
export const getMeasurements = async (userId: string): Promise<Measurement[]> => {
    try {
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM measurements WHERE user_id = ? ORDER BY created_at DESC',
                    [userId],
                    (_, resultSet) => {
                        const measurements: Measurement[] = resultSet.rows.raw().map(row => ({
                            id: row.id,
                            userId: row.user_id,
                            customerName: row.customer_name,
                            phoneNumber: row.phone_number,
                            fields: row.measurement_data ? JSON.parse(row.measurement_data) : [],
                            createdAt: row.created_at || new Date().toISOString(),
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

// Delete a measurement (only if it belongs to the user)
export const deleteMeasurement = async (id: number, userId: string): Promise<void> => {
    try {
        const db = await openDatabase();

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(
                    'DELETE FROM measurements WHERE id = ? AND user_id = ?',
                    [id, userId],
                    () => {
                        console.log('Measurement deleted successfully');
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
