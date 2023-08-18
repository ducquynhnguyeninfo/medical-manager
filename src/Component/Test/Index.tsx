import { observer } from "mobx-react-lite";
import { FC } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";

export const Test : FC<{}> = observer((props) => {
    return (<DefaultLayout>
        <p>Test</p>
    </DefaultLayout>)
})