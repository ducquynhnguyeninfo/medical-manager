import { Store } from "./Store";
import { makeAutoObservable, makeObservable, observable, action } from "mobx"
import MedicineDefinitionAPI from "../Models/MedicineDefinitionAPI";
import { MedicineDefinition } from "../ViewModels/MedicineDefinitionViewModel";
import { MedicineUnitDefinition } from "../ViewModels/MedicineUnitDefinition";
import { PagedData } from "../ViewModels/PagedData";

class DanhSachThuocStore {
    medicineData: PagedData<MedicineDefinition>;
    medicineUnitDefinitions: Array<MedicineUnitDefinition>;

    constructor(private store: Store) {
        makeObservable(this, {
            medicineData: observable,
            medicineUnitDefinitions: observable,
            loadMedicineList: action,
            getTenMaThuoc: action,
            set_medicineData: action,
            set_medicineUnitDefinitions: action
        });

        this.medicineData = new PagedData();
        this.medicineUnitDefinitions = [];
    }

    loadMedicineList(page: number, size: number) {
        this.store.sLinear.set_isShow(true);
        MedicineDefinitionAPI.getItems({ select: "ID,Title,Code,Unit,Description", page: page, size: size }).then(result => {
            this.store.sLinear.set_isShow(false);
            this.set_medicineData(result || []);
        })
    }

    set_medicineData(data: PagedData<MedicineDefinition>) {
        this.medicineData = data;
    }

    set_medicineUnitDefinitions(data: Array<MedicineUnitDefinition>) {
        this.medicineUnitDefinitions = data;
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