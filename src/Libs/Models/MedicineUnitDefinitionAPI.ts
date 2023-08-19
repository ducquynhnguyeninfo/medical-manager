import { MedicineDefinition } from "../ViewModels/MedicineDefinitionViewModel";
import { MedicineUnitDefinition } from "../ViewModels/MedicineUnitDefinition";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class MedicineUnitDefinitionAPI {
    static async getItems(queryOption?: QueryOption): Promise<MedicineUnitDefinition[] | undefined> {
        if(queryOption == null) {
            queryOption = new QueryOption();
        }
        if (queryOption.select === "")
            queryOption.select = "Title,Code";

        let [error, result] = await ApiBase.getItems<MedicineUnitDefinition[]>(ApiBase.BASE_URI, "MedicineUnitDefinition", queryOption);
        if (error == null)
            return result;
        else
            return undefined;
    }
}