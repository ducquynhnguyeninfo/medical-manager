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
        if (queryOption.order === undefined)
            queryOption.order = "Created desc";
        let data = await ApiBase.getItems(ApiBase.BASE_URI, InputOutputTicketAPI.LIST_NAME, queryOption);
        data = plainToClass(PagedData<InputOutputTicketViewModel>, data);
        data.Data = plainToClass(InputOutputTicketViewModel, data.Data);
        return data;
    }

    static async AddItem(item: InputOutputTicketViewModel) {
        let [error, data] = await ApiBase.addItem<InputOutputTicketViewModel>(ApiBase.BASE_URI, InputOutputTicketAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }

    static async GetItemByID(itemID: string, queryOption: QueryOption<InputOutputTicketViewModel>) : Promise<InputOutputTicketViewModel | null> {
        let [error, data] = await ApiBase.getItemById<InputOutputTicketViewModel>(ApiBase.BASE_URI, InputOutputTicketAPI.LIST_NAME, itemID, queryOption);
        if (error)
            return null;

        data = plainToClass(InputOutputTicketViewModel, data);
        return data;
    }

    static async UpdateItem(item: InputOutputTicketViewModel) {
        let [error, data] = await ApiBase.updateItem<InputOutputTicketViewModel>(ApiBase.BASE_URI, InputOutputTicketAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }
}