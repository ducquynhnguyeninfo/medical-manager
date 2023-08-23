import { action, makeObservable, observable } from "mobx";
import { Store } from "./Store";

export class LinearStore {
    isShow: boolean;

    constructor(private store: Store) {
        makeObservable(this, {
            isShow: observable,
            set_isShow: action
        });

        this.isShow = false;
    }

    set_isShow(v: boolean) {
        this.isShow = v;
    }
}