import { plainToClass } from "class-transformer";
import { InputOutputTicketDetailViewModel } from "../ViewModels/InputOutputTicketDetailViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export class InputOutputTicketDetailAPI {
    static LIST_NAME = "InputOutputTicketDetail";

    static async getItems(queryOption: QueryOption<InputOutputTicketDetailViewModel>): Promise<PagedData<InputOutputTicketDetailViewModel>> {
        if (queryOption.select === "")
            queryOption.select = "Title"
        if (queryOption.order === undefined)
            queryOption.order = "Created desc";
        let data = await ApiBase.getItems(ApiBase.BASE_URI, InputOutputTicketDetailAPI.LIST_NAME, queryOption);
        data = plainToClass(PagedData<InputOutputTicketDetailViewModel>, data);
        data.Data = plainToClass(InputOutputTicketDetailViewModel, data.Data);
        return data;
    }

    static async AddItem(item: InputOutputTicketDetailViewModel) {
        let [error, data] = await ApiBase.addItem<InputOutputTicketDetailViewModel>(ApiBase.BASE_URI, InputOutputTicketDetailAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;
    }

    static async DeleteItem(item: InputOutputTicketDetailViewModel) {
        let [error,] = await ApiBase.deleteItem(ApiBase.BASE_URI, InputOutputTicketDetailAPI.LIST_NAME, item);
        if (error)
            return error;
        else return null;
    }
}