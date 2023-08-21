import { MedicineDefinition } from "../ViewModels/MedicineDefinitionViewModel";
import { MedicineUnitDefinition } from "../ViewModels/MedicineUnitDefinition";
import { PagedData } from "../ViewModels/PagedData";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class MedicineUnitDefinitionAPI {
    static async getItems(queryOption?: QueryOption): Promise<PagedData<MedicineUnitDefinition>> {
        if (queryOption == null) {
            queryOption = new QueryOption();
        }
        queryOption.select = "ID,Title,Code";

        let result = await ApiBase.getItems<MedicineUnitDefinition>(ApiBase.BASE_URI, "MedicineUnitDefinition", queryOption);
        return result;
    }
}