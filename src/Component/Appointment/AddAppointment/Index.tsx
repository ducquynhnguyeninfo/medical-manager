import { Button, Checkbox, FormControlLabel, FormGroup, Grid, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import async from "async";
import dayjs from "dayjs";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentAPI } from "../../../Libs/Models/AppointmentAPI";
import { routeConfig } from "../../../Libs/Routers/Routes";
import { useStore } from "../../../Libs/Stores";
import { DataConstant } from "../../../Libs/Utils/DataConstant";
import { AppointmentViewModel } from "../../../Libs/ViewModels/AppointmentViewModel";
import { PrescriptionViewModel } from "../../../Libs/ViewModels/PrescriptionViewModel";
import DefaultLayout from "../../Layouts/DefaultLayout";
import { MedicineTable } from "./MedicineTable";
import React from "react";

export const AddAppointment: FC<{}> = observer((props) => {
    const [appointment, setAppointment] = useState<AppointmentViewModel>(new AppointmentViewModel());
    const [prescription, setPrescription] = useState<PrescriptionViewModel[]>([]);
    const { sModal, sLinear, sAppointment } = useStore();
    const navigate = useNavigate();
    let { appointmentID } = useParams();

    useEffect(() => {
        if (appointmentID == "0") {
            let newItem = new AppointmentViewModel();
            newItem.AppointmentDate = new Date();
            newItem.BeginTreatment = moment().toDate();
            newItem.EndTreatment = moment().add("minutes", 5).toDate();
            newItem.IsUseMedicine = true;
            newItem.IsRest = false;
            setAppointment(newItem);
        } else {
            loadAppointment(appointmentID || "");
        }
    }, [])

    const loadAppointment = (itemID: string) => {
        AppointmentAPI.GetItemByID(itemID, { select: "*", currentPageData: null })
            .then(result => {
                setAppointment(result || new AppointmentViewModel());
            })
    }

    const handleSaveTicket = () => {
        sLinear.set_isShow(true);
        console.log(appointment);
        sAppointment.saveAppointment(appointment).then(result => {
            sLinear.set_isShow(false);
            if (result instanceof Error) {
                sModal.ShowErrorMessage(result.message);
            } else {
                let id = result?.ID || 0;
                if (result == null)
                    id = parseInt(appointmentID || "0") || 0;

                prescription.forEach(e => {
                    e.AppointmentID = id;
                })

                sLinear.set_isShow(true);
                sAppointment.savePrescription(appointment, prescription).then(prescriptionResult => {
                    sLinear.set_isShow(false);
                    if (prescriptionResult instanceof Error) {
                        sModal.ShowErrorMessage(prescriptionResult.message);
                    } else {
                        sModal.ShowSuccessMessage("Lưu thành công");
                        navigate(routeConfig.AddAppointment.pattern.replace(":appointmentID", id.toString()));
                    }
                });
            }
        })
    }

    const handleMedicineTableChange = (data: PrescriptionViewModel[]) => {
        setPrescription([...data]);
    }

    return (<DefaultLayout>
        <Paper style={{ padding: (DataConstant.CONTAINER_PADDING) }}>
            <Typography variant="h6" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING }}>{t("Thông tin nhân viên xuống lấy thuốc")}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <DatePicker label="Ngày điều trị" slotProps={{ textField: { size: "small", fullWidth: true } }} format="DD-MM-YYYY" value={dayjs(appointment.AppointmentDate)}
                            onChange={(value) => {
                                if (value != null)
                                    setAppointment({ ...appointment, AppointmentDate: value.toDate() })
                            }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="MSNV" fullWidth size="small" value={appointment.EmployeeNumber || ""}
                            onChange={(event) => setAppointment({ ...appointment, EmployeeNumber: event.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Họ tên" fullWidth size="small" value={appointment.EmployeeName || ""}
                            onChange={(event) => setAppointment({ ...appointment, EmployeeName: event.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Khối" fullWidth size="small" value={appointment.Division || ""}
                            onChange={(event) => setAppointment({ ...appointment, Division: event.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Phòng ban" fullWidth size="small" value={appointment.Department || ""}
                            onChange={(event) => setAppointment({ ...appointment, Department: event.target.value })} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Người thực hiện" fullWidth size="small" value={appointment.DoctorEmail || ""}
                            onChange={(event) => setAppointment({ ...appointment, DoctorEmail: event.target.value })} />
                    </Grid>
                </Grid>
                <Grid item container xs={12} spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING, marginTop: DataConstant.CONTAINER_PADDING }}>Thông tin điều trị</Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TimePicker
                            label="Thời gian băt đầu điều trị" slotProps={{ textField: { size: "small", fullWidth: true } }} format="hh:mm" value={dayjs(appointment.BeginTreatment)}
                            onChange={(newValue) => {
                                if (newValue != null && appointment.AppointmentDate != null) {
                                    let day = dayjs(`${appointment.AppointmentDate.getFullYear()}-${appointment.AppointmentDate.getMonth() + 1}-${appointment.AppointmentDate.getDate()} ${newValue.hour()}-${newValue.minute()}`);
                                    setAppointment({ ...appointment, BeginTreatment: day.toDate() })
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TimePicker
                            label="Thời gian kết thúc điều trị" slotProps={{ textField: { size: "small", fullWidth: true } }} format="hh:mm" value={dayjs(appointment.EndTreatment)}
                            onChange={(newValue) => {
                                if (newValue != null && appointment.AppointmentDate != null) {
                                    let day = dayjs(`${appointment.AppointmentDate.getFullYear()}-${appointment.AppointmentDate.getMonth() + 1}-${appointment.AppointmentDate.getDate()} ${newValue.hour()}-${newValue.minute()}`);
                                    setAppointment({ ...appointment, EndTreatment: day.toDate() })
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormGroup sx={{ flexDirection: "row" }}>
                            <FormControlLabel control={<Checkbox checked={appointment.IsUseMedicine} onChange={event => setAppointment({ ...appointment, IsUseMedicine: event.target.checked })} />} label="Dùng thuốc" />
                            <FormControlLabel control={<Checkbox checked={appointment.IsRest} onChange={event => setAppointment({ ...appointment, IsRest: event.target.checked })} />} label="Nằm nghỉ" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <TextField id="standard-basic" label="Triệu chứng" fullWidth size="small" />
                    </Grid>
                </Grid>
                <Grid item container xs={12} spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING, marginTop: DataConstant.CONTAINER_PADDING }}>Danh sách thuốc nhập</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <MedicineTable detailList={prescription} appointmentID={appointmentID || "0"} onChange={handleMedicineTableChange}></MedicineTable>
                    </Grid>
                </Grid>
            </Grid>
            <Stack justifyContent={"space-between"} direction="row" spacing={2} style={{ marginTop: DataConstant.CONTAINER_PADDING }}>
                <Stack>
                    <Button color="inherit" variant="contained" onClick={() => navigate(routeConfig.Appointment.pattern)}>
                        {t("Quay lại danh sách")}
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button color="primary" variant="contained" disabled={sLinear.isShow} onClick={handleSaveTicket}>
                        {t("Lưu phiếu khám")}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    </DefaultLayout>)
})