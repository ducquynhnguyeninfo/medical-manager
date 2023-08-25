import { Box, Tooltip, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, } from "@mui/material";
import MaterialReactTable, { MaterialReactTableProps, MRT_Row, MRT_ColumnDef } from "material-react-table";
import { observer } from "mobx-react-lite";
import { useState, useCallback, useMemo, FC, ChangeEvent, SyntheticEvent, useEffect } from "react";
import { faEdit, faRecycle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MedicineDefinitionViewModel } from "../../../Libs/ViewModels/MedicineDefinitionViewModel";
import MedicineDefinitionAPI from "../../../Libs/Models/MedicineDefinitionAPI";
import Autocomplete from '@mui/material/Autocomplete';
import { DataConstant } from "../../../Libs/Utils/DataConstant";
import { useTranslation } from "react-i18next";
import { InputOutputTicketDetailViewModel } from "../../../Libs/ViewModels/InputOutputTicketDetailViewModel";

export const MedicineInOutTable: FC<{ detailList: InputOutputTicketDetailViewModel[], onChange: (data: InputOutputTicketDetailViewModel[]) => void }> = observer((props) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});
    const { t } = useTranslation();

    const handleCreateNewRow = (values: InputOutputTicketDetailViewModel) => {
        props.detailList.push(values);
        let i = 1;
        props.detailList.forEach(e => {
            e.Stt = i++;
        });
        props.onChange(props.detailList);
    };

    const handleSaveRowEdits: MaterialReactTableProps<InputOutputTicketDetailViewModel>['onEditingRowSave'] =
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
        (row: MRT_Row<InputOutputTicketDetailViewModel>) => {
            props.detailList.splice(row.index, 1);
            props.onChange(props.detailList);
        },
        [props.detailList],
    );

    const handleDeleteButton = (item: InputOutputTicketDetailViewModel) => {

    }

    const columns = useMemo<MRT_ColumnDef<InputOutputTicketDetailViewModel>[]>(
        () => [
            {
                accessorFn: (item) => item.Stt,
                accessorKey: "Stt",
                header: t('STT'),
                size: 80,
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
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="left" title="Edit">
                            <IconButton onClick={() => table.setEditingRow(row)}>
                                <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <FontAwesomeIcon icon={faRecycle}></FontAwesomeIcon>
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
    columns: MRT_ColumnDef<InputOutputTicketDetailViewModel>[];
    onClose: () => void;
    onSubmit: (values: InputOutputTicketDetailViewModel) => void;
    open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
    open,
    columns,
    onClose,
    onSubmit,
}: CreateModalProps) => {
    const [values, setValues] = useState<InputOutputTicketDetailViewModel>(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {} as any),
    );
    const { t } = useTranslation();

    useEffect(() => {
        setValues(new InputOutputTicketDetailViewModel())
    }, [open])

    const [medicineFilter, setMedicineFilter] = useState<MedicineDefinitionViewModel[]>([])

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    const handleMedicineCodeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        MedicineDefinitionAPI.getItems({ select: "ID,Code,Title,Unit", filter: `startswith(Title,'${event.target.value}')`, page: 0, size: 20, currentPageData: null })
            .then(result => {
                setMedicineFilter(result.Data);
            })
    }

    const handleMedicineSelected = (event: SyntheticEvent<Element, Event>, newValue: MedicineDefinitionViewModel | null) => {
        if (newValue != null) {
            setValues({ ...values, MedicineCode: newValue.Code, MedicineTitle: newValue.Title, MedicineUnit: newValue.Unit })
        }
    }

    const isDisabled = (field: string | undefined) => {
        if (field == "MedicineTitle" || field == "MedicineUnit")
            return true;
        return false;
    }

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Thêm thuốc</DialogTitle>
            <DialogContent style={{ paddingTop: DataConstant.CONTAINER_PADDING }}>
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
                            onChange={(e) =>
                                setValues({ ...values, MedicineTitle: e.target.value })
                            }
                        />
                        <TextField
                            key="MedicineUnit"
                            label="Đơn vị"
                            name="MedicineUnit"
                            disabled={true}
                            value={values["MedicineUnit"] || ""}
                            type={"text"}
                            fullWidth
                            onChange={(e) =>
                                setValues({ ...values, MedicineUnit: e.target.value })
                            }
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