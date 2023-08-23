import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';
import { routeConfig } from '../../Libs/Routers/Routes';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { DRAWER_WIDTH } from '../../Libs/Constants';
import { Divider, IconButton, List, Toolbar } from '@mui/material';
import { useStore } from '../../Libs/Stores';
import { observer } from 'mobx-react-lite';

var Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export const MainListItems: React.FC<{}> = observer(() => {
  const navigate = useNavigate();

  const redirect = (path: string) => {
    navigate(path)
  }
  return (
    <React.Fragment>
      <ListItemButton>
        <ListItemIcon>
        </ListItemIcon>
        <ListItemText primary="Danh mục thuốc" onClick={() => redirect(routeConfig.home.pattern)} />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
        </ListItemIcon>
        <ListItemText primary="Quản lý kho thuốc" onClick={() => redirect(routeConfig.NhapXuatThuoc.pattern)} />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
        </ListItemIcon>
        <ListItemText primary="Quản lý đơn vị thuốc" />
      </ListItemButton>
    </React.Fragment>)
})


export const SliderMenu: React.FC<{}> = observer((props) => {
  const {sHeader} = useStore();

  return (<Drawer variant="permanent" open={sHeader.isDrawerOpen}>
    <Toolbar
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: [1],
      }}
    >
      <IconButton>
        {/* <ChevronLeftIcon /> */}
      </IconButton>
    </Toolbar>
    <Divider />
    <List component="nav">
      <MainListItems></MainListItems>
      <Divider sx={{ my: 1 }} />
      {/* {secondaryListItems} */}
    </List>
  </Drawer>)
})