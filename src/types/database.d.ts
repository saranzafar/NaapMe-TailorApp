export interface MeasurementField {
    key: string;
    value: string;
    isRequired: boolean;
}

export interface Measurement {
    id?: number;
    userId: string;
    customerName: string;
    phoneNumber: string;
    fields: MeasurementField[];
    createdAt?: string;
}
