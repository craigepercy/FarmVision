import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard,
  Agriculture,
  Pets,
  People,
  AccountBalance,
  Build,
  Analytics,
  SmartToy,
  History,
  Notifications,
} from '@mui/icons-material';
import { List, ListItem, ListItemIcon, ListItemText, Drawer, Toolbar, Box } from '@mui/material';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Crop Management', icon: <Agriculture />, path: '/crops' },
  { text: 'Cattle Management', icon: <Pets />, path: '/cattle' },
  { text: 'Staff & Tasks', icon: <People />, path: '/staff' },
  { text: 'Finance', icon: <AccountBalance />, path: '/finance' },
  { text: 'Machinery', icon: <Build />, path: '/machinery' },
  { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
  { text: 'AI Assistant', icon: <SmartToy />, path: '/ai-assistant' },
  { text: 'Audit Trail', icon: <History />, path: '/audit' },
  { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
