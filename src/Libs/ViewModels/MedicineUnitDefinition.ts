import { makeObservable, observable } from "mobx";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";

export class MedicineUnitDefinition extends BaseEntitySharePointItem {
    Title : string | undefined;
    Code : string | undefined;

    constructor() {
        super();

        makeObservable(this, {
            Title: observable,
            Code: observable
        })
    }
}