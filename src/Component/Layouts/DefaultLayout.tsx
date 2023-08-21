import { Box, CssBaseline } from "@mui/material";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { observer } from "mobx-react-lite";
import * as React from "react";
import { AppBar, Header } from "../HeaderComponent/Index";
import { Linear } from "../Linear/Index";
import { MainListItems, SliderMenu } from "../SliderMenu/MainListItems"
const defaultTheme = createTheme();
type Props = {
    children?: React.ReactNode
};

const DefaultLayout: React.FC<Props> = (props) => {
    return (<ThemeProvider theme={defaultTheme}>
        <StyledEngineProvider injectFirst>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Header></Header>
                <Linear top={"65px"} />
                <SliderMenu></SliderMenu>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        marginTop: "64px",
                        height: '100vh',
                        overflow: 'auto',
                        padding: "20px"
                    }}
                >
                    {props.children}
                </Box>
            </Box>
        </StyledEngineProvider>
    </ThemeProvider>);
}

export default DefaultLayout;