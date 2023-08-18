import { observer } from 'mobx-react-lite';
import React, { FC, useEffect, useState } from 'react';
import ListProductionLine from '../../Libs/Models/ListProductionLine';
import { useStore } from '../../Libs/Stores';
import { TestViewModel } from '../../Libs/ViewModels/TestViewModel';
import DefaultLayout from "../Layouts/DefaultLayout";

const DanhSachThuoc: FC<{}> = observer((props) => {
    const { sQuanLyThuocList, userContext } = useStore();
    const [test, setTest] = useState<Array<TestViewModel> | undefined>(undefined)
    useEffect(() => {
        ListProductionLine.getItems().then(result => {
            setTest(result);
        })
    }, [])

    useEffect(() => {
    }, [userContext])

    return (<DefaultLayout>
        {test != undefined && test.map(item => {
            return (<p>{item.Title}</p>)
        })}
    </DefaultLayout>)
})

export default DanhSachThuoc;