import { makeObservable, observable } from "mobx";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";
import { Moment } from "moment";

export class MedicineReportItemViewModel extends BaseEntitySharePointItem {
    Code: string | undefined;
    Title: string | undefined;
    Description: string | undefined;
    Unit: string | undefined;
    BeginningInventory: number = 0;
    ExpiryDate: Moment | undefined;
    ImportNumber: number = 0;
    ExportNumber: number = 0;
    EndingInventory: number = 0;
    Note: string | undefined;

    "__metadata": any = { 'type': 'SP.Data.MedicineReportItemListItem' }

    constructor(
        Title: any,
        Code: any,
        Description: any,
        Unit: any,
        BeginningInventory: any,
        ExpiryDate: any,
        ImportNumber: any,
        ExportNumber: any,
        EndingInventory: any,
        Note: any,
    ) {
        super();

        this.Title = Title;
        this.Code = Code;
        this.Description = Description;
        this.Unit = Unit;
        this.BeginningInventory = BeginningInventory;
        this.ExpiryDate = ExpiryDate;
        this.ImportNumber = ImportNumber;
        this.ExportNumber = ExportNumber;
        this.EndingInventory = EndingInventory;
        this.Note = Note;

        makeObservable(this, {
            Title: observable,
            Code: observable,
            Description: observable,
            Unit: observable,
            BeginningInventory: observable,
            ExpiryDate: observable,
            ImportNumber: observable,
            ExportNumber: observable,
            EndingInventory: observable,
            Note: observable,
        })
    }
}