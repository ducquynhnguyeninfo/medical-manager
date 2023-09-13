

import { makeObservable, observable, action } from "mobx";
import { ConditionBuilder, ComparisionOperator, FilterBuilder } from "../../Models/Base/QueryOption";
import InputOutputTicketAPI from "../../Models/InputOutputTicketAPI"
import { InputOutputTicketDetailAPI } from "../../Models/InputOutputTicketDetailAPI"
import { InputOutputTicketViewModel } from "../../ViewModels/InputOutputTicketViewModel";
import { PagedData } from "../../ViewModels/PagedData";
import { Store } from "../Store";
import { InputOutputTicketDetailViewModel } from "../../ViewModels/InputOutputTicketDetailViewModel";
import { MedicineReportItemViewModel } from "../../ViewModels/MedicineReportItemViewModel";
import { plainToClass } from "class-transformer";
import { Title } from "@mui/icons-material";
import MedicineTransactionAPI from "../../Models/MedicineTransactionAPI";
import { AppointmentAPI } from "../../Models/AppointmentAPI";
import { PrescriptionAPI } from "../../Models/PrescriptionAPI";
import { PrescriptionViewModel } from "../../ViewModels/PrescriptionViewModel";
import MedicineDefinitionAPI from "../../Models/MedicineDefinitionAPI";
import { MedicineTransactionViewModel } from "../../ViewModels/MedicineTransactionViewModel";
import { MedicineDefinitionViewModel } from "../../ViewModels/MedicineDefinitionViewModel";

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
class MedicineImportExportReportService {
    pagedData: PagedData<MedicineReportItemViewModel>;

    constructor(private store: Store) {
        makeObservable(this, {
            pagedData: observable,
            reportMedicineInDuration: action,
            setPagedData: action
        })

        this.pagedData = new PagedData();
    }

    async getImExFromAppointments(appointmentFilter: FilterBuilder, transactionReportData: MedicineTransactionViewModel[], medicinesInfoData: MedicineDefinitionViewModel[]) {
        let appointments = await AppointmentAPI.getItems({
            select: 'ID,Title,BeginTreatment,EndTreatment,AppointmentDate,Symptom,DoctorEmail,EmployeeNumber,EmployeeName,Department,Division,IsUseMedicine',
            filter: appointmentFilter.build(),
            currentPageData: null
        });

        let imOutConditions = appointments.Data.map((e) => new ConditionBuilder("AppointmentID", ComparisionOperator.s_equals, `${e.ID}`));
        if (imOutConditions.length === 0) {
            return [];
        }

        let filterBuilder = new FilterBuilder();
        for (let i = 0; i < imOutConditions.length; i++) {
            filterBuilder.or(imOutConditions[i]);
        }

        let apointmentPrescription = await PrescriptionAPI.getItems({
            select: 'ID,Title,AppointmentID,MedicineID,MedicineCode,MedicineTitle,MedicineUnit,Quantity,IsActive,IsHandled,HandledDate,HandledMessage',
            filter: filterBuilder.build(),
            currentPageData: null,
        }
        );

        let appointmentData = appointments.Data;
        let prescriptionData = apointmentPrescription.Data;
        let compoundData: CompoundData[] = [];
        // console.log(apointmentPrescription);

        prescriptionData.map(pres => {
            let trans = transactionReportData.find(trans => trans.FromActionID == pres.AppointmentID);
            let medicineInfo = medicinesInfoData.find(medicine => medicine.ID == pres.MedicineID);
            compoundData.push({
                medicine_id: trans?.MedicineID,
                medicine_title: medicineInfo?.Title,
                medicine_code: medicineInfo?.Code,
                medicine_desc: medicineInfo?.Description,
                is_increase: trans?.IsIncrease,
                changed_value: trans?.ValueChange,
                new_value: trans?.NewValue,
                changed_date: pres.HandledDate,
                unit: medicineInfo?.Unit,
                is_approved: pres.IsHandled,
            });
        });

        return compoundData;
    }


    join2Array(key1: string, key2: string, array1: Array<any>, array2: Array<any>): any[] {
        let joinData: any[] = [];

        array1.map((item1) => {
            let result = array2.find((item2) => item2[key2] === item1[key1]);
            if (result != null) {
                joinData.push({ ...result, ...item1 });
            }
        })

        return joinData;
    }

    async getImportExportData(imExFilter: FilterBuilder, transactionReportData: MedicineTransactionViewModel[], medicinesInfoData: MedicineDefinitionViewModel[]) {
        let importExport = await InputOutputTicketAPI.getItems({
            select: "ID,Reason,InputDate,InputUser,IsInput,Created,Status",
            filter: imExFilter.build(),
            currentPageData: null
        });
        let imOutConditions = importExport.Data.map((e) => new ConditionBuilder("ID", ComparisionOperator.s_equals, `${e.ID}`));
        if (imOutConditions.length === 0) {
            return [];
        }
        let filterBuilder = new FilterBuilder();
        for (let i = 0; i < imOutConditions.length; i++) {
            filterBuilder.or(imOutConditions[i]);
        }
        // Lấy về tất cả import export detail
        let importExportDetail = await InputOutputTicketDetailAPI.getItems({
            select: "ID,Title,MedicineTitle,MedicineID,Quantity,MedicineUnit,TicketID,MedicineQuantityBefore,JobMessage,Modified,Created",
            filter: filterBuilder.build(),
            currentPageData: null
        });

        let compoundData: CompoundData[] = [];
        let importExportData = importExport.Data;
        let importExportDetailData = importExportDetail.Data;
        importExportDetailData?.map(ioDetail => {
            let trans = transactionReportData.find(trans => trans.FromActionID == ioDetail.TicketID);
            let io = importExportData?.find(io => io.ID == ioDetail.TicketID);
            let medicineInfo = medicinesInfoData.find(medicine => medicine.ID == ioDetail.MedicineID);
            compoundData.push({
                medicine_id: trans?.MedicineID,
                medicine_title: medicineInfo?.Title,
                medicine_code: medicineInfo?.Code,
                medicine_desc: medicineInfo?.Description,
                is_increase: trans?.IsIncrease,
                changed_value: trans?.ValueChange,
                new_value: trans?.NewValue,
                changed_date: io?.InputDate,
                unit: medicineInfo?.Unit,
                is_approved: true,
            });
        });

        return compoundData;
    }

    async reportMedicineInDuration(from: Date, to: Date) {

        // Lấy về tất cả medicine transaction trong khoảng thời gian [from: to]: bao gồm import/export và cả appointment 
        let medicalTransactions = await MedicineTransactionAPI.getItems({
            select: 'ID,Title,MedicineID,IsIncrease,NewValue,ValueChange,FromAction,FromActionID,Created',
            filter: FilterBuilder.beginWith(new ConditionBuilder("Created", ComparisionOperator.n_greater_equal, `datetime'${from.toISOString()}'`))
                .and(new ConditionBuilder("Created", ComparisionOperator.n_less_equal, `datetime'${to.toISOString()}'`))
                .build(),
            currentPageData: null
        }
        );
        let transactionReportData = medicalTransactions.Data;
        if (transactionReportData.length === 0) {
            return [];
        }

        let importExportTransactions = [];
        let importExportFilterBuilder = new FilterBuilder();
        let appointmentTransactions = [];
        let appointmentFilterBuilder = new FilterBuilder();

        transactionReportData.forEach((e) => {
            if ("INPUT_OUTPUT".toLowerCase() == e.FromAction?.toLowerCase()) {
                importExportTransactions.push(e);
                importExportFilterBuilder.or(new ConditionBuilder("ID", ComparisionOperator.n_equals, `${e.FromActionID}`));
            }
            if ("APPOINTMENT".toLowerCase() == e.FromAction?.toLowerCase()) {
                appointmentTransactions.push(e);
                appointmentFilterBuilder.or(new ConditionBuilder("ID", ComparisionOperator.n_equals, `${e.FromActionID}`));
            }
        });

        let medicinesInfo = await MedicineDefinitionAPI.getItems({
            select: 'ID,Title,Code,Unit,Description,Category,CurrentQuantity,CreatedBy,CreatedAt',
            filter: "",
            currentPageData: null,
            size: 0, // get all
        }
        );
        let medicinesInfoData = medicinesInfo.Data;

        let prescriptionData = await this.getImExFromAppointments(appointmentFilterBuilder, transactionReportData, medicinesInfoData);
        let ioData = await this.getImportExportData(importExportFilterBuilder, transactionReportData, medicinesInfoData);
        let compoundData: CompoundData[] = [...prescriptionData, ...ioData];

        const groupedMedicine = compoundData.reduce((group: Map<string, CompoundData[]>, item, index) => {
            if (group.get(item.medicine_code!) == null) {
                group.set(item.medicine_code!, []);
            }
            group.get(item.medicine_code!)!.push(item);
            return group;
        }, new Map());

        // Code, MedicineTitle, UsageDescription, Unit, BeginningInventory, ExpiryDate, ImportNumber, ExportNumber, EndingInventory, Note
        let reportData: MedicineReportItemViewModel[] = [];
        let count = 0;
        groupedMedicine.forEach((val: CompoundData[], key: string, map: Map<string, CompoundData[]>) => {
            if (val.length == 0)
                return;

            // sắp ngày nhập/xuất xếp theo thứ tự tăng dần
            let sorted = val.sort((a, b) => {
                if (a.changed_date! < b.changed_date!) {
                    return -1;
                }
                if (a.changed_date! > b.changed_date!) {
                    return 1;
                }
                return 0;
            });

            let importNumber = 0;
            let exportNumber = 0;

            let beginningInventory = sorted[0];
            let beginningInventoryNumber = 0;

            let endingInventory = sorted[sorted.length - 1];
            let endingInventoryNumber = 0;

            if (beginningInventory.is_increase) {
                beginningInventoryNumber = (beginningInventory.new_value ??= 0) - (beginningInventory.changed_value ??= 0);
            } else {
                beginningInventoryNumber = (beginningInventory.new_value ??= 0) + (beginningInventory.changed_value ??= 0);
            }

            endingInventoryNumber = endingInventory.new_value ??= 0;

            val.forEach(e => {
                if (e.is_increase) {
                    importNumber += (e.changed_value ??= 0);
                } else {
                    exportNumber += (e.changed_value ??= 0);
                }
            });
            count+=1;
            reportData.push(new MedicineReportItemViewModel(count, 
                beginningInventory.medicine_title,
                 beginningInventory.medicine_code, 
                 beginningInventory.medicine_desc, 
                 beginningInventory.unit, 
                 beginningInventoryNumber,
                  undefined, 
                  importNumber, 
                  exportNumber, 
                  endingInventoryNumber,
                   ""));
        });

        console.log(reportData);

        // this.pagedData = this.convertToPagedData(reportData);
        this.setPagedData(this.convertToPagedData(reportData));
    }

    convertToPagedData(origin: MedicineReportItemViewModel[]): PagedData<MedicineReportItemViewModel> {
        let transform = plainToClass(PagedData<MedicineReportItemViewModel>, new PagedData<MedicineReportItemViewModel>());
        transform.Data = plainToClass(MedicineReportItemViewModel, origin);
        return transform;

    }

    // This method will be wrapped into `action` automatically by `makeAutoObservable`
    setPagedData = (pagedData: PagedData<MedicineReportItemViewModel>) => {
        this.pagedData = pagedData
    }

}

export default MedicineImportExportReportService

