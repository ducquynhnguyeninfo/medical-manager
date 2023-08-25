import { InputOutputTicketStatus } from "../Utils/InputOutputTicketStatusEnum";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class InputOutputTicketViewModel extends BaseEntitySharePointItem {
   
    Reason: string | null = null;
    InputDate : Date | null = null;
    InputUser : string | null = null;
    IsInput: boolean = false;
    Status: number  = InputOutputTicketStatus.CREATED;
    Created: Date | null = null;
    Title: string = "";

    __metadata: any = {
        "type": "SP.Data.InputTicketListItem"
    }
}