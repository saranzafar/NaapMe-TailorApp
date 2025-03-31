// src/types/database.ts
export interface MeasurementField {
    key: string;
    value: string;
    isRequired: boolean;
}

export interface Measurement {
    uid?: string;
    id?: number;
    customerName: string;
    phoneNumber: string;
    fields: MeasurementField[];
    createdAt?: string;
}
