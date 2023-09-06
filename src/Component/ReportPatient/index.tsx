import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../Libs/Stores";
import { Button } from "@mui/material";
import "./index.css";
import DefaultLayout from "../Layouts/DefaultLayout";

export const ReportPatientComponent: FC<{}> = observer((props) => {
    const { userContext, sRequiredAuth } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        
        if (userContext != null) {
            // navigate(sRequiredAuth.redirectPath);
        }
    }, [userContext])
    return (<DefaultLayout>
    <div>
        <Button variant="contained" onClick={() => {

        }}>Xuất báo cáo bệnh nhân</Button>
    </div>
    </DefaultLayout>
    );
})