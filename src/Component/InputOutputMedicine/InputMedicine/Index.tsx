import { Grid, Paper, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { observer } from "mobx-react-lite";
import { FC } from "react";
import { DataConstant } from "../../../Libs/Utils/DataConstant";
import DefaultLayout from "../../Layouts/DefaultLayout";
import { MedicineInOutTable } from "./MedicineInOutTable";

export const InputMedicine: FC<{}> = observer((props) => {
    return (<DefaultLayout>
        <Paper style={{ padding: (DataConstant.CONTAINER_PADDING) }}>
            <Typography variant="h6" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING }}>Thông tin nhập kho</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <DatePicker label="Ngày nhập" slotProps={{ textField: { size: "small", fullWidth: true } }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Email nhân viên nhập thuốc" fullWidth size="small" />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <TextField id="standard-basic" label="Họ tên nhân viên nhập thuốc" fullWidth size="small" />
                    </Grid>
                </Grid>
                <Grid item xs={12} container spacing={2}>
                    <Grid item xs={12}>
                        <TextField id="standard-basic" label="Lý do nhập thuốc" fullWidth size="small" />
                    </Grid>
                </Grid>
                <Grid item container xs={12} spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom style={{ marginBottom: DataConstant.CONTAINER_PADDING, marginTop: DataConstant.CONTAINER_PADDING  }}>Danh sách thuốc nhập</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <MedicineInOutTable></MedicineInOutTable>
                    </Grid>
                </Grid>
            </Grid>

        </Paper>
    </DefaultLayout>)
})