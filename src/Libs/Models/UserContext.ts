import { CurrentUserViewModel } from "../ViewModels/CurrentUserViewModel";
import { ApiBase } from "./Base/ApiBase";

export class UserContext {
    static async getCurrentUser() {
        let [error, result] = await ApiBase.get<CurrentUserViewModel>(ApiBase.BASE_URI + "/_api/web/currentuser?$select=Title,Email");
        if (error == null)
            return result;
        else
            return undefined;
    }
}