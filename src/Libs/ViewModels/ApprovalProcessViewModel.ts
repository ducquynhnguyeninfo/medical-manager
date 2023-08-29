import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class ApprovalProcessViewModel extends BaseEntitySharePointItem {
    ObjectID : number | null = null;
    Approver : string | null = null;
    ApprovedDate: Date | null = null;
    ApprovedReason: string | null = null;
    RequesterEmail: string | null = null;
    IsApproved: boolean = false;
    Created : Date | null = null;
    IsInput: boolean = false;
    Title: string = "";
    LinkPreview: string | null = null;
    __metadata: any = {
        "type": "SP.Data.ApprovalProcessListItem"
    }
}