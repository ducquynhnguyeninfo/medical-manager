import { Box, CssBaseline } from "@mui/material";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import * as React from "react";
import { Header } from "../HeaderComponent/Index";
import { Linear } from "../Linear/Index";
import { SliderMenu } from "../SliderMenu/MainListItems"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const defaultTheme = createTheme();
type Props = {
    children?: React.ReactNode
};

const DefaultLayout: React.FC<Props> = (props) => {
    return (<ThemeProvider theme={defaultTheme}>
        <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                            padding: "20px",
                            width: "100px"
                        }}
                    >
                        {props.children}
                    </Box>
                </Box>
            </LocalizationProvider>
        </StyledEngineProvider>
    </ThemeProvider>);
}

export default DefaultLayout;