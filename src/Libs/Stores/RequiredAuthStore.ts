import { Store } from "./Store";
import { makeObservable, observable, action } from "mobx"
import { BASE_PATH, routeConfig } from "../Routers/Routes";

export class RequiredAuthStore {
    redirectPath: string;
    constructor(private store: Store) {
        makeObservable(this, {
            redirectPath: observable,
            set_redirectPath: action
        });

        this.redirectPath = routeConfig.home.pattern;
    }

    set_redirectPath(path: string) {
        this.redirectPath = path;
    }
}