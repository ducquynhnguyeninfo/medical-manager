import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class MedicineTransactionViewModel extends BaseEntitySharePointItem {
    Title: string | null = null;
    MedicineID : number = 0;
    IsIncrease: boolean = true;
    NewValue: number = 0;
    ValueChange: number = 0;
    FromAction: string | null = null;
    FromActionID: number = 0;

    __metadata: any = {
        "type": "SP.Data.MedicineTransactionListItem"
    }
}