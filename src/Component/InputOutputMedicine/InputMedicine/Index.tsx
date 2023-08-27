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
import { InputOutputTicketStatus } from "../../../Libs/Utils/InputOutputTicketStatusEnum";
import { InputOutputTicketDetailViewModel } from "../../../Libs/ViewModels/InputOutputTicketDetailViewModel";
import { InputOutputTicketViewModel } from "../../../Libs/ViewModels/InputOutputTicketViewModel";
import DefaultLayout from "../../Layouts/DefaultLayout";
import { MedicineInOutTable } from "./MedicineInOutTable";

export const InputMedicine: FC<{}> = observer((props) => {
    const [ticket, setTicket] = useState<InputOutputTicketViewModel>(new InputOutputTicketViewModel());
    const [ticketDetails, setTicketDetails] = useState<InputOutputTicketDetailViewModel[]>([]);
    const { sModal, sLinear, sInputOutputMedicine } = useStore();
    const navigate = useNavigate();
    let { ticketID } = useParams();

    useEffect(() => {
        sInputOutputMedicine.set_ticketID(ticketID || "");
        if (ticketID == null) {
            setTicket({ ...ticket, InputDate: moment().toDate() })
        } else {
            loadTicket(ticketID);
        }
    }, [])

    const loadTicket = (ticketID: string) => {
        InputOutputTicketAPI.GetItemByID(ticketID, { select: "*", currentPageData: null })
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
                sInputOutputMedicine.updateMedicineTable(ticketDetails);
                // navigate(routeConfig.NhapXuatThuoc.pattern);
            }
        });
    }

    const handleMedicineTableChange = (data: InputOutputTicketDetailViewModel[]) => {
        setTicketDetails([...data]);
    }

    const handleSendToApprover = () => {
        sInputOutputMedicine.sendToApprover(ticket).then(result => {
            if(result instanceof Error)  {
                sModal.ShowErrorMessage(result.message);
            } else {
                sModal.ShowSuccessMessage("Gửi duyệt thành công");
                loadTicket(ticketID || "");
            }
        });
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
                        <MedicineInOutTable detailList={ticketDetails} ticketID={ticketID || "0"} onChange={handleMedicineTableChange}></MedicineInOutTable>
                    </Grid>
                </Grid>
            </Grid>
            <Stack justifyContent={"space-between"} direction="row" spacing={2} style={{ marginTop: DataConstant.CONTAINER_PADDING }}>
                <Stack>
                    <Button color="inherit" variant="contained" onClick={() => navigate(routeConfig.NhapXuatThuoc.pattern)}>
                        {t("Quay lại danh sách")}
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    {(ticketDetails.filter(e => e.ID > 0).length > 0 && ticket.Status == InputOutputTicketStatus.CREATED) && (<Button color="secondary" variant="contained" disabled={sLinear.isShow} onClick={handleSendToApprover}>
                        {t("Gửi duyệt")}
                    </Button>)}
                    <Button color="primary" variant="contained" disabled={sLinear.isShow} onClick={handleSaveTicket}>
                        {t("Lưu phiếu xuất")}
                    </Button>
                </Stack>
            </Stack>
        </Paper>
    </DefaultLayout>)
})