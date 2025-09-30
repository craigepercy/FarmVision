import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning,
  Info,
  CheckCircle,
  Error,
  Delete,
  MarkEmailRead,
} from '@mui/icons-material';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState([
    {
      id: '1',
      title: 'Cattle Vaccination Due',
      message: 'Cattle in Pasture A require vaccination within 3 days',
      type: 'warning',
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'high',
    },
    {
      id: '2',
      title: 'Harvest Completed',
      message: 'Corn harvest in Field B has been completed successfully',
      type: 'success',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Equipment Maintenance',
      message: 'Tractor JD-8320R requires scheduled maintenance',
      type: 'info',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true,
      priority: 'medium',
    },
    {
      id: '4',
      title: 'Weather Alert',
      message: 'Heavy rain expected tomorrow. Secure equipment and livestock',
      type: 'error',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      read: false,
      priority: 'high',
    },
    {
      id: '5',
      title: 'Task Assignment',
      message: 'New task assigned: Weekly livestock health check',
      type: 'info',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      read: true,
      priority: 'low',
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [notificationDetailOpen, setNotificationDetailOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <Warning />;
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'info': return <Info />;
      default: return <Info />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'error': return 'error';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const handleNotificationClick = (notification: any) => {
    setSelectedNotification(notification);
    setNotificationDetailOpen(true);
    
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Typography variant="h4" sx={{ mr: 2 }}>
            Notifications
          </Typography>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </Box>
        <Button
          variant="outlined"
          startIcon={<MarkEmailRead />}
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          Mark All as Read
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Notifications
              </Typography>
              <Typography variant="h4">
                {notifications.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Unread
              </Typography>
              <Typography variant="h4" color="error.main">
                {unreadCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                High Priority
              </Typography>
              <Typography variant="h4" color="warning.main">
                {notifications.filter(n => n.priority === 'high').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Alerts
              </Typography>
              <Typography variant="h4" color="error.main">
                {notifications.filter(n => n.type === 'error' || n.type === 'warning').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alert Center
            </Typography>
              <List>
                {notifications.map((notification) => (
                  <ListItem
                    key={notification.id}
                    sx={{
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getNotificationColor(notification.type)}.main` }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={notification.read ? 'normal' : 'bold'}
                          >
                            {notification.title}
                          </Typography>
                          <Chip
                            label={notification.priority}
                            color={getPriorityColor(notification.priority)}
                            size="small"
                          />
                          {!notification.read && (
                            <Chip label="New" color="primary" size="small" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" flexDirection="column" gap={1}>
                      {!notification.read && (
                        <Button
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => deleteNotification(notification.id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
      </Box>

      {/* Notification Detail Dialog */}
      <Dialog 
        open={notificationDetailOpen} 
        onClose={() => setNotificationDetailOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: selectedNotification ? getNotificationColor(selectedNotification.type) : 'grey.500' }}>
              {selectedNotification ? getNotificationIcon(selectedNotification.type) : <NotificationsIcon />}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedNotification?.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedNotification ? new Date(selectedNotification.timestamp).toLocaleString() : ''}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" paragraph>
              {selectedNotification?.message}
            </Typography>
            
            {selectedNotification?.details && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Additional Details</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedNotification.details}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Chip
                label={selectedNotification?.priority}
                color={selectedNotification ? getPriorityColor(selectedNotification.priority) : 'default'}
                size="small"
              />
              <Chip
                label={selectedNotification?.type}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDetailOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => setNotificationDetailOpen(false)}>
            Mark as Resolved
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notifications;
