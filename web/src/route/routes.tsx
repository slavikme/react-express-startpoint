import React from 'react';
import {Dashboard} from "./Dashboard";
import {Login} from "./Auth";
import {Admin} from "./Admin";
import {Preferences} from "./Account";
import {NavigateFunction, Navigate} from "react-router-dom";
import {
    Login as LoginIcon,
    Logout as LogoutIcon,
    Dashboard as DashboardIcon,
    AdminPanelSettings as AdminIcon,
    Tune as TuneIcon,
    Home as HomeIcon,
} from "@mui/icons-material";
import {ISessionContext} from "../provider/SessionContext";

export interface IRoute {
    name: string;
    path: string;
    roles: string[];
    isVisibleInMenu?: boolean;
    menuName?: string;
    menuIcon?: JSX.Element;
    element?: JSX.Element;
    action?: (params: {
        route: IRoute,
        navigate: NavigateFunction,
        sessionContext: ISessionContext
        event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    }) => void;
}

const routes: IRoute[] = [
    {
        name: 'root',
        path: '/',
        roles: ['guest'],
        menuName: 'Home',
        menuIcon: <HomeIcon/>,
        element: <Navigate to='/dashboard' replace/>,
        isVisibleInMenu: true,
    }, {
        name: 'login',
        menuName: 'Login',
        path: '/login',
        element: <Login/>,
        isVisibleInMenu: false,
        roles: ['guest'],
        menuIcon: <LoginIcon/>,
    }, {
        name: 'dashboard',
        menuName: 'Dashboard',
        path: '/dashboard',
        element: <Dashboard/>,
        isVisibleInMenu: true,
        roles: ['user'],
        menuIcon: <DashboardIcon/>,
    }, {
        name: 'admin',
        menuName: 'Admin Panel',
        path: '/admin',
        element: <Admin/>,
        isVisibleInMenu: true,
        roles: ['admin'],
        menuIcon: <AdminIcon/>,
    }, {
        name: 'preferences',
        menuName: 'Preferences',
        path: '/preferences',
        element: <Preferences/>,
        isVisibleInMenu: true,
        roles: ['user'],
        menuIcon: <TuneIcon/>,
    }, {
        name: 'logout',
        menuName: 'Logout',
        path: '/logout',
        action: ({event, navigate, sessionContext}) => {
            event?.preventDefault();
            sessionContext.logout();
            navigate('/');
        },
        isVisibleInMenu: true,
        roles: ['user'],
        menuIcon: <LogoutIcon/>,
    },
];

export const elementRoutes = routes.filter(({element}) => element);
export const actionRoutes = routes.filter(({action}) => action);

export default routes;
