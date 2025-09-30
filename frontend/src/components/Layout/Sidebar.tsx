import React, { useState, useEffect } from 'react';
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
  Menu as MenuIcon,
  Close
} from '@mui/icons-material';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Drawer, 
  Toolbar, 
  Box,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [location.pathname, isMobile]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ minHeight: { xs: '56px', sm: '64px' } }} />
      <Box sx={{ 
        overflow: 'auto', 
        flexGrow: 1,
        paddingBottom: { xs: '16px', sm: '24px' }
      }}>
        <List sx={{ padding: { xs: '8px 0', sm: '16px 0' } }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              onClick={handleMenuItemClick}
              sx={{
                backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                minHeight: { xs: 48, sm: 56 },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 },
                mx: { xs: 1, sm: 2 },
                my: { xs: 0.5, sm: 1 },
                borderRadius: { xs: 1, sm: 1.5 },
                transition: 'all 0.2s ease-in-out',
                '&:active': {
                  transform: 'scale(0.98)',
                },
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: { xs: 40, sm: 56 },
                color: location.pathname === item.path ? 'primary.main' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? 'primary.main' : 'inherit'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile menu button */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          position: 'fixed',
          top: { xs: 16, sm: 16 },
          left: { xs: 16, sm: 16 },
          zIndex: theme.zIndex.drawer + 3,
          display: { sm: 'none' },
          backgroundColor: 'rgba(25, 118, 210, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          width: { xs: 48, sm: 48 },
          height: { xs: 48, sm: 48 },
          color: 'white',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 1)',
            transform: 'scale(1.05)',
            boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          }
        }}
      >
        {mobileOpen ? <Close sx={{ fontSize: '1.5rem' }} /> : <MenuIcon sx={{ fontSize: '1.5rem' }} />}
      </IconButton>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: Math.min(280, typeof window !== 'undefined' ? window.innerWidth * 0.8 : 280),
            maxWidth: '80vw',
            borderRadius: { xs: '0 20px 20px 0', sm: 0 },
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: 'none'
          },
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)'
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            position: 'fixed',
            height: '100vh',
            zIndex: theme.zIndex.drawer
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
