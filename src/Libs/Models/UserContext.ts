import { plainToClass } from "class-transformer";
import { CurrentUserViewModel } from "../ViewModels/CurrentUserViewModel";
import { ApiBase } from "./Base/ApiBase";

export class UserContext {
    static async getCurrentUser() {
        let [error, result] = await ApiBase.get(ApiBase.BASE_URI + "/_api/web/currentuser?$select=Title,Email");
        if (error == null)
            return plainToClass(CurrentUserViewModel, result);
        else
            return undefined;
    }
}