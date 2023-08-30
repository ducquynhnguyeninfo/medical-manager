import { plainToClass } from "class-transformer";
import { PagedData } from "../ViewModels/PagedData";
import { UserPermissionViewModel } from "../ViewModels/UserPermissionViewModel";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class UserPermissionAPI {
    static LIST_NAME = "UserPermission"
    static async getItems(queryOption: QueryOption<UserPermissionViewModel>): Promise<PagedData<UserPermissionViewModel>> {
        if (queryOption.select === "")
            queryOption.select = "Title"
        if (queryOption.order === undefined)
            queryOption.order = "Created desc";
        let data = await ApiBase.getItems(ApiBase.BASE_URI, UserPermissionAPI.LIST_NAME, queryOption);
        data = plainToClass(PagedData<UserPermissionViewModel>, data);
        data.Data = plainToClass(UserPermissionViewModel, data.Data);
        return data;
    }

    static async AddItem(item: UserPermissionViewModel) {
        let [error, data] = await ApiBase.addItem<UserPermissionViewModel>(ApiBase.BASE_URI, UserPermissionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }

    static async DeleteItem(item: UserPermissionViewModel) {
        let [error,] = await ApiBase.deleteItem(ApiBase.BASE_URI, UserPermissionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return null;
    }

    static async GetItemByID(itemID: string, queryOption: QueryOption<UserPermissionViewModel>) : Promise<UserPermissionViewModel | null> {
        let [error, data] = await ApiBase.getItemById<UserPermissionViewModel>(ApiBase.BASE_URI, UserPermissionAPI.LIST_NAME, itemID, queryOption);
        if (error)
            return null;

        data = plainToClass(UserPermissionViewModel, data);
        return data;
    }

    static async UpdateItem(item: UserPermissionViewModel) {
        let [error, data] = await ApiBase.updateItem<UserPermissionViewModel>(ApiBase.BASE_URI, UserPermissionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;

    }
}