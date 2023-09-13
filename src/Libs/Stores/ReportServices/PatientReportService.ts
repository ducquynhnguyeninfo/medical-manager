

import { makeObservable, observable, action } from "mobx";
import { ConditionBuilder, ComparisionOperator, FilterBuilder } from "../../Models/Base/QueryOption";
import InputOutputTicketAPI from "../../Models/InputOutputTicketAPI"
import { InputOutputTicketDetailAPI } from "../../Models/InputOutputTicketDetailAPI"
import { InputOutputTicketViewModel } from "../../ViewModels/InputOutputTicketViewModel";
import { PagedData } from "../../ViewModels/PagedData";
import { Store } from "../Store";
import { InputOutputTicketDetailViewModel } from "../../ViewModels/InputOutputTicketDetailViewModel";
// import { PatientReportItemViewModel } from "../../ViewModels/PatientReportItemViewModel";
import { plainToClass } from "class-transformer";
import { Title } from "@mui/icons-material";
import MedicineTransactionAPI from "../../Models/MedicineTransactionAPI";
import { AppointmentAPI } from "../../Models/AppointmentAPI";
import { PrescriptionAPI } from "../../Models/PrescriptionAPI";
import { PrescriptionViewModel } from "../../ViewModels/PrescriptionViewModel";
import MedicineDefinitionAPI from "../../Models/MedicineDefinitionAPI";
import { MedicineTransactionViewModel } from "../../ViewModels/MedicineTransactionViewModel";
import { MedicineDefinitionViewModel } from "../../ViewModels/MedicineDefinitionViewModel";
import { PatientReportItemViewModel } from "../../ViewModels/PatientReportItemViewModel";

class IOData {
    ioData: InputOutputTicketViewModel[] | undefined;
    ioDetailData: InputOutputTicketDetailViewModel[] | undefined;
}

class CompoundData {
    medicine_id: number | undefined;
    medicine_title: string | undefined;
    medicine_code: string | undefined;
    medicine_desc: string | undefined;
    is_increase: boolean | undefined;
    changed_value: number | undefined;
    new_value: number | undefined;
    changed_date: Date | undefined | null;
    unit: string | undefined;
    is_approved: boolean | undefined;
}
class PatientReportService {
    pagedData: PagedData<PatientReportItemViewModel>;

    constructor(private store: Store) {
        makeObservable(this, {
            pagedData: observable,
            reportPatientInDuration: action,
            setPagedData: action
        })

        this.pagedData = new PagedData();
    }
 
    async reportPatientInDuration(from: Date, to: Date) {

        let appointments = await AppointmentAPI.getItems({
            select: 'ID,Title,BeginTreatment,EndTreatment,AppointmentDate,Symptom,DoctorEmail,EmployeeNumber,EmployeeName,Department,Division,IsUseMedicine',
            filter: FilterBuilder.beginWith(new ConditionBuilder("AppointmentDate", ComparisionOperator.n_greater_equal, `datetime'${from.toISOString()}'`))
            .and(new ConditionBuilder("AppointmentDate", ComparisionOperator.n_less_equal, `datetime'${to.toISOString()}'`))
            .build(),
            currentPageData: null
        });

        let appointmentData = appointments.Data;
 
        // Code, MedicineTitle, UsageDescription, Unit, BeginningInventory, ExpiryDate, ImportNumber, ExportNumber, EndingInventory, Note
        let reportData: PatientReportItemViewModel[] = [];

        // sắp ngày nhập/xuất xếp theo thứ tự tăng dần
        appointmentData.sort((a, b) => {
            if (a.AppointmentDate == b.AppointmentDate) {
                return a.BeginTreatment! < b.BeginTreatment! ? -1 : 1;
            }
            return a.AppointmentDate! < b.AppointmentDate! ? -1 : 1;
        });
        let count = 0;
        appointmentData.forEach(a => {
 
            count+=1;
            reportData.push(new PatientReportItemViewModel(count, a.AppointmentDate, a.EmployeeName, a.Department, a.EmployeeNumber, a.BeginTreatment, a.EndTreatment, a.Symptom, true, a.IsUseMedicine, a.Note));
        });

        console.log(reportData);

        this.setPagedData(this.convertToPagedData(reportData));
    }

    convertToPagedData(origin: PatientReportItemViewModel[]): PagedData<PatientReportItemViewModel> {
        let transform = plainToClass(PagedData<PatientReportItemViewModel>, new PagedData<PatientReportItemViewModel>());
        transform.Data = plainToClass(PatientReportItemViewModel, origin);
        return transform;

    }

    // This method will be wrapped into `action` automatically by `makeAutoObservable`
    setPagedData = (pagedData: PagedData<PatientReportItemViewModel>) => {
        this.pagedData = pagedData
    }

}

export default PatientReportService

