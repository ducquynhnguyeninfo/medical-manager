import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem"

export class AppointmentViewModel extends BaseEntitySharePointItem {
    Title: string = "";
    EmployeeNumber: string | null = null;
    EmployeeName: string | null = null;
    AppointmentDate: Date | null = null;
    Symptom: string | null = null;
    DoctorEmail: string | null = null;
    MethodOfTreatment: string | null = null;
    BeginTreatment: Date| null = null;
    EndTreatment: Date | null = null;
    Note: string | null = null;
    Division: string | null = null;
    Department: string | null = null;

    __metadata: any = {
        "type": "SP.Data.AppointmentListItem"
    }
}