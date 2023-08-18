import { TestViewModel } from "../ViewModels/TestViewModel";
import { ApiBase } from "./Base/ApiBase";

export default class ListProductionLine {
    static async getItems(select: string = "", expand: string = "", filter: string = "", order: string = ""): Promise<TestViewModel[] | undefined> {
        if (select === "")
            select = "Title";

        let [error, result] = await ApiBase.getItems<TestViewModel[]>(ApiBase.BASE_URI, "Test", select, expand, filter, order);
        if (error == null)
            return result;
        else
            return undefined;
    }
}