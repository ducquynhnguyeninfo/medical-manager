import { observer } from "mobx-react-lite";
import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { useStore } from "../../Libs/Stores";
import { Stack, Grid, Box, Paper, Button, Container, Typography, Card, IconButton } from "@mui/material";
import DefaultLayout from "../Layouts/DefaultLayout";
import MaterialReactTable, { MRT_ColumnDef, MRT_PaginationState, MRT_RowSelectionState } from "material-react-table";
import * as XLSX from 'xlsx';
import "./index.css";
import { MedicineReportItemViewModel } from "../../Libs/ViewModels/MedicineReportItemViewModel";
import moment from "moment";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { t } from "i18next";
import MedicineImportExportReportService from "../../Libs/Stores/ReportServices/MedicineImportExportReportService";
import { DatePicker } from "@mui/x-date-pickers";
import { DataConstant } from "../../Libs/Utils/DataConstant";
import { data } from "jquery";
import dayjs from "dayjs";
import React from "react";


export const ReportMedicineComponent: FC<{}> = observer((props) => {
    const { userContext, sRequiredAuth, sImportExportService } = useStore();
    const navigate = useNavigate();
    const columns = useMemo<MRT_ColumnDef<MedicineReportItemViewModel>[]>(
        () =>
            [
                {
                    accessorFn: (row) => row.Order,
                    header: t('Số thứ tự'),
                    size: 40,
                },
                {
                    accessorFn: (row) => row.Code,
                    header: t('Mã vật tư'),
                    size: 120,
                },
                {
                    accessorFn: (row) => row.MedicineTitle,
                    header: t('Danh mục thuốc'),
                    size: 120,
                },
                {
                    accessorFn: (row) => row.UsageDescription,
                    header: t('Công dụng'),
                    size: 120,
                },
                {
                    accessorFn: (row) => row.Unit,
                    header: t('Đơn vị tính'),
                    size: 40,
                },
                {
                    accessorFn: (row) => moment(row.ExpiryDate).format("DD-MM-YYYY hh:mm"),
                    header: t('Hạn sử dụng'),
                    size: 80,
                },
                {
                    accessorFn: (row) => row.BeginningInventory,
                    header: t('Tồn đầu kỳ'),
                    size: 80,
                },
                {
                    accessorFn: (row) => row.ImportNumber,
                    header: t('Nhập trong kỳ'),
                    size: 40,
                },
                {
                    accessorFn: (row) => row.ExportNumber,
                    header: t('Xuất trong kỳ'),
                    size: 40,
                },
                {
                    accessorFn: (row) => row.EndingInventory,
                    header: t('Tồn cuối kỳ'),
                    size: 80,
                },
                {
                    accessorFn: (row) => row.Note,
                    header: t('Ghi chú'),
                    size: 120,
                },
            ], []
    );



    const Item = styled(Container)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const now = new Date();
    const [startDate, setStartDate] = useState(moment(`${now.getMonth() + 1}/01/${now.getFullYear()}`).toDate());
    const [endDate, setEndDate] = useState(now);

    // let reportData = [];
    useEffect(() => {
        sImportExportService.reportMedicineInDuration(startDate, endDate);
    }, [userContext, startDate, endDate]);

    // let reportData = [];
    // useEffect(() => {
    //     sImportExportService.reportMedicineInDuration(moment("08/08/2023").toDate(), moment("09/09/2023").toDate());


    //     if (userContext != null) {
    //         // navigate(sRequiredAuth.redirectPath);
    //     }
    // }, [userContext]);

    return (
        <DefaultLayout>
            {/* <Card>

                <Typography variant="h3" component="h4">
                    Báo cáo thuốc
                </Typography>
            </Card>

            <Box sx={{ flexFlow: 1 }}>


                <Grid container spacing={2}>

                    <Grid item md={12} xs={12} justifyContent="flex-end">
                        <Button variant="contained" onClick={() => {

                        }}>Xuất báo cáo thuốc
                        </Button>
                    </Grid>
                </Grid>
            </Box> */}

            <Paper style={{ padding: (DataConstant.CONTAINER_PADDING), }} sx={{ my: DataConstant.SPACE_BETWEEN_TITLE_CONTENT }} >
                <Typography variant="h6" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING }}>{t("Báo cáo nhập - xuất thuốc")}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <DatePicker label="Từ ngày" slotProps={{ textField: { size: "small", fullWidth: true } }} format="DD-MM-YYYY"
                                value={dayjs(startDate)}
                                onChange={(newValue) => {
                                    if (newValue != null) {
                                        setStartDate(newValue.toDate());
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <DatePicker label="Đến ngày" slotProps={{ textField: { size: "small", fullWidth: true } }} format="DD-MM-YYYY"
                                value={dayjs(endDate)}
                                onChange={(newValue) => {
                                    if (newValue != null) {
                                        setEndDate(newValue.toDate());
                                    }
                                }}
                            />
                        </Grid>
                        <Button variant="contained" onClick={() => {
                            
                            const worksheet = XLSX.utils.json_to_sheet(sImportExportService.pagedData.Data);
                            const workbook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(workbook, worksheet, "Medicine");
                            
                            /* create an XLSX file and try to save to Medicine Import-Export.xlsx */
                            XLSX.writeFile(workbook, "Báo cáo nhập xuất thuốc.xlsx", { compression: true });

                        }}>Xuất báo cáo thuốc
                        </Button>
                    </Grid>
                </Grid>

            </Paper>
            <MaterialReactTable columns={columns} data={sImportExportService.pagedData.Data} ></MaterialReactTable>
        </DefaultLayout>
    );
})