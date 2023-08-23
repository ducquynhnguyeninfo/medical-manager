import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class InputOutputTicketViewModel extends BaseEntitySharePointItem {
    MedicineCategory : string | null = null;
    MedicineCode : string | null = null;
    MedicineTitle : string | null = null;
    MedicineID : number = 0;
    MedicineQuantity : number = 0;
    MedicineUnit: string | null = null;
    Reason: string | null = null;
    InputDate : Date | null = null;
    InputUser : string | null = null;
    MedicineQuantityBefore: number = 0;
    IsInput: boolean = false;
    Created: Date | null = null;

    __metadata: any = {
        "type": "SP.Data.InputOutputTicketListItem"
    }
}