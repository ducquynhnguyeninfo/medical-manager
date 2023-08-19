import { Moment } from "moment";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";
import { makeObservable, observable, action } from "mobx"

export class MedicineDefinition extends BaseEntitySharePointItem {
    Title: string | undefined;
    Code: string | undefined;
    Unit: string | undefined;
    Description: string | undefined;
    CreatedBy: string | undefined;
    CreatedAt: Moment | undefined;
    __metadata: any = {
        "type": "SP.Data.MedicineDefinitionListItem"
    }

    constructor() {
        super();

        // makeObservable(this, {
        //     Title: observable,
        //     Code: observable,
        //     Unit: observable,
        //     CreatedBy: observable,
        //     CreatedAt: observable,
        //     Description: observable
        // });
    }
}