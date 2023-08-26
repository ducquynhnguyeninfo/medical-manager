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
    constructor(private store: Store) {
        makeObservable(this, {
            listData: observable,
            listTicketDetail: observable,
            loadSoLuongThuocChoTungTicket: action,
            set_listData: action,
            set_listTicketDetail: action
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

    async loadSoLuongThuocChoTungTicket(tickets: InputOutputTicketViewModel[]) {
        if(tickets.length <= 0)
            return [];

        let ticketIds = tickets.sort((a,b) => b.ID - a.ID);
        let max = ticketIds[0].ID;
        let min = ticketIds[ticketIds.length - 1].ID;
        let data = await InputOutputTicketDetailAPI.getItems({ select: "ID,TicketID", filter: `TicketID le ${max} && TicketID ge ${min}`, currentPageData: null, size: 10000 });
        return data.Data;
    }

    set_listData(data: PagedData<InputOutputTicketViewModel>) {
        this.listData = data;
    }

    set_listTicketDetail(data: InputOutputTicketDetailViewModel[]) {
        this.listTicketDetail = data;
    }
}