import { Box, Button, Grid, IconButton, Stack } from '@mui/material';
import MaterialReactTable, { MaterialReactTableProps, MRT_ColumnDef, MRT_PaginationState, MRT_RowSelectionState } from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useMemo, useState } from 'react';
import { useStore } from '../../Libs/Stores';
import { MedicineDefinitionViewModel } from '../../Libs/ViewModels/MedicineDefinitionViewModel';
import DefaultLayout from "../Layouts/DefaultLayout";
import { faCirclePlus, faTrash, faEdit, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AddMedicineModal } from './AddMedicineModal/AddMedicineModal';
import MedicineUnitDefinitionAPI from '../../Libs/Models/MedicineUnitDefinitionAPI';
import { DataConstant } from '../../Libs/Utils/DataConstant';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

const DanhSachThuoc: FC<{}> = observer((props) => {
    const { sDanhSachThuoc, sLinear } = useStore();
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [editSelectedItem, setEditSelectedItem] = useState<MedicineDefinitionViewModel>(new MedicineDefinitionViewModel())
    const { t } = useTranslation();
    const [isOpen, setOpen] = useState(false);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: DataConstant.PAGE_SIZE,
    });

    useEffect(() => {
        sDanhSachThuoc.loadMedicineList(0, DataConstant.PAGE_SIZE);

        if (sDanhSachThuoc.medicineUnitDefinitions.length <= 0) {
            MedicineUnitDefinitionAPI.getItems().then(result => {
                sLinear.set_isShow(false);
                sDanhSachThuoc.set_medicineUnitDefinitions(result.Data || [])
            })
        }
    }, [])

    useEffect(() => {
        sDanhSachThuoc.loadMedicineList(pagination.pageIndex, pagination.pageSize);
    }, [pagination])

    const handleMedicineDeleteClick = () => {
        Swal.fire({
            title: t('Bạn chắc chắn muốn xóa') + "?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: t('Đồng ý Xóa'),
            cancelButtonText: t('Hủy')
        }).then((result) => {
            if (result.isConfirmed) {
                let selectedData = sDanhSachThuoc.getSelectedItem(rowSelection);
                sDanhSachThuoc.delete_selectedMedicine(selectedData).then(error => {
                    if (error) {
                        Swal.fire({
                            title: t('Lỗi'),
                            text: t(error.message),
                            icon: 'error',
                            confirmButtonText: t("Xác nhận")
                        });
                    } else {
                        Swal.fire({
                            title: t('Thành công'),
                            text: t("Đã xóa thành công"),
                            icon: 'success',
                            confirmButtonText: t("Xác nhận")
                        });

                        sDanhSachThuoc.loadMedicineList(pagination.pageIndex, pagination.pageSize);
                        setRowSelection({});
                    }
                })
            }
        })
    }

    const columns = useMemo<MRT_ColumnDef<MedicineDefinitionViewModel>[]>(
        () =>
            [{
                accessorFn: (row) => row.Title,
                header: 'Tên thuốc',
                size: 40,
            },
            {
                accessorFn: (row) => row.Code,
                header: 'Mã thuốc',
                size: 120,
            },
            {
                accessorFn: (row) => row.CurrentQuantity,
                header: 'Số lượng thuốc hiện tại',
                size: 100,
            },
            {
                accessorFn: (row) => sDanhSachThuoc.getTenMaThuoc(row.Unit || ""),
                header: 'Đơn vị tính',
                size: 120,
            },
            {
                accessorFn: (row) => row.Description,
                header: 'Mô tả',
                size: 120
            },
            {
                accessorFn: (row) => (<IconButton color="primary" aria-label="add to shopping cart" onClick={() => handleEditButton(row)}>
                    <FontAwesomeIcon icon={faEdit} />
                </IconButton>),
                header: t('Hành động'),
                size: 120,
                enableEditing: true
            }
            ], []
    );

    const handleEditButton = (item: MedicineDefinitionViewModel) => {
        setEditSelectedItem(item);
        setOpen(true);
    }

    return (<DefaultLayout>
        <Stack spacing={2}>
            <Grid container>
                <Grid item md={6} xs={12}></Grid>
                <Grid item container md={6} xs={12} justifyContent="flex-end">
                    <Stack spacing={2} direction="row">
                        <Button variant="contained" color="error" endIcon={<FontAwesomeIcon icon={faTrash} />} onClick={handleMedicineDeleteClick} >
                            Xóa thuốc
                        </Button>
                        <Button variant="contained" endIcon={<FontAwesomeIcon icon={faCirclePlus} />} onClick={() => { setOpen(true); setEditSelectedItem(new MedicineDefinitionViewModel()) }} >
                            Thêm thuốc
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
            <MaterialReactTable
                columns={columns}
                manualPagination
                data={sDanhSachThuoc.medicineData.Data || []}
                rowCount={sDanhSachThuoc.medicineData.Total}
                enableRowSelection
                positionActionsColumn='last'
                onRowSelectionChange={setRowSelection}
                positionToolbarAlertBanner="bottom"
                onPaginationChange={setPagination}
                state={{
                    pagination: pagination,
                    rowSelection: rowSelection
                }}
            />
        </Stack>
        <AddMedicineModal open={isOpen} setOpen={setOpen} medicineUnitList={sDanhSachThuoc.medicineUnitDefinitions || []} medicineSelected={editSelectedItem}></AddMedicineModal>
    </DefaultLayout>)
})

export default DanhSachThuoc;