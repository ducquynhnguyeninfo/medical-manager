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
import { routeConfig } from "../../../Libs/Routers/Routes";
import { useStore } from "../../../Libs/Stores";
import { DataConstant } from "../../../Libs/Utils/DataConstant";
import { InputOutputTicketDetailViewModel } from "../../../Libs/ViewModels/InputOutputTicketDetailViewModel";
import { InputOutputTicketViewModel } from "../../../Libs/ViewModels/InputOutputTicketViewModel";
import DefaultLayout from "../../Layouts/DefaultLayout";
import { MedicineInOutTable } from "./MedicineInOutTable";

export const InputMedicine: FC<{}> = observer((props) => {
    const [ticket, setTicket] = useState<InputOutputTicketViewModel>(new InputOutputTicketViewModel());
    const [ticketDetails, setTicketDetails] = useState<InputOutputTicketDetailViewModel[]>([]);
    const { sModal } = useStore();
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
        InputOutputTicketAPI.UpdateItem(ticket).then(result => {
            if (result instanceof Error) {
                sModal.ShowErrorMessage(result.message)
            } else {
                sModal.ShowSuccessMessage("Cập nhật thành công");
                navigate(routeConfig.NhapXuatThuoc.pattern);
            }
        });
    }

    const deleteAllOldMedicineTable = (ticketId: string) => {

    }

    const getAllOldTicketDetail = async (ticketId: string) => {
        let result = await InputOutputTicketAPI.getItems({ select: "ID", filter: "TicketID eq " + ticketID, currentPageData: null });

        if (result == null || result.Data.length <= 0)
            return;

        let deleteHandle = (item: MedicineDefinitionViewModel, callback: any) => {
            MedicineDefinitionAPI.DeleteItem(item).then(error => {
                if (error)
                    callback(error.message);
                else
                    callback();
            });
        }
        
        let promise = new Promise<Error | null>((resolve) => {
            async.each(selectedItems, deleteHandle, function (err) {
                if (err) {
                    resolve(err);
                } else {
                    resolve(null)
                }
            });
        });
    }

    const updateMedicineTable = (meditine: InputOutputTicketDetailViewModel[]) => {

    }

    const handleMedicineTableChange = (data: InputOutputTicketDetailViewModel[]) => {
        setTicketDetails([...data]);
    }

    return (<DefaultLayout>
        <Paper style={{ padding: (DataConstant.CONTAINER_PADDING) }}>
            <Typography variant="h6" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING }}>Thông tin nhập kho</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <DatePicker label="Ngày nhập" slotProps={{ textField: { size: "small", fullWidth: true } }} format="DD-MM-YYYY" value={dayjs(ticket.InputDate)}
                            onChange={(value) => {
                                if (value != null)
                                    setTicket({ ...ticket, InputDate: value.toDate() })
                            }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Email nhân viên nhập thuốc" fullWidth size="small" value={ticket.InputUser || ""}
                            onChange={(event) => setTicket({ ...ticket, InputUser: event.target.value })} />
                    </Grid>
                    {/* <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Họ tên nhân viên nhập thuốc" fullWidth size="small"/>
                    </Grid> */}
                </Grid>
                <Grid item xs={12} md={6} container spacing={2}>
                    <Grid item xs={12}>
                        <TextField id="standard-basic" label="Lý do nhập thuốc" fullWidth size="small" value={ticket.Reason || ""}
                            onChange={(event) => setTicket({ ...ticket, Reason: event.target.value })} />
                    </Grid>
                </Grid>
                <Grid item container xs={12} spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING, marginTop: DataConstant.CONTAINER_PADDING }}>Danh sách thuốc nhập</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <MedicineInOutTable detailList={ticketDetails} onChange={handleMedicineTableChange}></MedicineInOutTable>
                    </Grid>
                </Grid>
            </Grid>
            <Stack justifyContent={"space-between"} direction="row" spacing={2} style={{ marginTop: DataConstant.CONTAINER_PADDING }}>
                <Button color="inherit" variant="contained" onClick={() => navigate(routeConfig.NhapXuatThuoc.pattern)}>
                    {t("Quay lại danh sách")}
                </Button>
                <Button color="primary" variant="contained" onClick={handleSaveTicket}>
                    {t("Lưu phiếu nhập")}
                </Button>
            </Stack>
        </Paper>
    </DefaultLayout>)
})