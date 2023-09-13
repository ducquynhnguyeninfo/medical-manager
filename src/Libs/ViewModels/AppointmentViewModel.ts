import { Expose } from "class-transformer";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem"

export class AppointmentViewModel extends BaseEntitySharePointItem {
    Title: string = "";
    EmployeeName: string | null = null;
    EmployeeNumber: string | null = null;
    AppointmentDate: Date | null = null;
    Symptom: string | null = null;
    DoctorEmail: string | null = null;
    BeginTreatment: Date | null = null;
    EndTreatment: Date | null = null;
    Note: string | null = null;
    Division: string | null = null;
    Department: string | null = null;
    IsUseMedicine: boolean = true;
    IsRest: boolean = false;

    __metadata: any = {
        "type": "SP.Data.AppointmentListItem"
    }
}