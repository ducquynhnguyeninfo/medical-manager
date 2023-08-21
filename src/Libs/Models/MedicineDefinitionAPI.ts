import { MedicineDefinition } from "../ViewModels/MedicineDefinitionViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { TestViewModel } from "../ViewModels/TestViewModel";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class MedicineDefinitionAPI {
    static async getItems(queryOption?: QueryOption): Promise<PagedData<MedicineDefinition>> {
        if (queryOption == null)
            queryOption = new QueryOption();
        if (queryOption.select === "")
            queryOption.select = "Title";

        return await ApiBase.getItems<MedicineDefinition>(ApiBase.BASE_URI, "MedicineDefinition", queryOption);
    }

    static async AddItem(item: MedicineDefinition) {
        let [error,] = await ApiBase.addItem(ApiBase.BASE_URI, "MedicineDefinition", item);
        if (error)
            return error;
        else return null;

    }
}