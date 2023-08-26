import { Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import async from "async";
import dayjs from "dayjs";
import { t } from "i18next";
import { observer } from "mobx-react-lite";
import moment from "moment";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputOutputTicketAPI from "../../../Libs/Models/InputOutputTicketAPI";
import { InputOutputTicketDetailAPI } from "../../../Libs/Models/InputOutputTicketDetailAPI";
import { routeConfig } from "../../../Libs/Routers/Routes";
import { useStore } from "../../../Libs/Stores";
import { DataConstant } from "../../../Libs/Utils/DataConstant";
import { InputOutputTicketDetailViewModel } from "../../../Libs/ViewModels/InputOutputTicketDetailViewModel";
import { InputOutputTicketViewModel } from "../../../Libs/ViewModels/InputOutputTicketViewModel";
import DefaultLayout from "../../Layouts/DefaultLayout";
import { MedicineInOutTable } from "./MedicineInOutTable";

export const OutputMedicine: FC<{}> = observer((props) => {
    const [ticket, setTicket] = useState<InputOutputTicketViewModel>(new InputOutputTicketViewModel());
    const [ticketDetails, setTicketDetails] = useState<InputOutputTicketDetailViewModel[]>([]);
    const { sModal, sLinear } = useStore();
    const navigate = useNavigate();
    let { ticketID } = useParams();

    useEffect(() => {

        if (ticketID == null) {
            setTicket({ ...ticket, InputDate: moment().toDate() })
        } else {
            loadTicket(ticketID);
        }
    }, [])

    const loadTicket = (ticketID: string) => {
        InputOutputTicketAPI.GetItemByID(ticketID, { select: "ID,InputDate,Created,InputUser,Reason", currentPageData: null })
            .then(result => {
                setTicket(result || new InputOutputTicketViewModel());
            })
    }

    const handleSaveTicket = () => {
        sLinear.set_isShow(true);
        InputOutputTicketAPI.UpdateItem(ticket).then(result => {
            sLinear.set_isShow(false);
            if (result instanceof Error) {
                sModal.ShowErrorMessage(result.message)
            } else {
                updateMedicineTable(ticketDetails);
                // navigate(routeConfig.NhapXuatThuoc.pattern);
            }
        });
    }

    const deleteAllOldMedicineTable = async (ticketId: string) => {
        let data = await getAllOldTicketDetail(ticketId);

        if (data == null || data.Data.length <= 0)
            return;

        let deleteHandle = (item: InputOutputTicketDetailViewModel, callback: any) => {
            InputOutputTicketDetailAPI.DeleteItem(item).then(error => {
                if (error)
                    callback(error.message);
                else
                    callback();
            });
        }

        let promise = new Promise<Error | null>((resolve) => {
            async.each(data.Data, deleteHandle, function (err) {
                if (err) {
                    resolve(err);
                } else {
                    resolve(null)
                }
            });
        });
        return promise;
    }

    const getAllOldTicketDetail = async (ticketId: string) => {
        return InputOutputTicketDetailAPI.getItems({ select: "ID", filter: "TicketID eq " + ticketID, currentPageData: null });
    }

    const updateMedicineTable = (medicines: InputOutputTicketDetailViewModel[]) => {
        let addItemHandler = (item: InputOutputTicketDetailViewModel, callback: any) => {
            InputOutputTicketDetailAPI.AddItem(item).then(result => {
                if(result == null || result instanceof Error) {
                    callback(result?.message || "Có lỗi xảy ra");
                } else {
                    callback();
                }
            });
        };

        //delete old data
        sLinear.set_isShow(true);
        deleteAllOldMedicineTable(ticketID || "").then(error => {
            //insert new
            async.each(medicines, addItemHandler, function (err) {
                sLinear.set_isShow(false);
                if (err) {
                    sModal.ShowErrorMessage(err.message);
                } else {
                    sModal.ShowSuccessMessage("Cập nhật thành công");
                }
            });
        })
    }

    const handleMedicineTableChange = (data: InputOutputTicketDetailViewModel[]) => {
        setTicketDetails([...data]);
    }

    return (<DefaultLayout>
        <Paper style={{ padding: (DataConstant.CONTAINER_PADDING) }}>
            <Typography variant="h6" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING }}>{t("Thông tin xuất kho")}</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <DatePicker label="Ngày xuất" slotProps={{ textField: { size: "small", fullWidth: true } }} format="DD-MM-YYYY" value={dayjs(ticket.InputDate)}
                            onChange={(value) => {
                                if (value != null)
                                    setTicket({ ...ticket, InputDate: value.toDate() })
                            }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Email nhân viên xuất thuốc" fullWidth size="small" value={ticket.InputUser || ""}
                            onChange={(event) => setTicket({ ...ticket, InputUser: event.target.value })} />
                    </Grid>
                    {/* <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Họ tên nhân viên xuất thuốc" fullWidth size="small"/>
                    </Grid> */}
                </Grid>
                <Grid item xs={12} md={6} container spacing={2}>
                    <Grid item xs={12}>
                        <TextField id="standard-basic" label="Lý do xuất thuốc" fullWidth size="small" value={ticket.Reason || ""}
                            onChange={(event) => setTicket({ ...ticket, Reason: event.target.value })} />
                    </Grid>
                </Grid>
                <Grid item container xs={12} spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING, marginTop: DataConstant.CONTAINER_PADDING }}>Danh sách thuốc xuất</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <MedicineInOutTable detailList={ticketDetails} ticketID={ticketID || "0"} onChange={handleMedicineTableChange}></MedicineInOutTable>
                    </Grid>
                </Grid>
            </Grid>
            <Stack justifyContent={"space-between"} direction="row" spacing={2} style={{ marginTop: DataConstant.CONTAINER_PADDING }}>
                <Button color="inherit" variant="contained" onClick={() => navigate(routeConfig.NhapXuatThuoc.pattern)}>
                    {t("Quay lại danh sách")}
                </Button>
                <Button color="primary" variant="contained" disabled={sLinear.isShow} onClick={handleSaveTicket}>
                    {t("Lưu phiếu xuất")}
                </Button>
            </Stack>
        </Paper>
    </DefaultLayout>)
})