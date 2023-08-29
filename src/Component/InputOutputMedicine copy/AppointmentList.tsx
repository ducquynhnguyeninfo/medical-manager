import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Stack, Grid, Button, Chip, IconButton } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef, MRT_PaginationState, MRT_RowSelectionState } from "material-react-table";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import InputOutputTicketAPI from "../../Libs/Models/InputOutputTicketAPI";
import { routeConfig } from "../../Libs/Routers/Routes";
import { useStore } from "../../Libs/Stores";
import { DataConstant } from "../../Libs/Utils/DataConstant";
import { InputOutputTicketStatus } from "../../Libs/Utils/InputOutputTicketStatusEnum";
import { InputOutputTicketViewModel } from "../../Libs/ViewModels/InputOutputTicketViewModel";
import DefaultLayout from "../Layouts/DefaultLayout";
import { faEdit, faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
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

    // const getRowSelected = useMemo(() => {
    //     let selectedIndexs = Object.keys(rowSelection);
    //     let selectedItems: Array<InputOutputTicketViewModel> = [];

    //     selectedIndexs.forEach((item: string) => {
    //         if (sAppointment.listData !== null && sAppointment.listData.Data.length > 0) {
    //             let found = sAppointment.listData.Data[parseInt(item)];
    //             if (found != null)
    //                 selectedItems.push(found)
    //         }
    //     })
    //     return selectedItems;
    // }, [rowSelection]);

    const handleOutputAddClick = () => {
        let newItem = new InputOutputTicketViewModel();
        newItem.Status = InputOutputTicketStatus.CREATED;
        newItem.InputUser = userContext?.Email || "";
        newItem.Created = new Date();
        newItem.IsInput = false;
        newItem.InputDate = new Date();
        newItem.Reason = "";
        InputOutputTicketAPI.AddItem(newItem).then(result => {
            if (result instanceof Error) {
                sModal.ShowErrorMessage(result.message);
            } else {
                if (result == null)
                    sModal.ShowErrorMessage("Có lỗi khi tạo dữ liệu");
                else
                    navigate(routeConfig.XuatThuoc.pattern.replaceAll(":ticketID", result.ID.toString()))
            }
        });
    }

    const handleDeleteSelectedItem = () => {
        // Swal.fire({
        //     title: t('Bạn chắc chắn muốn xóa') + "?",
        //     icon: 'warning',
        //     showCancelButton: true,
        //     confirmButtonText: t('Đồng ý Xóa'),
        //     cancelButtonText: t('Hủy')
        // }).then((result) => {
        //     if (result.isConfirmed) {
        //         sAppointment.delete_selectedMedicine(getRowSelected).then(error => {
        //             if (error) {
        //                 Swal.fire({
        //                     title: t('Lỗi'),
        //                     text: t(error.message),
        //                     icon: 'error',
        //                     confirmButtonText: t("Xác nhận")
        //                 });
        //             } else {
        //                 Swal.fire({
        //                     title: t('Thành công'),
        //                     text: t("Đã xóa thành công"),
        //                     icon: 'success',
        //                     confirmButtonText: t("Xác nhận")
        //                 });

        //                 sAppointment.loadList(pagination.pageIndex, pagination.pageSize);
        //                 setRowSelection({});
        //             }
        //         })
        //     }
        // })
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