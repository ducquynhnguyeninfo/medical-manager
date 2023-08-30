import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class UserPermissionViewModel extends BaseEntitySharePointItem {
    Title: string | null = null;
    Email: string = "";
    Role: string = "";

    __metadata: any = {
        "type": "SP.Data.UserPermissionListItem"
    }
}