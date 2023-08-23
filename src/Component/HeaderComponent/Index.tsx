import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { FC } from "react";
import { Badge, IconButton, Toolbar, Typography } from "@mui/material";
import { DRAWER_WIDTH } from "../../Libs/Constants";
import { useStore } from "../../Libs/Stores";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBars } from '@fortawesome/free-solid-svg-icons'
import { observer } from "mobx-react-lite";
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export var AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Header: FC<{}> = observer((props) => {
  const { sHeader } = useStore();

  return (<AppBar position="absolute" open={sHeader.isDrawerOpen}>
    <Toolbar
      sx={{
        pr: '24px', // keep right padding when drawer closed
      }}
    >
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={() => sHeader.toggle_DrawerOpen()}
        sx={{
          marginRight: '36px'
        }}
      >
        <FontAwesomeIcon icon={faBars}/>
      </IconButton>
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        Dashboard
      </Typography>
      <IconButton color="inherit">
        <Badge badgeContent={4} color="secondary">
          <FontAwesomeIcon icon={faBell}/>
        </Badge>
      </IconButton>
    </Toolbar>
  </AppBar>)
})
