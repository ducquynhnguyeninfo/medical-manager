import { CurrentUserViewModel } from "../ViewModels/CurrentUserViewModel";
export class AuthorizedStore {
    userContext: CurrentUserViewModel | undefined;

    constructor() {
    }
    set_userContext(userContext: CurrentUserViewModel | undefined) {
        this.userContext = userContext;
    }
}
