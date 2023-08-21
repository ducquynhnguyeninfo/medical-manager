import { observer } from "mobx-react-lite";
import { FC } from "react";
import { LinearProgress } from "@mui/material";
import { useStore } from "../../Libs/Stores";

export const Linear: FC<{top: string}> = observer((props) => {
    const { sLinear } = useStore();
    return (<LinearProgress color="secondary" style={{width: "100%", position: "absolute", top: props.top, height: "4px", display: (sLinear.isShow == true ? "block" : "none")}}/>)
});