import async from "async";
import { result } from "lodash-es";
import { action, makeObservable, observable } from "mobx";
import { AppointmentAPI } from "../Models/AppointmentAPI";
import { PrescriptionAPI } from "../Models/PrescriptionAPI";
import { AppointmentViewModel } from "../ViewModels/AppointmentViewModel";
import { PagedData } from "../ViewModels/PagedData";
import { PrescriptionViewModel } from "../ViewModels/PrescriptionViewModel";
import { Store } from "./Store";

export class AppointmentStore {
    listData: PagedData<AppointmentViewModel>;
    constructor(private store: Store) {
        makeObservable(this, {
            listData: observable,
            loadList: action
        })

        this.listData = new PagedData();
    }

    loadList(page: number, size: number) {
        this.store.sLinear.set_isShow(true);
        AppointmentAPI.getItems({
            select: "*",
            page: page, size: size, currentPageData: this.listData
        }).then(result => {
            this.store.sLinear.set_isShow(false);
            this.listData = result;
        })
    }

    saveAppointment(item: AppointmentViewModel) {
        if (item.ID == 0) {
            //add new
            return AppointmentAPI.AddItem(item);
        } else {
            return AppointmentAPI.UpdateItem(item);
        }
    }

    savePrescription(item: AppointmentViewModel, prescriptions: PrescriptionViewModel[]) {
        //select all old data
        let oldDataGetHandler = PrescriptionAPI.getItems({ select: "*", filter: "AppointmentID eq " + item.ID, currentPageData: null });

        let deleteHandler = (item: PrescriptionViewModel, callback: any) => {
            item.IsActive = false;
            item.IsHandled = false; //set false to job run again
            PrescriptionAPI.UpdateItem(item).then(result => {
                if (result instanceof Error)
                    callback(result.message);
                else
                    callback();
            });
        }

        let addHandler = (item: PrescriptionViewModel, callback: any) => {
            item.IsActive = true;
            PrescriptionAPI.AddItem(item).then(result => {
                if (result instanceof Error)
                    callback(result.message);
                else
                    callback();
            });
        }

        let promise = new Promise<Error | null>(async (resolve) => {
            let oldData = await oldDataGetHandler;
            if (item.ID != 0) {
                async.each(oldData.Data, deleteHandler, function (error) {
                    async.each(prescriptions, addHandler, function (err) {
                        if (err) {
                            resolve(err);
                        } else {
                            resolve(null)
                        }
                    });
                });
            } else {
                async.each(prescriptions, addHandler, function (err) {
                    if (err) {
                        resolve(err);
                    } else {
                        resolve(null)
                    }
                });
            }
        });
        return promise;
    }
}