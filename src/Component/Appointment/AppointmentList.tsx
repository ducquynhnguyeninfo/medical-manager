import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack, Grid, Button, IconButton } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef, MRT_PaginationState, MRT_RowSelectionState } from "material-react-table";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routeConfig } from "../../Libs/Routers/Routes";
import { useStore } from "../../Libs/Stores";
import { DataConstant } from "../../Libs/Utils/DataConstant";
import DefaultLayout from "../Layouts/DefaultLayout";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { AppointmentViewModel } from "../../Libs/ViewModels/AppointmentViewModel";

export const AppointmentList: FC<{}> = observer((props) => {
    const { sAppointment, sDanhSachThuoc, sModal, userContext } = useStore();
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: DataConstant.PAGE_SIZE,
    });
    const navigate = useNavigate();
    const { t } = useTranslation();


    useEffect(() => {
        sAppointment.loadList(0, DataConstant.PAGE_SIZE);
    }, [sAppointment])

    useEffect(() => {
        sAppointment.loadList(pagination.pageIndex, pagination.pageSize);
    }, [pagination])

    const handleAddClick = () => {
        navigate(routeConfig.AddAppointment.pattern.replaceAll(":appointmentID", "0"))
    }

    const handleEditButton = (row: AppointmentViewModel) => {
        navigate(routeConfig.AddAppointment.pattern.replaceAll(":appointmentID", row.ID.toString()))
    }

    const columns = useMemo<MRT_ColumnDef<AppointmentViewModel>[]>(
        () =>
            [{
                accessorFn: (row) => moment(row.AppointmentDate).format("DD-MM-YYYY hh:mm"),
                header: t('Ngày khám'),
                size: 40,
            },
            {
                accessorFn: (row) => row.EmployeeNumber,
                header: t('Mã bệnh nhân'),
                size: 120,
            },
            {
                accessorFn: (row) => row.EmployeeName,
                header: t('Tên bệnh nhân'),
                size: 120,
            },
            {
                accessorFn: (row) => row.Symptom,
                header: t('Triệu chứng'),
                size: 120,
            },
            // {
            //     accessorFn: (row) => sAppointment.listTicketDetail.filter(e => e.TicketID == row.ID).length,
            //     header: t('Số lượng thuốc nhập'),
            //     size: 120
            // },
            {
                accessorFn: (row) => {
                    return (<IconButton color="primary" aria-label="add to shopping cart" onClick={() => handleEditButton(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </IconButton>)
                },
                header: t('Hành động'),
                size: 120,
            }
            ], [sDanhSachThuoc]
    );

    return (<DefaultLayout>
        <Stack spacing={2}>
            <Grid container>
                <Grid item md={6} xs={12}>
                    <Stack spacing={2} direction="row" justifyContent="flex-start">
                        {/* <Button variant="contained" color="error" endIcon={<FontAwesomeIcon icon={faTrash} />} onClick={handleDeleteSelectedItem} >
                            Xóa {getRowSelected.length > 0 ? (<span style={{ padding: "0px 5px" }}>{getRowSelected.length}</span>) : ("")} phiếu
                        </Button> */}
                    </Stack>
                </Grid>
                <Grid item container md={6} xs={12} justifyContent="flex-end">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" endIcon={<FontAwesomeIcon icon={faCirclePlus} />} onClick={handleAddClick} >
                            Thêm phiếu khám
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <MaterialReactTable
                columns={columns}
                manualPagination
                data={sAppointment.listData.Data || []}
                rowCount={sAppointment.listData.Total}
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
    </DefaultLayout>)
});