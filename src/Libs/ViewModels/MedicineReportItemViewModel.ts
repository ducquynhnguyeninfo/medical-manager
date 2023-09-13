import { makeObservable, observable } from "mobx";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";
import { Moment } from "moment";

export class MedicineReportItemViewModel {
    ID: number = 0;
    oder: string | undefined;
    Code: string | undefined;
    MedicineTitle: string | undefined;
    UsageDescription: string | undefined;
    Unit: string | undefined;
    BeginningInventory: number = 0;
    ExpiryDate: Moment | undefined;
    ImportNumber: number = 0;
    ExportNumber: number = 0;
    EndingInventory: number = 0;
    Note: string | undefined;

    "__metadata": any = { 'type': 'SP.Data.MedicineReportItemListItem' }

    constructor(
        MedicineTitle: any,
        Code: any,
        UsageDescription: any,
        Unit: any,
        BeginningInventory: any,
        ExpiryDate: any,
        ImportNumber: any,
        ExportNumber: any,
        EndingInventory: any,
        Note: any,
    ) {
        this.MedicineTitle = MedicineTitle;
        this.Code = Code;
        this.UsageDescription = UsageDescription;
        this.Unit = Unit;
        this.BeginningInventory = BeginningInventory;
        this.ExpiryDate = ExpiryDate;
        this.ImportNumber = ImportNumber;
        this.ExportNumber = ExportNumber;
        this.EndingInventory = EndingInventory;
        this.Note = Note;

        makeObservable(this, {
            MedicineTitle: observable,
            Code: observable,
            UsageDescription: observable,
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