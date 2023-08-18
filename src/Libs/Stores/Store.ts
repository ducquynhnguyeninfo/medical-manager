import { AuthorizedStore } from "./AuthorizedStore";
import { HeaderStore } from "./HeaderStore";
import QuanLyThuocListStore from "./QuanLyThuocListStore";
import { RequiredAuthStore } from "./RequiredAuthStore";
import { makeObservable, observable, action } from "mobx"
import { UserContext } from "../Models/UserContext";
// import { routes, notFound } from "../Router/Routes";

export class Store extends AuthorizedStore {
    constructor() {
        super();

        makeObservable(this, {
            userContext: observable,
            sHeader: observable,
            sQuanLyThuocList: observable,
            sRequiredAuth: observable,
            set_userContext: action
        })

        this.sHeader = new HeaderStore(this);
        this.sQuanLyThuocList = new QuanLyThuocListStore(this);
        this.sRequiredAuth = new RequiredAuthStore(this);

        UserContext.getCurrentUser().then(result => {
            this.set_userContext(result);
        })
    }
    
    sHeader : HeaderStore;
    sQuanLyThuocList : QuanLyThuocListStore;
    sRequiredAuth : RequiredAuthStore;
}
