import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Feed as FeedIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
}

const drawerWidth = 240;

const Sidebar: React.FC<SidebarProps> = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainMenuItems = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { name: "Search", icon: <SearchIcon />, path: "/search" },
    { name: "Threat Feeds", icon: <FeedIcon />, path: "/feeds" },
    {
      name: "Visualizations",
      icon: <AssessmentIcon />,
      path: "/visualizations",
    },
  ];

  const reportMenuItems = [
    { name: "Reports", icon: <DescriptionIcon />, path: "/reports" },
    { name: "Compliance", icon: <SecurityIcon />, path: "/compliance" },
  ];

  const adminMenuItems = [
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          position: "relative",
          whiteSpace: "nowrap",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          ...(!open && {
            overflowX: "hidden",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            width: (theme) => theme.spacing(7),
          }),
        },
      }}
    >
      <Toolbar />
      <List component="nav">
        {mainMenuItems.map((item) => (
          <ListItemButton
            key={item.name}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}

        <Divider sx={{ my: 1 }} />

        <ListSubheader component="div" inset>
          Reports
        </ListSubheader>
        {reportMenuItems.map((item) => (
          <ListItemButton
            key={item.name}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}

        <Divider sx={{ my: 1 }} />

        <ListSubheader component="div" inset>
          Administration
        </ListSubheader>
        {adminMenuItems.map((item) => (
          <ListItemButton
            key={item.name}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
