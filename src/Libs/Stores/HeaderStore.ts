import { Store } from "./Store";
import { makeObservable, observable, action } from "mobx"

export class HeaderStore {
    isDrawerOpen : boolean = true;
    constructor(private store: Store) {
        makeObservable(this, {
            isDrawerOpen: observable,
            toggle_DrawerOpen: action
        });
    }

    toggle_DrawerOpen() {
        this.isDrawerOpen = !this.isDrawerOpen;
    }
}