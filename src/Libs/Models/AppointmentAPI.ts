import { plainToClass } from "class-transformer";
import { AppointmentViewModel } from "../ViewModels/AppointmentViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export class AppointmentAPI {
    static LIST_NAME = "Appointment";

    static async getItems(queryOption: QueryOption<AppointmentViewModel>): Promise<PagedData<AppointmentViewModel>> {
        if (queryOption.select === "")
            queryOption.select = "Title"
        if (queryOption.order === undefined)
            queryOption.order = "Created desc";
        let data = await ApiBase.getItems(ApiBase.BASE_URI, AppointmentAPI.LIST_NAME, queryOption);
        data = plainToClass(PagedData<AppointmentViewModel>, data);
        data.Data = plainToClass(AppointmentViewModel, data.Data);
        return data;
    }

    static async AddItem(item: AppointmentViewModel) {
        let [error, data] = await ApiBase.addItem<AppointmentViewModel>(ApiBase.BASE_URI, AppointmentAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }

    static async DeleteItem(item: AppointmentViewModel) {
        let [error,] = await ApiBase.deleteItem(ApiBase.BASE_URI, AppointmentAPI.LIST_NAME, item);
        if (error)
            return error;
        else return null;
    }

    static async GetItemByID(itemID: string, queryOption: QueryOption<AppointmentViewModel>) : Promise<AppointmentViewModel | null> {
        let [error, data] = await ApiBase.getItemById<AppointmentViewModel>(ApiBase.BASE_URI, AppointmentAPI.LIST_NAME, itemID, queryOption);
        if (error)
            return null;

        let parsedata = plainToClass(AppointmentViewModel, data, {excludeExtraneousValues: true});
        return parsedata;
    }

    static async UpdateItem(item: AppointmentViewModel) {
        let [error, data] = await ApiBase.updateItem<AppointmentViewModel>(ApiBase.BASE_URI, AppointmentAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }

    
}