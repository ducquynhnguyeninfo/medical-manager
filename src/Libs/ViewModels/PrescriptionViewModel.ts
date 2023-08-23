import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class Prescription extends BaseEntitySharePointItem {
    Stt: number = 0;
    AppointmentID : number = 0;
    AppointmentTitle : number = 0;
    MedicineID : number = 0;
    MedicineCode : string | null = null;
    MedicineTitle: string | null = null;
    MedicineUnit: string | null = null;
    Quantity: number = 0;
    Created: Date | null = null;
}