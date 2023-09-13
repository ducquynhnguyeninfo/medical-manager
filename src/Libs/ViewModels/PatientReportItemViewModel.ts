import { makeObservable, observable } from "mobx";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem";
import { Moment } from "moment";

export class PatientReportItemViewModel {
    ID: number = 0;
    order: number | null;
    date: Date | null;
    patientName: string | null;
    patientDepartment: string | null;
    patientEmployeeNumber: string | null;
    beginTreatmentTime: Date | null;
    endTreatmentTime: Date | null;
    symptom: string | null;
    restTreatment: boolean = false;
    medicineTreatment: boolean = false;
    note: string | null;

    // "__metadata": any = { 'type': 'SP.Data.MedicineReportItemListItem' }

    constructor(
        order: number,
        date: Date | null,
        patientName: string | null,
        patientDepartment: string | null,
        patientEmployeeNumber: string | null,
        beginTreatmentTime: Date | null,
        endTreatmentTime: Date | null,
        symptom: string | null,
        restTreatment: boolean ,
        medicineTreatment: boolean,
        note: string | null,
    ) {

        this.order = order;
        this.date = date;
        this.patientName = patientName;
        this.patientDepartment = patientDepartment;
        this.patientEmployeeNumber = patientEmployeeNumber;
        this.beginTreatmentTime = beginTreatmentTime;
        this.endTreatmentTime = endTreatmentTime;
        this.symptom = symptom;
        this.restTreatment = restTreatment;
        this.medicineTreatment = medicineTreatment;
        this.note = note;


        makeObservable(this, {
            order: observable,
            date: observable,
            patientName: observable,
            patientDepartment: observable,
            patientEmployeeNumber: observable,
            beginTreatmentTime: observable,
            endTreatmentTime: observable,
            symptom: observable,
            restTreatment: observable,
            medicineTreatment: observable,
            note: observable,
        })
    }
}