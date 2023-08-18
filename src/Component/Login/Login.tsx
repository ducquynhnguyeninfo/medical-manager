import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";

export const Login : FC<{}> = observer(props => {

    useEffect(() => {
        window.location.href = "https://tanhiepphat.sharepoint.com/sites/e-form-test/quanlythuoc/SiteAssets";
    },[]);
    return (<>
    </>)
});