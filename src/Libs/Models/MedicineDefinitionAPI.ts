import { MedicineDefinition } from "../ViewModels/MedicineDefinitionViewModel";
import { TestViewModel } from "../ViewModels/TestViewModel";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class MedicineDefinitionAPI {
    static async getItems(queryOption?: QueryOption): Promise<MedicineDefinition[] | undefined> {
        if (queryOption == null)
            queryOption = new QueryOption();
        if (queryOption.select === "")
            queryOption.select = "Title";

        let [error, result] = await ApiBase.getItems<MedicineDefinition[]>(ApiBase.BASE_URI, "MedicineDefinition", queryOption);
        if (error == null)
            return result;
        else
            return undefined;
    }

    static async AddItem(item: MedicineDefinition) {
        let [error,] = await ApiBase.addItem(ApiBase.BASE_URI, "MedicineDefinition", item);
        if (error)
            return error;
        else return null;

    }
}