import { Box, Tooltip, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Alert} from "@mui/material";
import MaterialReactTable, { MaterialReactTableProps, MRT_Row, MRT_ColumnDef } from "material-react-table";
import { observer } from "mobx-react-lite";
import { useState, useCallback, useMemo, FC, ChangeEvent, SyntheticEvent, useEffect } from "react";
import { faEdit, faRecycle, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MedicineDefinitionViewModel } from "../../../Libs/ViewModels/MedicineDefinitionViewModel";
import MedicineDefinitionAPI from "../../../Libs/Models/MedicineDefinitionAPI";
import Autocomplete from '@mui/material/Autocomplete';
import { DataConstant } from "../../../Libs/Utils/DataConstant";
import { useTranslation } from "react-i18next";
import { InputOutputTicketDetailViewModel } from "../../../Libs/ViewModels/InputOutputTicketDetailViewModel";
import { useStore } from "../../../Libs/Stores";
import { InputOutputTicketDetailAPI } from "../../../Libs/Models/InputOutputTicketDetailAPI";
import { PrescriptionViewModel } from "../../../Libs/ViewModels/PrescriptionViewModel";
import { PrescriptionAPI } from "../../../Libs/Models/PrescriptionAPI";

export const MedicineTable: FC<{ detailList: PrescriptionViewModel[], appointmentID: string, onChange: (data: PrescriptionViewModel[]) => void }> = observer((props) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const { t } = useTranslation();

    useEffect(() => {
        if (props.appointmentID != "0")
            loadMedicineData(props.appointmentID);
    }, [props.appointmentID])

    const handleCreateNewRow = (values: PrescriptionViewModel) => {
        values.AppointmentID = parseInt(props.appointmentID);
        props.detailList.push(values);
        props.onChange(props.detailList);
    };

    const loadMedicineData = (appointmentID: string) => {
        PrescriptionAPI.getItems({ select: "*", filter: "AppointmentID eq " + appointmentID + " and IsActive eq 1", currentPageData: null })
            .then(result => {
                props.onChange(result.Data);
            });
    }

    const handleSaveRowEdits: MaterialReactTableProps<PrescriptionViewModel>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                props.detailList[row.index] = values;
                //send/receive api updates here, then refetch or update local table data for re-render
                props.onChange(props.detailList);
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        (row: MRT_Row<PrescriptionViewModel>) => {
            props.detailList.splice(row.index, 1);
            props.onChange(props.detailList);
        },
        [props.detailList],
    );

    const columns = useMemo<MRT_ColumnDef<PrescriptionViewModel>[]>(
        () => [
            {
                header: t('STT'),
                size: 80,
                Cell: ({ cell, row }) => (<span>{row.index + 1}</span>)
            },
            {
                accessorFn: (item) => item.MedicineCode,
                accessorKey: "MedicineCode",
                header: t('Mã thuốc'),
                size: 140
            },
            {
                accessorFn: (item) => item.MedicineTitle,
                header: t('Tên thuốc'),
                accessorKey: "MedicineTitle",
                size: 140
            },
            {
                accessorFn: (item) => item.MedicineUnit,
                header: t('Đơn vị'),
                accessorKey: "MedicineUnit"
            },
            {
                accessorFn: (item) => item.Quantity,
                header: t('Số lượng'),
                accessorKey: "Quantity",
                size: 80
            }
        ], []
    );

    return (
        <>
            <MaterialReactTable
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 120,
                    },
                }}
                columns={columns}
                data={props.detailList}
                editingMode="modal" //default
                positionActionsColumn="last"
                enableRowActions={true}
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem', justifyContent: "space-around" }}>
                        {/* <Tooltip arrow placement="left" title="Edit">
                            <IconButton onClick={() => table.setEditingRow(row)}>
                                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                            </IconButton>
                        </Tooltip> */}
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <Button
                        color="secondary"
                        onClick={() => setCreateModalOpen(true)}
                        variant="contained"
                    >
                        Thêm thuốc
                    </Button>
                )}
            />
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
        </>
    );
});

interface CreateModalProps {
    columns: MRT_ColumnDef<PrescriptionViewModel>[];
    onClose: () => void;
    onSubmit: (values: PrescriptionViewModel) => void;
    open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
    open,
    columns,
    onClose,
    onSubmit,
}: CreateModalProps) => {
    const { sLinear, sModal } = useStore();
    const [medicineSelected, setMedicineSelected] = useState<MedicineDefinitionViewModel>(new MedicineDefinitionViewModel());
    const [error, setError] = useState("");
    const [values, setValues] = useState<PrescriptionViewModel>(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {} as any),
    );
    const { t } = useTranslation();

    useEffect(() => {
        setError("");
        setValues(new PrescriptionViewModel())
    }, [open])

    const [medicineFilter, setMedicineFilter] = useState<MedicineDefinitionViewModel[]>([])

    const handleSubmit = () => {
        if (medicineSelected.CurrentQuantity < values.Quantity) {
            setError("Số lượng thuốc không đủ");
            return;
        }

        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    const handleMedicineCodeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        sLinear.set_isShow(true);
        MedicineDefinitionAPI.getItems({ select: "ID,Code,Title,Unit,CurrentQuantity", filter: `startswith(Title,'${event.target.value}')`, page: 0, size: 20, currentPageData: null })
            .then(result => {
                sLinear.set_isShow(false);
                setMedicineFilter(result.Data);
            })
    }

    const handleMedicineSelected = (event: SyntheticEvent<Element, Event>, newValue: MedicineDefinitionViewModel | null) => {
        if (newValue != null) {
            setMedicineSelected(newValue);
            setValues({ ...values, MedicineCode: newValue.Code, MedicineTitle: newValue.Title, MedicineUnit: newValue.Unit, MedicineID: newValue.ID, Quantity: 0 });
        }
    }

    const isDisabled = (field: string | undefined) => {
        if (field == "MedicineTitle" || field == "MedicineUnit")
            return true;
        return false;
    }

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">{t("Thêm thuốc")}</DialogTitle>
            <DialogContent style={{ paddingTop: DataConstant.CONTAINER_PADDING }}>
                {error != "" && (<Alert severity="error" style={{ marginBottom: DataConstant.SPACE_BETWEEN_TITLE_CONTENT }}>{error}</Alert>)}
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        <Autocomplete
                            id="combo-box-demo"
                            key="MedicineCode"
                            fullWidth
                            options={medicineFilter}
                            getOptionLabel={(option: MedicineDefinitionViewModel) => option.Title || ""}
                            onChange={handleMedicineSelected}
                            renderInput={(params) => <TextField  {...params} label="Mã thuốc" InputLabelProps={{}} onChange={handleMedicineCodeChange} />}
                        />
                        <TextField
                            key="MedicineTitle"
                            label="Tên thuốc"
                            name="MedicineTitle"
                            disabled={true}
                            value={values["MedicineTitle"] || ""}
                            type={"text"}
                            fullWidth
                        />
                        <TextField
                            key="MedicineUnit"
                            label="Đơn vị"
                            name="MedicineUnit"
                            disabled={true}
                            value={values["MedicineUnit"] || ""}
                            type={"text"}
                            fullWidth
                        />
                        <TextField
                            key="Quantity"
                            label="Số lượng"
                            name="Quantity"
                            value={values["Quantity"] || ""}
                            type={"number"}
                            fullWidth
                            onChange={(e) =>
                                setValues({ ...values, Quantity: parseInt(e.target.value) })
                            }
                        />
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>{t("Hủy")}</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    {t("Thêm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};