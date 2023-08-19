import { Store } from "./Store";
import { makeAutoObservable, makeObservable, observable, action } from "mobx"
import MedicineDefinitionAPI from "../Models/MedicineDefinitionAPI";
import { MedicineDefinition } from "../ViewModels/MedicineDefinitionViewModel";
import { MedicineUnitDefinition } from "../ViewModels/MedicineUnitDefinition";

class DanhSachThuocStore {
    medicineData: Array<MedicineDefinition>;
    medicineUnitDefinitions: Array<MedicineUnitDefinition>;

    constructor(private store: Store) {
        makeObservable(this, {
            medicineData: observable,
            medicineUnitDefinitions: observable,
            loadMedicineList: action,
            getTenMaThuoc: action
        });

        this.medicineData = [];
        this.medicineUnitDefinitions = [];
    }

    loadMedicineList() {
        this.store.sLinear.set_isShow(true);
        MedicineDefinitionAPI.getItems({ select: "Title,Code,Unit,Description" }).then(result => {
            this.store.sLinear.set_isShow(false);
            this.medicineData = result || [];
        })
    }

    getTenMaThuoc(code: string): string {
        let found = this.medicineUnitDefinitions.find(e => e.Code == code);
        if (found != null) {
            return found.Title || "";
        } else {
            return "";
        }
    }
}

export default DanhSachThuocStore;