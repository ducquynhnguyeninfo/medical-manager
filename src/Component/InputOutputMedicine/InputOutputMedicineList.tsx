import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack, Grid, Button, Chip } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef, MRT_PaginationState, MRT_RowSelectionState } from "material-react-table";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routeConfig } from "../../Libs/Routers/Routes";
import { useStore } from "../../Libs/Stores";
import { DataConstant } from "../../Libs/Utils/DataConstant";
import { InputOutputTicketViewModel } from "../../Libs/ViewModels/InputOutputTicketViewModel";
import DefaultLayout from "../Layouts/DefaultLayout";

export const InputOutputMedicineList: FC<{}> = observer((props) => {
    const { sInputOutputMedicine, sDanhSachThuoc } = useStore();
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: DataConstant.PAGE_SIZE,
    });
    const navigate = useNavigate();


    useEffect(() => {
        sInputOutputMedicine.loadList(0, DataConstant.PAGE_SIZE);
    }, [sInputOutputMedicine])

    const columns = useMemo<MRT_ColumnDef<InputOutputTicketViewModel>[]>(
        () =>
            [{
                accessorFn: (row) => moment(row.Created).format("DD-MM-YYYY hh:mm"),
                header: 'Ngày thực hiện',
                size: 40,
            },
            {
                accessorFn: (row) => row.MedicineCode,
                header: 'Mã thuốc',
                size: 120,
            },
            {
                accessorFn: (row) => row.MedicineTitle,
                header: 'Tên thuốc',
                size: 120,
            },
            {
                accessorFn: (row) => sDanhSachThuoc.getTenMaThuoc(row.MedicineUnit || ""),
                header: 'Đơn vị tính',
                size: 120,
            },
            {
                accessorFn: (row) => row.MedicineQuantity,
                header: 'Số lượng',
                size: 120,
            },
            {
                accessorFn: (row) => row.IsInput === true ? ( <Chip label="Nhập" color="primary" variant="filled" />): ( <Chip label="Xuất" color="warning" variant="filled" />),
                header: 'Hình thức',
                size: 120,
            }
            ], [sDanhSachThuoc]
    );

    return (<DefaultLayout>
        <Stack spacing={2}>
            <Grid container>
                <Grid item md={6} xs={12}></Grid>
                <Grid item container md={6} xs={12} justifyContent="flex-end">
                    <Stack spacing={2} direction="row">
                        {/* <Button variant="contained" color="secondary" endIcon={<FontAwesomeIcon icon={faTrash} />} onClick={handleMedicineDeleteClick} >
                            Xóa thuốc
                        </Button> */}
                        <Button variant="contained" endIcon={<FontAwesomeIcon icon={faCirclePlus} />} onClick={() => navigate(routeConfig.NhapThuoc.pattern)} >
                            Nhập kho
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <MaterialReactTable
                columns={columns}
                manualPagination
                data={sInputOutputMedicine.listData.Data || []}
                rowCount={sInputOutputMedicine.listData.Total}
                enableRowSelection
                onRowSelectionChange={setRowSelection}
                positionToolbarAlertBanner="bottom"
                onPaginationChange={setPagination}
                state={{
                    pagination: pagination,
                    rowSelection: rowSelection
                }}
            />
        </Stack>
        {/* <AddMedicineModal open={isOpen} setOpen={setOpen} medicineUnitList={sDanhSachThuoc.medicineUnitDefinitions || []}></AddMedicineModal> */}
    </DefaultLayout>)
});