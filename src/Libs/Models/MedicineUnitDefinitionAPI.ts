import { plainToClass } from "class-transformer";
import { MedicineUnitDefinition } from "../ViewModels/MedicineUnitDefinition";
import { PagedData } from "../ViewModels/PagedData";
import { ApiBase } from "./Base/ApiBase";
import { QueryOption } from "./Base/QueryOption";

export default class MedicineUnitDefinitionAPI {
    static async getItems(queryOption?: QueryOption<MedicineUnitDefinition>): Promise<PagedData<MedicineUnitDefinition>> {
        if (queryOption == null) {
            queryOption = new QueryOption();
        }
        queryOption.select = "ID,Title,Code";

        let result = await ApiBase.getItems(ApiBase.BASE_URI, "MedicineUnitDefinition", queryOption);
        result = plainToClass(PagedData<MedicineUnitDefinition>, result);
        result.Data = plainToClass(MedicineUnitDefinition, result.Data)
        return result;
    }
}