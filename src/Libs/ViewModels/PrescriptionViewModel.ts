import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class PrescriptionViewModel extends BaseEntitySharePointItem {
    AppointmentID : number = 0;
    MedicineID : number = 0;
    MedicineCode : string | undefined = undefined;
    MedicineTitle: string | undefined = undefined;
    MedicineUnit: string | undefined = undefined;
    Quantity: number = 0;
    Created: Date | undefined = undefined;
    IsActive: boolean = true;
    IsHandled: boolean = false;
    
    __metadata: any = {
        "type": "SP.Data.PrescriptionListItem"
    }
}