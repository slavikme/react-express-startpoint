import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Routes, matchPath, useLocation, useNavigate} from 'react-router-dom';
import Login from './Auth/Login';
import {ISessionContext, SessionContext, useSession} from "../provider/SessionContext";
import {Session} from "../model/Session";
import {
    Avatar, createTheme, styled, ThemeProvider, useTheme, Badge, CssBaseline,
    Drawer as MuiDrawer, Box, Toolbar, Typography, Divider,
    AppBar as MuiAppBar, AppBarProps as MuiAppBarProps, IconButton
} from "@mui/material";
import {
    Notifications as NotificationsIcon,
    ChevronLeft as ChevronLeftIcon,
    Menu as MenuIcon,
} from '@mui/icons-material';
import Copyright from "./Wrapper/Copyright";
import logo from "../logo.svg";
import {MenuItems} from "./Wrapper";
import {actionRoutes, elementRoutes} from "./routes";

const theme = createTheme();

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
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
                    width: theme.spacing(7),
                },
            }),
        },
    }),
);

const Authenticated = () => {
    const [open, setOpen] = React.useState(false);
    const {session} = useSession();
    const theme = useTheme();

    if (session.isGuest)
        return <Login/>;

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const transition = (props: any) => theme.transitions.create(props, {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    });

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar position="absolute" open={open}>
                <Toolbar sx={{pr: '24px'}}>
                    <Box sx={{
                        width: '40px', height: '40px', ml: -2, boxSizing: 'border-box', pl: '12px', overflowX: 'hidden',
                        transition: transition(['width', 'padding-left']),
                        ...(open && {
                            // display: 'none',
                            width: 0,
                            pl: 0,
                            transition: transition(['width', 'padding-left'])
                        })
                    }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                        ><MenuIcon/></IconButton>
                    </Box>
                    <Avatar alt="Logo" src={logo} sx={{
                        ml: 2, overflow: 'hidden',
                        transition: transition(['width', 'margin-left']),
                        ...(open && {
                            width: 0,
                            ml: 0,
                            transition: transition(['width', 'margin-left']),
                        })
                    }}/>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{flexGrow: 1, ml: 2}}
                    >
                        Dashboard
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: [1],
                    }}
                >
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Avatar alt="Logo" src={logo}/>
                        <Typography component="h1" variant="h6" sx={{ml: 1}}>Logo</Typography>
                    </Box>
                    <IconButton onClick={toggleDrawer}><ChevronLeftIcon/></IconButton>
                </Toolbar>
                <Divider/>
                <MenuItems/>
            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar/>
                <Routes>
                    {
                        elementRoutes.map(
                            ({name, path, element}) =>
                                <Route key={name} path={path} element={element}/>
                        )
                    }
                </Routes>
                <Copyright sx={{mt: 3, mb: 3}}/>
            </Box>
        </Box>
    )
}

function App() {
    const storageSession = Session.fromStorage();
    const [session, setSession] = useState<Session>(storageSession || new Session());
    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        session.logout();
        setSession(new Session());
    };

    const sessionContext: ISessionContext = {logout, session, setSession};

    useEffect(() => {
        const route = actionRoutes.find(route => matchPath(route.path, location.pathname))
        route?.action?.({route, navigate, sessionContext});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    return (
        <ThemeProvider theme={theme}>
            <SessionContext.Provider value={sessionContext}>
                {session.isGuest ? <Login/> : <Authenticated/>}
            </SessionContext.Provider>
        </ThemeProvider>
    );
}

export default App;
