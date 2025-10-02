import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import { Notifications, AccountCircle, ExitToApp, Message } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.dashboard);
  const { threads } = useSelector((state: RootState) => state.messaging);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        width: '100%',
        '& .MuiToolbar-root': {
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2 }
        }
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 700
          }}
        >
          🌱 FarmVision
        </Typography>
        
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
