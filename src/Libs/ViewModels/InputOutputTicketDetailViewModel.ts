import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class InputOutputTicketDetailViewModel extends BaseEntitySharePointItem {
    MedicineCategory: string | undefined;
    MedicineCode: string | undefined;
    MedicineTitle: string | undefined;
    MedicineID: number = 0;
    Quantity: number = 0;
    MedicineUnit: string | undefined;
    MedicineQuantityBefore: number = 0;
    TicketID: number = 0;
    Created: Date | undefined;

    __metadata: any = {
        "type": "SP.Data.InputOutputTicketDetailListItem"
    }
}