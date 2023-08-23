import { plainToClass } from "class-transformer";
import { InputOutputTicketViewModel } from "../ViewModels/InputOutputTicketViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class InputOutputTicketAPI {
    static LIST_NAME = "InputOutputTicket"
    static async getItems(queryOption: QueryOption<InputOutputTicketViewModel>): Promise<PagedData<InputOutputTicketViewModel>> {
        if (queryOption.select === "")
            queryOption.select = "Title"
        if(queryOption.order === undefined)
            queryOption.order = "Created desc";
        let data = await ApiBase.getItems(ApiBase.BASE_URI, InputOutputTicketAPI.LIST_NAME, queryOption);
        data = plainToClass(PagedData<InputOutputTicketViewModel>, data);
        data.Data = plainToClass(InputOutputTicketViewModel, data.Data);
        return data;
    }

    // static async AddItem(item: MedicineDefinition) {
    //     let [error,] = await ApiBase.addItem(ApiBase.BASE_URI, "MedicineDefinition", item);
    //     if (error)
    //         return error;
    //     else return null;

    // }

    // static async DeleteItem(item: MedicineDefinition) {
    //     let [error,] = await ApiBase.deleteItem(ApiBase.BASE_URI, "MedicineDefinition", item);
    //     if (error)
    //         return error;
    //     else return null;

    // }
}