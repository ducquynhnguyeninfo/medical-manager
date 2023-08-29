import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, InputLabel, MenuItem, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import MedicineDefinitionAPI from "../../../Libs/Models/MedicineDefinitionAPI";
import { useStore } from "../../../Libs/Stores";
import { MedicineDefinitionViewModel } from "../../../Libs/ViewModels/MedicineDefinitionViewModel";
import { MedicineUnitDefinition } from "../../../Libs/ViewModels/MedicineUnitDefinition";
import Select, { SelectChangeEvent } from '@mui/material/Select';

export const AddMedicineModal: FC<{
    open: boolean, medicineUnitList: MedicineUnitDefinition[], setOpen: (isOpen: boolean) => void,
    medicineSelected: MedicineDefinitionViewModel
}> = observer(props => {
    const { t } = useTranslation();
    const { sDanhSachThuoc, sLinear } = useStore();
    const [medicineItem, setMedicineItem] = useState<MedicineDefinitionViewModel>(new MedicineDefinitionViewModel());
    const [modalMessage, setModalMessage] = useState<string | null>(null);

    useEffect(() => {
        if (props.open == true) {
            //copy selected data
            setMedicineItem({ ...props.medicineSelected })
        }
        else {
            console.log(medicineItem)
            setMedicineItem(new MedicineDefinitionViewModel());
        }
    }, [props.open, props.medicineSelected])

    const handleClose = () => {
        props.setOpen(false);
    }

    const handleAdd = () => {
        sLinear.set_isShow(true);
        if (medicineItem.ID == 0) {
            medicineItem.CurrentQuantity = 0;
            MedicineDefinitionAPI.AddItem(medicineItem).then(result => {
                sLinear.set_isShow(false);
                if (result instanceof Error) {
                    setModalMessage(result.message);
                } else {
                    props.setOpen(false);
                    Swal.fire({
                        title: t('Thành công'),
                        text: t("Đã thêm thành công"),
                        icon: 'success',
                        confirmButtonText: t("Xác nhận")
                    });
                    sDanhSachThuoc.loadMedicineList(0, sDanhSachThuoc.medicineData.Size);
                }
            })
        } else {
            sLinear.set_isShow(true);
            sDanhSachThuoc.editItem(medicineItem).then(result => {
                sLinear.set_isShow(false);
                if (result instanceof Error) {
                    Swal.fire({
                        title: t('Lỗi'),
                        text: t(result.message),
                        icon: 'error',
                        confirmButtonText: t("Xác nhận")
                    });
                } else {
                    sDanhSachThuoc.loadMedicineList(0, sDanhSachThuoc.medicineData.Size);
                    props.setOpen(false);
                    Swal.fire({
                        title: t('Thành công'),
                        text: t("Cập nhật thành công"),
                        icon: 'success',
                        confirmButtonText: t("Xác nhận")
                    });
                }
            })
        }

    }

    return (<Dialog open={props.open} maxWidth="sm" fullWidth onClose={handleClose}>
        <DialogTitle>{t("Thông tin thuốc")}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {modalMessage != null && (<Alert severity="error">{modalMessage}</Alert>)}
            </DialogContentText>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Title"
                        label={t("Tên thuốc")}
                        type="text"
                        fullWidth
                        value={medicineItem.Title || ""}
                        variant="standard"
                        onChange={(event) => {
                            setMedicineItem({ ...medicineItem, Title: event.target.value })
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Code"
                        label={t("Mã thuốc")}
                        type="text"
                        fullWidth
                        variant="standard"
                        value={medicineItem.Code || ""}
                        onChange={(event) => {
                            setMedicineItem({ ...medicineItem, Code: event.target.value })
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Description"
                        label={t("Mô tả")}
                        type="text"
                        fullWidth
                        variant="standard"
                        value={medicineItem.Description || ""}
                        onChange={(event) => {
                            setMedicineItem({ ...medicineItem, Description: event.target.value })
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth style={{ marginTop: "16px" }}>
                        <InputLabel size="small" id="UnitControl">{t("Đơn vị tính")}</InputLabel>
                        <Select
                            labelId="UnitControl"
                            value={medicineItem.Unit || props.medicineUnitList[0]?.Code}
                            onChange={(event: SelectChangeEvent) => {
                                setMedicineItem({ ...medicineItem, Unit: event.target.value || "" })
                            }}
                            size="medium"
                            label={t("Đơn vị tính")}
                        >
                            {props.medicineUnitList.map(item => {
                                return (<MenuItem key={item.ID} value={item.Code}>{item.Title}</MenuItem>)
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

        </DialogContent>
        <DialogActions>
            <Button disabled={sLinear.isShow} onClick={handleClose}>{t("Hủy")}</Button>
            <Button disabled={sLinear.isShow} onClick={handleAdd}>{medicineItem.ID == 0 ? t("Thêm") : t("Cập nhật")}</Button>
        </DialogActions>
    </Dialog>);
});