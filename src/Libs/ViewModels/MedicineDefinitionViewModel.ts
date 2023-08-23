import { Moment } from "moment";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class MedicineDefinitionViewModel extends BaseEntitySharePointItem {
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

    static toJS(item: MedicineDefinitionViewModel) {
        return {
            Title: item.Title,
            Code: item.Code,
            Unit: item.Unit,
            Description: item.Description,
            CreatedBy: item.CreatedBy,
            CreatedAt: item.CreatedAt,
            "odata.etag": item["odata.etag"],
            __metadata: {
                "type": "SP.Data.MedicineDefinitionListItem"
            }
        }
    }
}