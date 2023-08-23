import { Box, Tooltip, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, MenuItem } from "@mui/material";
import MaterialReactTable, { MaterialReactTableProps, MRT_Row, MRT_ColumnDef } from "material-react-table";
import { observer } from "mobx-react-lite";
import { useState, useCallback, useMemo, FC } from "react";
import { Prescription } from "../../../Libs/ViewModels/PrescriptionViewModel";
import { faEdit, faRecycle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MedicineDefinitionViewModel } from "../../../Libs/ViewModels/MedicineDefinitionViewModel";
export const MedicineInOutTable: FC<{}> = observer((props) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState<Prescription[]>([]);
    const [medicineFilter, setMedicineFilter] = useState<MedicineDefinitionViewModel[]>();
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string;
    }>({});

    const handleCreateNewRow = (values: Prescription) => {
        tableData.push(values);
        setTableData([...tableData]);
    };

    const handleSaveRowEdits: MaterialReactTableProps<Prescription>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                tableData[row.index] = values;
                //send/receive api updates here, then refetch or update local table data for re-render
                setTableData([...tableData]);
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        (row: MRT_Row<Prescription>) => {
            // if (
            //     !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
            // ) {
            //     return;
            // }
            //send api delete request here, then refetch or update local table data for re-render
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData],
    );
    const columns = useMemo<MRT_ColumnDef<Prescription>[]>(
        () => [
            {
                accessorFn: (item) => item.Stt,
                header: 'STT',
                size: 80,
            },
            {
                accessorFn: (item) => item.MedicineCode,
                header: 'Mã thuốc',
                size: 140,
                // muiTableBodyCellEditTextFieldProps: {
                //     select: true,
                //     children: states.map((state) => (
                //         <MenuItem key={state} value={state}>
                //             {state}
                //         </MenuItem>
                //     )),
                // }
                muiTableBodyCellProps: ({ cell }) => ({
                    onChange: () => {
                        console.log(cell.getValue(), cell.id);
                    }
                })
            },
            {
                accessorFn: (item) => item.MedicineTitle,
                header: 'Tên thuốc',
                size: 140,
                // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                //     ...getCommonEditTextFieldProps(cell),
                // }),
            },
            {
                accessorFn: (item) => item.MedicineUnit,
                header: 'Đơn vị',
                // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                //     ...getCommonEditTextFieldProps(cell),
                //     type: 'email',
                // }),
            },
            {
                accessorFn: (item) => item.Quantity,
                header: 'Số lượng',
                size: 80,
                // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                //     ...getCommonEditTextFieldProps(cell),
                //     type: 'number',
                // }),
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
                data={tableData}
                editingMode="modal" //default
                positionActionsColumn="last"
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
    columns: MRT_ColumnDef<Prescription>[];
    onClose: () => void;
    onSubmit: (values: Prescription) => void;
    open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
    open,
    columns,
    onClose,
    onSubmit,
}: CreateModalProps) => {
    const [values, setValues] = useState<any>(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {} as any),
    );

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Thêm thuốc</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        {columns.filter(e => e.header != "STT").map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }
                            />
                        ))}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Create New Account
                </Button>
            </DialogActions>
        </Dialog>
    );
};