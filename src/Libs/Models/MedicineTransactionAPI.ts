import { plainToClass } from "class-transformer";
import { InputOutputTicketViewModel } from "../ViewModels/InputOutputTicketViewModel";
import { MedicineTransactionViewModel } from "../ViewModels/MedicineTransactionViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class MedicineTransactionAPI {
    static LIST_NAME = "MedicineTransaction"
    static async getItems(queryOption: QueryOption<MedicineTransactionViewModel>): Promise<PagedData<MedicineTransactionViewModel>> {
        if (queryOption.select === "")
            queryOption.select = "Title"
        if (queryOption.order === undefined)
            queryOption.order = "Created desc";
        let data = await ApiBase.getItems(ApiBase.BASE_URI, MedicineTransactionAPI.LIST_NAME, queryOption);
        data = plainToClass(PagedData<MedicineTransactionViewModel>, data);
        data.Data = plainToClass(MedicineTransactionViewModel, data.Data);
        return data;
    }

    static async AddItem(item: MedicineTransactionViewModel) {
        let [error, data] = await ApiBase.addItem<MedicineTransactionViewModel>(ApiBase.BASE_URI, MedicineTransactionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }

    static async DeleteItem(item: MedicineTransactionViewModel) {
        let [error,] = await ApiBase.deleteItem(ApiBase.BASE_URI, MedicineTransactionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return null;
    }

    static async GetItemByID(itemID: string, queryOption: QueryOption<MedicineTransactionViewModel>) : Promise<MedicineTransactionViewModel | null> {
        let [error, data] = await ApiBase.getItemById<MedicineTransactionViewModel>(ApiBase.BASE_URI, MedicineTransactionAPI.LIST_NAME, itemID, queryOption);
        if (error)
            return null;

        data = plainToClass(MedicineTransactionViewModel, data);
        return data;
    }

    static async UpdateItem(item: MedicineTransactionViewModel) {
        let [error, data] = await ApiBase.updateItem<MedicineTransactionViewModel>(ApiBase.BASE_URI, MedicineTransactionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }
}