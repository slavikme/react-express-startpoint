import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {Settings as SettingsIcon, Logout as LogoutIcon} from '@mui/icons-material';
import {NavLink, NavLinkProps, useNavigate} from "react-router-dom";
import {List} from "@mui/material";
import routes, {IRoute} from "../routes";
import {useSession} from "../../provider/SessionContext";

const CleanNavLink = (props: NavLinkProps) =>
    <NavLink {...props} style={{textDecoration: 'none', color: "initial"}}/>

export const mainListItems = (
    <>
        <CleanNavLink to="/">
            <ListItemButton>
                <ListItemIcon><DashboardIcon/></ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItemButton>
        </CleanNavLink>
        <CleanNavLink to="/admin">
            <ListItemButton>
                <ListItemIcon><LogoutIcon/></ListItemIcon>
                <ListItemText primary="Admin"/>
            </ListItemButton>
        </CleanNavLink>
    </>
);

export const secondaryListItems = (
    <>
        <ListSubheader component="div" inset>Account</ListSubheader>
        <CleanNavLink to="/preferences">
            <ListItemButton>
                <ListItemIcon><SettingsIcon/></ListItemIcon>
                <ListItemText primary="Preferences"/>
            </ListItemButton>
        </CleanNavLink>
        <CleanNavLink to="/logout">
            <ListItemButton>
                <ListItemIcon><AssignmentIcon/></ListItemIcon>
                <ListItemText primary="Logout"/>
            </ListItemButton>
        </CleanNavLink>
    </>
);

const MenuItems = () => {
    const sessionContext = useSession();
    const navigate = useNavigate();
    const {session} = sessionContext;
    const menuRoutes = routes.filter(({isVisibleInMenu, roles}) => isVisibleInMenu && session.hasRole(roles));

    const menuElement = (route: IRoute) => {
        const {name, menuName, path, menuIcon, action} = route;
        return (
            <CleanNavLink
                key={name}
                to={Array.isArray(path) ? path[0] : path}
                onClick={(event) => action?.({route, event, sessionContext, navigate})}
            >
                <ListItemButton>
                    <ListItemIcon>{menuIcon}</ListItemIcon>
                    <ListItemText primary={menuName}/>
                </ListItemButton>
            </CleanNavLink>
        );
    };

    return (
        <List component="nav">
            {menuRoutes.map(menuElement)}
            {/*{mainListItems}*/}
            {/*<Divider sx={{my: 1}}/>*/}
            {/*{secondaryListItems}*/}
        </List>
    )
}

export default MenuItems;
