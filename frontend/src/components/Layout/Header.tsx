import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { Notifications, AccountCircle, ExitToApp, Message, MoreVert } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.dashboard);
  const { threads } = useSelector((state: RootState) => state.messaging);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMoreMenu = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  const primaryNavItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Crops', path: '/crops' },
    { label: 'Cattle', path: '/cattle' },
    { label: 'Finance', path: '/finance' },
    { label: 'Machinery', path: '/machinery' },
  ];

  const secondaryNavItems = [
    { label: 'Analytics', path: '/analytics' },
    { label: 'AI Assistant', path: '/ai-assistant' },
    { label: 'Audit Trail', path: '/audit' },
    { label: 'Staff & Tasks', path: '/staff' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1000,
        width: '100%',
        height: '80px',
        '& .MuiToolbar-root': {
          minHeight: '80px',
          px: { xs: 2, sm: 3 }
        }
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            mr: 4,
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            fontWeight: 700
          }}
        >
          🌱 FarmVision
        </Typography>

        {/* Primary Navigation - Desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            {primaryNavItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                component={Link}
                to={item.path}
                sx={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Secondary Navigation Menu */}
        <IconButton
          color="inherit"
          onClick={handleMoreMenu}
          sx={{ mr: 1 }}
        >
          <MoreVert />
        </IconButton>

        <Menu
          anchorEl={moreMenuAnchor}
          open={Boolean(moreMenuAnchor)}
          onClose={handleMoreMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {isMobile && primaryNavItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMoreMenuClose}
              sx={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
              }}
            >
              {item.label}
            </MenuItem>
          ))}
          {secondaryNavItems.map((item) => (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMoreMenuClose}
              sx={{
                fontWeight: location.pathname === item.path ? 600 : 400,
                backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
        
        <IconButton 
          color="inherit"
          size="medium"
          sx={{ 
            p: { xs: 0.5, sm: 1 },
            '& .MuiBadge-badge': {
              fontSize: { xs: '0.625rem', sm: '0.75rem' }
            }
          }}
        >
          <Badge badgeContent={notifications.length} color="error">
            <Notifications sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          </Badge>
        </IconButton>

        <IconButton 
          color="inherit"
          size="medium"
          component={Link}
          to="/messages"
          sx={{ 
            p: { xs: 0.5, sm: 1 },
            '& .MuiBadge-badge': {
              fontSize: { xs: '0.625rem', sm: '0.75rem' }
            }
          }}
        >
          <Badge badgeContent={threads.filter(t => t.unreadCount > 0).length} color="primary">
            <Message sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          </Badge>
        </IconButton>

        <div>
          <IconButton
            size="medium"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{ p: { xs: 0.5, sm: 1 } }}
          >
            <AccountCircle sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                maxWidth: { xs: '90vw', sm: 'auto' },
                mt: 1
              }
            }}
          >
            <MenuItem onClick={handleClose}>
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {user?.name}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                {user?.role}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1, fontSize: { xs: '1rem', sm: '1.25rem' } }} />
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
