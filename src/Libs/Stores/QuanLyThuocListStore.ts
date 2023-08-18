import { Store } from "./Store";
import { makeAutoObservable } from "mobx"

class QuanLyThuocListStore {
    constructor(private store: Store) {
    }
}

export default QuanLyThuocListStore;