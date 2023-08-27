import { ApprovalProcessViewModel } from "../ViewModels/ApprovalProcessViewModel";
import { ApiBase } from "./Base/ApiBase";

export class ApprovalProcessAPI {
    static LIST_NAME = "ApprovalProcess";

    static async AddItem(item: ApprovalProcessViewModel) {
        let [error, data] = await ApiBase.addItem<ApprovalProcessViewModel>(ApiBase.BASE_URI, ApprovalProcessAPI.LIST_NAME, item);
        if (error)
            return error;
        else return data;
    }
}