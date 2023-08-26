import async from "async";
import { action, makeObservable, observable } from "mobx";
import InputOutputTicketAPI from "../Models/InputOutputTicketAPI";
import { InputOutputTicketDetailAPI } from "../Models/InputOutputTicketDetailAPI";
import { InputOutputTicketDetailViewModel } from "../ViewModels/InputOutputTicketDetailViewModel";
import { InputOutputTicketViewModel } from "../ViewModels/InputOutputTicketViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { Store } from "./Store";

export class InputOutputMedicineStore {
    listData: PagedData<InputOutputTicketViewModel>;
    listTicketDetail: InputOutputTicketDetailViewModel[] = [];
    ticketID: string = ""
    constructor(private store: Store) {
        makeObservable(this, {
            listData: observable,
            ticketID: observable,
            listTicketDetail: observable,
            loadSoLuongThuocChoTungTicket: action,
            set_listData: action,
            set_listTicketDetail: action,
            delete_selectedMedicine: action,
            updateMedicineTable: action,
            set_ticketID: action
        })

        this.listData = new PagedData();
    }

    loadList(page: number, size: number) {
        this.store.sLinear.set_isShow(true);
        InputOutputTicketAPI.getItems({
            select: "ID,Reason,InputDate,InputUser,IsInput,Created,Status"
            , page: page, size: size, currentPageData: this.listData
        }).then(result => {
            this.store.sLinear.set_isShow(false);
            if (result != null && result.Data.length > 0) {
                this.loadSoLuongThuocChoTungTicket(result.Data).then(ticketDetails => {
                    this.set_listTicketDetail(ticketDetails);
                    this.set_listData(result || []);
                })
            } else {
                this.set_listData(result || []);
            }
        })
    }

    set_ticketID(id: string) {
        this.ticketID = id;
    }

    //utils method
    async delete_selectedMedicine(selectedItems: Array<InputOutputTicketViewModel>): Promise<Error | null> {

        let deleteHandle = (item: InputOutputTicketViewModel, callback: any) => {
            InputOutputTicketAPI.DeleteItem(item).then(error => {
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

    async loadSoLuongThuocChoTungTicket(tickets: InputOutputTicketViewModel[]) {
        if(tickets.length <= 0)
            return [];

        let ticketIds = tickets.sort((a,b) => b.ID - a.ID);
        let max = ticketIds[0].ID;
        let min = ticketIds[ticketIds.length - 1].ID;
        let data = await InputOutputTicketDetailAPI.getItems({ select: "ID,TicketID", filter: `TicketID le ${max} && TicketID ge ${min}`, currentPageData: null, size: 10000 });
        return data.Data;
    }

    //utils method
    deleteAllOldMedicineTable = async (ticketId: string) => {
        let data = await this.getAllOldTicketDetail(ticketId);

        if (data == null || data.Data.length <= 0)
            return;

        let deleteHandle = (item: InputOutputTicketDetailViewModel, callback: any) => {
            InputOutputTicketDetailAPI.DeleteItem(item).then(error => {
                if (error)
                    callback(error.message);
                else
                    callback();
            });
        }

        let promise = new Promise<Error | null>((resolve) => {
            async.each(data.Data, deleteHandle, function (err) {
                if (err) {
                    resolve(err);
                } else {
                    resolve(null)
                }
            });
        });
        return promise;
    }

    async getAllOldTicketDetail(ticketID: string) {
        return InputOutputTicketDetailAPI.getItems({ select: "ID", filter: "TicketID eq " + ticketID, currentPageData: null });
    }

    async updateMedicineTable(medicines: InputOutputTicketDetailViewModel[]) {
        let addItemHandler = (item: InputOutputTicketDetailViewModel, callback: any) => {
            InputOutputTicketDetailAPI.AddItem(item).then(result => {
                if(result == null || result instanceof Error) {
                    callback(result?.message || "Có lỗi xảy ra");
                } else {
                    callback();
                }
            });
        };

        //delete old data
        this.store.sLinear.set_isShow(true);
        let root = this;
        this.deleteAllOldMedicineTable(root.ticketID || "").then(error => {
            //insert new
            async.each(medicines, addItemHandler, function (err) {
                root.store.sLinear.set_isShow(false);
                if (err) {
                    root.store.sModal.ShowErrorMessage(err.message);
                } else {
                    root.store.sModal.ShowSuccessMessage("Cập nhật thành công");
                }
            });
        })
    }

    set_listData(data: PagedData<InputOutputTicketViewModel>) {
        this.listData = data;
    }

    set_listTicketDetail(data: InputOutputTicketDetailViewModel[]) {
        this.listTicketDetail = data;
    }
}