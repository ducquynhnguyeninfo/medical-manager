import { InputOutputTicketDetailViewModel } from "../ViewModels/InputOutputTicketDetailViewModel";
import { ApiBase } from "./Base/ApiBase";

export class InputOutputTicketDetailAPI {
    static LIST_NAME = "InputOutputTicketDetail";

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