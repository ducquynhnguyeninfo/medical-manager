import { plainToClass } from "class-transformer";
import { MedicineDefinitionViewModel } from "../ViewModels/MedicineDefinitionViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class MedicineDefinitionAPI {
    static LIST_NAME = "MedicineDefinition"
    static async getItems(queryOption?: QueryOption<MedicineDefinitionViewModel>): Promise<PagedData<MedicineDefinitionViewModel>> {
        if (queryOption == null)
            queryOption = new QueryOption();
        if (queryOption.select === "")
            queryOption.select = "Title";
        if(queryOption.order == undefined)
            queryOption.order = "Created desc";
        let result = await ApiBase.getItems(ApiBase.BASE_URI, MedicineDefinitionAPI.LIST_NAME, queryOption);
        result =  plainToClass(PagedData<MedicineDefinitionViewModel>, result);
        result.Data = plainToClass(MedicineDefinitionViewModel, result.Data);
        return result;
    }

    static async AddItem(item: MedicineDefinitionViewModel) {
        let [error,] = await ApiBase.addItem(ApiBase.BASE_URI, MedicineDefinitionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return null;

    }

    static async DeleteItem(item: MedicineDefinitionViewModel) {
        let [error,] = await ApiBase.deleteItem(ApiBase.BASE_URI, MedicineDefinitionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return null;
    }

    static async UpdateItem(item: MedicineDefinitionViewModel) {
        let [error,] = await ApiBase.updateItem(ApiBase.BASE_URI, MedicineDefinitionAPI.LIST_NAME, item);
        if (error)
            return error;
        else return null;
    }


}