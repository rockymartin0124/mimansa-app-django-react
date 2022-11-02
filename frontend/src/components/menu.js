import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import { Link } from 'react-router-dom';
import SubMenu from './SubMenu';


const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
        }}
        transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& a': {
            // '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: 'white',
        },
        },
    },
}))(MenuItem);

const StyledLink = withStyles((theme) => ({
    root: {
        color: "black",
        // '&:hover': {
        //     textDecoration
        // }
        '&:focus, &:hover, &:visited, &:link, &:active': {
            textDecoration: 'none',
        }
    },
}))(Link);

const MainMenu = (props) => {
    const [showMaestrosMenu, setshowMaestrosMenu] = useState(false);
    const [showPackFromToteMenu, setshowPackFromToteMenu] = useState(false);

    const maestrosMenus = [
        {
          value: "Warehouse",
          link: "/warehouse/list",
        },
        {
          value: "Mapeo - Ubicación/Impresora",
          link: "/locnprintermap/list",
        },
      ];
    const packFromToteMenus = [
        {
            value: "Empacar Desde Tote",
            link: "/location",
          },
          {
            value: "Consulta de Tote",
            link: "/tote_detail",
          },
      ];

    return (
        <>
            <div style={{ backgroundColor: "#3f51b5", height: "64px", justifyContent: "center", display: "flex", alignItems: "flex-end", color: "white"}}>
                <nav className="flex space-x-2">
                    <div className="mt-auto font-bold text-gray-700 mx-20">
                        <div  className={`cursor-pointer relative border-white text-white hover:border-primary hover:text-white text-md p-3`}
                        onMouseEnter={() => setshowMaestrosMenu(true)}
                        onMouseLeave={() => setshowMaestrosMenu(false)}
                        >
                        <Link to="#">Maestros</Link>
                        <SubMenu
                            menuItems={maestrosMenus}
                            isShow={showMaestrosMenu}
                            orientation="right"
                        />
                        </div>
                    </div>
                    <div className="mt-auto font-bold text-gray-700 mx-20" >
                        <div  className={`cursor-pointer relative border-white text-white hover:border-primary hover:text-white text-md p-3`}
                        onMouseEnter={() => setshowPackFromToteMenu(true)}
                        onMouseLeave={() => setshowPackFromToteMenu(false)}
                        >
                        <Link to="#">Empacar Desde Tote</Link>
                        <SubMenu
                            menuItems={packFromToteMenus}
                            isShow={showPackFromToteMenu}
                            orientation="right"
                        />
                        </div>
                    </div>
                </nav>
            </div>
            <div className="">
                <div className="w-full">
                    {props.children}
                </div>
            </div>
        </>
    );
}

export default MainMenu;