import { AuthorizedStore } from "./AuthorizedStore";
import { HeaderStore } from "./HeaderStore";
import { RequiredAuthStore } from "./RequiredAuthStore";
import { makeObservable, observable, action } from "mobx"
import { UserContext } from "../Models/UserContext";
import { LinearStore } from "./LinearStore";
import DanhSachThuocStore from "./QuanLyThuocListStore";
// import { routes, notFound } from "../Router/Routes";

export class Store extends AuthorizedStore {
    constructor() {
        super();

        makeObservable(this, {
            userContext: observable,
            sHeader: observable,
            sDanhSachThuoc: observable,
            sRequiredAuth: observable,
            sLinear: observable,
            set_userContext: action
        })

        this.sHeader = new HeaderStore(this);
        this.sDanhSachThuoc = new DanhSachThuocStore(this);
        this.sRequiredAuth = new RequiredAuthStore(this);
        this.sLinear = new LinearStore(this);

        UserContext.getCurrentUser().then(result => {
            this.set_userContext(result);
        })
    }
    
    sHeader : HeaderStore;
    sDanhSachThuoc : DanhSachThuocStore;
    sRequiredAuth : RequiredAuthStore;
    sLinear : LinearStore;
}
