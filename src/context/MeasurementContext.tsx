import React, { createContext, useState, useContext } from 'react';
import { Measurement } from '../types/database';

interface MeasurementContextType {
    measurements: Measurement[];
    addMeasurement: (measurement: Measurement) => void;
    updateMeasurement: (measurement: Measurement) => void;
    deleteMeasurement: (id: number) => void;
    searchMeasurements: (query: string) => Measurement[];
}

const MeasurementContext = createContext<MeasurementContextType | undefined>(undefined);

export const MeasurementProvider: React.FC = ({ children }) => {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);

    // Implement context methods here with database interactions

    return (
        <MeasurementContext.Provider value={{
            measurements,
            addMeasurement: () => { },
            updateMeasurement: () => { },
            deleteMeasurement: () => { },
            searchMeasurements: () => [],
        }}>
            {children}
        </MeasurementContext.Provider>
    );
};

export const useMeasurements = () => {
    const context = useContext(MeasurementContext);
    if (!context) {
        throw new Error('useMeasurements must be used within a MeasurementProvider');
    }
    return context;
};
