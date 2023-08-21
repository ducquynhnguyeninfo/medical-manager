import { Button, Grid, Stack } from '@mui/material';
import MaterialReactTable, { MRT_ColumnDef, MRT_PaginationState } from 'material-react-table';
import { observer } from 'mobx-react-lite';
import { FC, useEffect, useMemo, useState } from 'react';
import { useStore } from '../../Libs/Stores';
import { MedicineDefinition } from '../../Libs/ViewModels/MedicineDefinitionViewModel';
import DefaultLayout from "../Layouts/DefaultLayout";
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AddMedicineModal } from './AddMedicineModal/AddMedicineModal';
import MedicineUnitDefinitionAPI from '../../Libs/Models/MedicineUnitDefinitionAPI';
import { DataConstant } from '../../Libs/Utils/DataConstant';

const DanhSachThuoc: FC<{}> = observer((props) => {
    const { sDanhSachThuoc, sLinear } = useStore();
    const [isOpen, setOpen] = useState(false);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: DataConstant.PAGE_SIZE,
    });

    useEffect(() => {
        sDanhSachThuoc.loadMedicineList(0, DataConstant.PAGE_SIZE);

        MedicineUnitDefinitionAPI.getItems().then(result => {
            sLinear.set_isShow(false);
            sDanhSachThuoc.set_medicineUnitDefinitions(result.Data || [])
        })
    }, [])

    useEffect(() => {
        sDanhSachThuoc.loadMedicineList(pagination.pageIndex, pagination.pageSize);
    }, [pagination])

    const columns = useMemo<MRT_ColumnDef<MedicineDefinition>[]>(
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
                accessorFn: (row) => sDanhSachThuoc.getTenMaThuoc(row.Unit || ""),
                header: 'Đơn vị tính',
                size: 120,
            },
            {
                accessorFn: (row) => row.Description,
                header: 'Mô tả',
                size: 120,
            }
            ], []
    );

    return (<DefaultLayout>
        <Stack spacing={2}>
            <Grid container>
                <Grid item md={6} xs={12}></Grid>
                <Grid item md={6} xs={12}textAlign="right">
                    <Button variant="contained" endIcon={<FontAwesomeIcon icon={faCirclePlus} />} onClick={() => setOpen(true)} >
                        Thêm thuốc
                    </Button>
                </Grid>
            </Grid>
            <MaterialReactTable
                columns={columns}
                manualPagination
                data={sDanhSachThuoc.medicineData.Data || []}
                rowCount={sDanhSachThuoc.medicineData.Total}
                enableRowSelection
                positionToolbarAlertBanner="bottom"
                onPaginationChange={setPagination}
                state={{
                    pagination: pagination
                }}
            />
        </Stack>
        <AddMedicineModal open={isOpen} setOpen={setOpen} medicineUnitList={sDanhSachThuoc.medicineUnitDefinitions || []}></AddMedicineModal>
    </DefaultLayout>)
})

export default DanhSachThuoc;