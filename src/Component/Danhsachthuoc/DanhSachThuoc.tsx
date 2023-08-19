import { Button, Grid, Stack } from '@mui/material';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
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

    useEffect(() => {
        sDanhSachThuoc.loadMedicineList();

        MedicineUnitDefinitionAPI.getItems().then(result => {
            sLinear.set_isShow(false);
            sDanhSachThuoc.medicineUnitDefinitions = result || [];
        })
    }, [])

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
                <Grid item md={6} xs={12} spacing={2} textAlign="right">
                    <Button variant="contained" endIcon={<FontAwesomeIcon icon={faCirclePlus} />} onClick={() => setOpen(true)} >
                        Thêm thuốc
                    </Button>
                </Grid>
            </Grid>
            <MaterialReactTable
                columns={columns}
                data={sDanhSachThuoc.medicineData}
                initialState={{ pagination: { pageIndex: 0, pageSize: DataConstant.PAGE_SIZE } }}
                enableRowSelection
                positionToolbarAlertBanner="bottom"
            />
        </Stack>
        <AddMedicineModal open={isOpen} setOpen={setOpen} medicineUnitList={sDanhSachThuoc.medicineUnitDefinitions || []}></AddMedicineModal>
    </DefaultLayout>)
})

export default DanhSachThuoc;