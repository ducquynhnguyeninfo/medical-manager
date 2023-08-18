import { observer } from "mobx-react-lite";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_PATH, routeConfig } from "../../Libs/Routers/Routes";
import { useStore } from "../../Libs/Stores";
import "./Index.css";

export const LoadingPageComponent: FC<{}> = observer((props) => {
    const { userContext,sRequiredAuth } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (userContext != null) {
            navigate(sRequiredAuth.redirectPath);
        }
    }, [userContext])
    return (<div className='container'>
        <div className='loader'>
            <div className='loader--dot'></div>
            <div className='loader--dot'></div>
            <div className='loader--dot'></div>
            <div className='loader--dot'></div>
            <div className='loader--dot'></div>
            <div className='loader--dot'></div>
            <div className='loader--text'></div>
        </div>
    </div>);
})