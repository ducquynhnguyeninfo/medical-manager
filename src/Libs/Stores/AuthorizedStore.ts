import { UserContext } from "../Models/UserContext";
import { CurrentUserViewModel } from "../ViewModels/CurrentUserViewModel";
export class AuthorizedStore {
    userContext: CurrentUserViewModel | undefined;
    constructor() {
    }

    set_userContext(userContext: CurrentUserViewModel | undefined) {
        if(userContext != null)
            userContext.Roles = ["USER"];
        this.userContext = userContext;
    }
}
