import { plainToClass } from "class-transformer";
import { AppointmentViewModel } from "../ViewModels/AppointmentViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { PrescriptionViewModel } from "../ViewModels/PrescriptionViewModel";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export class PrescriptionAPI {
    static LIST_NAME = "Prescription";

    static async getItems(queryOption: QueryOption<PrescriptionViewModel>): Promise<PagedData<PrescriptionViewModel>> {
        if (queryOption.select === "")
            queryOption.select = "Title"
        if (queryOption.order === undefined)
            queryOption.order = "Created desc";
        let data = await ApiBase.getItems(ApiBase.BASE_URI, PrescriptionAPI.LIST_NAME, queryOption);
        data = plainToClass(PagedData<PrescriptionViewModel>, data);
        data.Data = plainToClass(PrescriptionViewModel, data.Data);
        return data;
    }

    static async AddItem(item: PrescriptionViewModel) {
        let [error, data] = await ApiBase.addItem<PrescriptionViewModel>(ApiBase.BASE_URI, PrescriptionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }

    static async DeleteItem(item: PrescriptionViewModel) {
        let [error,] = await ApiBase.deleteItem(ApiBase.BASE_URI, PrescriptionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return null;
    }

    static async GetItemByID(itemID: string, queryOption: QueryOption<PrescriptionViewModel>) : Promise<PrescriptionViewModel | null> {
        let [error, data] = await ApiBase.getItemById<PrescriptionViewModel>(ApiBase.BASE_URI, PrescriptionAPI.LIST_NAME, itemID, queryOption);
        if (error)
            return null;

        data = plainToClass(PrescriptionViewModel, data);
        return data;
    }

    static async UpdateItem(item: PrescriptionViewModel) {
        let [error, data] = await ApiBase.updateItem<PrescriptionViewModel>(ApiBase.BASE_URI, PrescriptionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }

    
}