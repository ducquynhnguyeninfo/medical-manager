

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

class ImportExportReportService {
    pagedData: PagedData<MedicineReportItemViewModel>;

    constructor(private store: Store) {
        makeObservable(this, {
            pagedData: observable,
            reportMedicineInDuration: action
        })

        this.pagedData = new PagedData();
    }

    async reportMedicineInDuration(from: Date, to: Date)  {
        let importExportData = await InputOutputTicketAPI.getItems({
            select: "ID,Reason,InputDate,InputUser,IsInput,Created,Status", 
            filter: new FilterBuilder(new ConditionBuilder("InputDate", ComparisionOperator.n_greater_equal, `datetime'${ from.toISOString() }'`))
            .and(new ConditionBuilder("InputDate", ComparisionOperator.n_less_equal, `datetime'${to.toISOString()}'`))
            .build(),
            currentPageData: null
        });
        let imOutConditions = importExportData.Data.map((e) => new ConditionBuilder("ID", ComparisionOperator.s_equals, `${e.ID}`));
        if (imOutConditions.length === 0) {
            return;
        }
        let filterBuilder = new FilterBuilder(imOutConditions[0]);
        for (let i = 1; i < imOutConditions.length; i++) {
            filterBuilder.or(imOutConditions[i]);
        }

        let importExportDetailData = await InputOutputTicketDetailAPI.getItems({
            select: "Title,MedicineTitle,MedicineID, Quantity, MedicineUnit, TicketID, MedicineQuantityBefore, JobMessage, Modified,Created", 
            filter: filterBuilder.build(),
            currentPageData: null
        });

        let medicineReports = importExportDetailData.Data.map((item) => new MedicineReportItemViewModel(
            item.MedicineCategory,
            item.MedicineCode,
            item.MedicineTitle,
            item.MedicineUnit,
            item.MedicineQuantityBefore,
            // item.Med,
            item.Created,
            item.MedicineUnit,
            item.MedicineTitle,
            item.MedicineTitle,
            item.MedicineTitle,
        ));

        
        console.log(importExportDetailData);

        this.pagedData = this.convertToPagedData(medicineReports);
    }

    convertToPagedData(origin: MedicineReportItemViewModel[]): PagedData<MedicineReportItemViewModel> {
        let transform = plainToClass(PagedData<MedicineReportItemViewModel>, new PagedData<MedicineReportItemViewModel>());
        transform.Data = plainToClass(MedicineReportItemViewModel, origin);
        return transform;

    }
    
}

export default ImportExportReportService