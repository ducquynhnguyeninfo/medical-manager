import { Expose } from "class-transformer";
import { BaseEntitySharePointItem } from "./BaseEntitySharePointItem"

export class AppointmentViewModel extends BaseEntitySharePointItem {
    @Expose() Title: string = "";
    @Expose() EmployeeName: string | null = null;
    @Expose() EmployeeNumber: string | null = null;
    @Expose() AppointmentDate: Date | null = null;
    @Expose() Symptom: string | null = null;
    @Expose() DoctorEmail: string | null = null;
    @Expose() BeginTreatment: Date | null = null;
    @Expose() EndTreatment: Date | null = null;
    @Expose() Note: string | null = null;
    @Expose() Division: string | null = null;
    @Expose() Department: string | null = null;
    @Expose() IsUseMedicine: boolean = true;
    @Expose() IsRest: boolean = false;

    __metadata: any = {
        "type": "SP.Data.AppointmentListItem"
    }
}