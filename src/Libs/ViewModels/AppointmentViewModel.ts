import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem"

export class AppointmentViewModel extends BaseEntitySharePointItem {
    Title: string = "";
    EmployeeNumber: string | null = null; // patient
    EmployeeName: string | null = null; // patient
    AppointmentDate: Date | null = null;
    Symptom: string | null = null;
    DoctorEmail: string | null = null;
    IsUseMedicine: boolean = false;
    BeginTreatment: Date| null = null;
    EndTreatment: Date | null = null;
    Note: string | null = null;
    Division: string | null = null;
    Department: string | null = null;

    __metadata: any = {
        "type": "SP.Data.AppointmentListItem"
    }
}