import { makeObservable, observable } from "mobx";
import InputOutputTicketAPI from "../Models/InputOutputTicketAPI";
import { InputOutputTicketViewModel } from "../ViewModels/InputOutputTicketViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { Store } from "./Store";

export class InputOutputMedicineStore {
    listData: PagedData<InputOutputTicketViewModel>;
    constructor(private store: Store) {
        makeObservable(this, {
            listData: observable
        })

        this.listData = new PagedData();
    }

    loadList(page: number, size: number) {
        this.store.sLinear.set_isShow(true);
        InputOutputTicketAPI.getItems({ select: "MedicineCategory,MedicineCode, MedicineTitle, MedicineID,MedicineQuantity,MedicineUnit,Reason,InputDate,InputUser,MedicineQuantityBefore,IsInput,Created"
                    , page: page, size: size, currentPageData: this.listData}).then(result => {
            this.store.sLinear.set_isShow(false);
            this.set_listData(result || []);
        })
    }

    set_listData(data: PagedData<InputOutputTicketViewModel>) {
        this.listData = data;
    }
}