import { Store } from "./Store";
import { makeObservable, observable, action } from "mobx"
import MedicineDefinitionAPI from "../Models/MedicineDefinitionAPI";
import { MedicineDefinitionViewModel } from "../ViewModels/MedicineDefinitionViewModel";
import { MedicineUnitDefinition } from "../ViewModels/MedicineUnitDefinition";
import { PagedData } from "../ViewModels/PagedData";
import { MRT_RowSelectionState } from "material-react-table";
import async from "async"
class DanhSachThuocStore {
    medicineData: PagedData<MedicineDefinitionViewModel>;
    medicineUnitDefinitions: Array<MedicineUnitDefinition>;

    constructor(private store: Store) {
        makeObservable(this, {
            medicineData: observable,
            medicineUnitDefinitions: observable,
            loadMedicineList: action,
            getTenMaThuoc: action,
            set_medicineData: action,
            set_medicineUnitDefinitions: action,
            getSelectedItem: action
        });

        this.medicineData = new PagedData();
        this.medicineUnitDefinitions = [];
    }

    loadMedicineList(page: number, size: number) {
        this.store.sLinear.set_isShow(true);
        MedicineDefinitionAPI.getItems({ select: "ID,Title,Code,Unit,Description,Created", page: page, size: size, currentPageData: this.medicineData}).then(result => {
            this.store.sLinear.set_isShow(false);
            this.set_medicineData(result || []);
        })
    }

    set_medicineData(data: PagedData<MedicineDefinitionViewModel>) {
        this.medicineData = data;
    }

    set_medicineUnitDefinitions(data: Array<MedicineUnitDefinition>) {
        this.medicineUnitDefinitions = data;
    }

    async delete_selectedMedicine(selectedItems: Array<MedicineDefinitionViewModel>): Promise<Error | null> {

        let deleteHandle = (item: MedicineDefinitionViewModel, callback: any) => {
            MedicineDefinitionAPI.DeleteItem(item).then(error => {
                if (error)
                    callback(error.message);
                else
                    callback();
            });
        }

        let promise = new Promise<Error | null>((resolve) => {
            async.each(selectedItems, deleteHandle, function (err) {
                if (err) {
                    resolve(err);
                } else {
                    resolve(null)
                }
            });
        });

        return promise
    }

    getTenMaThuoc(code: string): string {
        let found = this.medicineUnitDefinitions.find(e => e.Code === code);
        if (found != null) {
            return found.Title || "";
        } else {
            return "";
        }
    }

    getSelectedItem(selectedState: MRT_RowSelectionState) {
        let selectedIndexs = Object.keys(selectedState);
        let selectedItems: Array<MedicineDefinitionViewModel> = [];

        selectedIndexs.forEach((item: string) => {
            if (this.medicineData !== null && this.medicineData.Data !== undefined) {
                let found = this.medicineData.Data[parseInt(item)];
                if (found != null)
                    selectedItems.push(found)
            }
        })
        return selectedItems;
    }

    async editItem(item: MedicineDefinitionViewModel){
        return MedicineDefinitionAPI.saveItem(item)
    }

}

export default DanhSachThuocStore;