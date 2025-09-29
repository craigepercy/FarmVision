import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';
import {
  Agriculture,
  Pets,
  AttachMoney,
  Warning,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectThread, markThreadAsRead, createNewThread } from '../store/slices/messagingSlice';

const Dashboard: React.FC = () => {
  const { stats, notifications } = useSelector((state: RootState) => state.dashboard);
  const { threads } = useSelector((state: RootState) => state.messaging);
  const dispatch = useDispatch();

  const handleMessageClick = (threadId: string) => {
    dispatch(selectThread(threadId));
    dispatch(markThreadAsRead(threadId));
  };

  const handleViewAllMessages = () => {
    console.log('Navigate to full messaging interface');
  };

  const handleCompose = () => {
    const recipient = prompt('Enter recipient:');
    const subject = prompt('Enter subject:');
    const content = prompt('Enter message:');
    
    if (recipient && subject && content) {
      dispatch(createNewThread({ recipient, subject, content }));
    }
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Farm Dashboard
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Total Hectares"
            value={stats.totalHectares.toLocaleString()}
            icon={<Agriculture fontSize="large" />}
            color="green"
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Total Livestock"
            value={stats.totalLivestock.toLocaleString()}
            icon={<Pets fontSize="large" />}
            color="blue"
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Monthly Revenue"
            value={`R${stats.monthlyRevenue.toLocaleString()}`}
            icon={<AttachMoney fontSize="large" />}
            color="green"
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Active Alerts"
            value={stats.activeAlerts}
            icon={<Warning fontSize="large" />}
            color="orange"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weather Forecast & Farm Map
              </Typography>
              <Box sx={{ height: 300, bgcolor: 'grey.100', borderRadius: 1, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Interactive farm map with weather overlay will be displayed here
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {[0,1,2,3,4,5,6].map(day => (
                  <Box key={day} sx={{ flex: '1 1 80px', textAlign: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" display="block">
                      {new Date(Date.now() + day * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {22 + Math.floor(Math.random() * 8)}°C
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.floor(Math.random() * 30)}% rain
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inbox & Messages
              </Typography>
              <List dense>
                {threads.slice(0, 3).map((thread) => (
                  <ListItem 
                    key={thread.id} 
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
                    onClick={() => handleMessageClick(thread.id)}
                  >
                    <ListItemText
                      primary={thread.subject}
                      secondary={`${thread.participants.join(', ')} • ${new Date(thread.lastMessageTime).toLocaleDateString()}`}
                    />
                    {thread.unreadCount > 0 && (
                      <Chip
                        label={thread.unreadCount}
                        size="small"
                        color="primary"
                        sx={{ minWidth: 24, height: 20 }}
                      />
                    )}
                  </ListItem>
                ))}
                {notifications.map((notification) => (
                  <ListItem key={notification.id} sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}>
                    <ListItemText
                      primary={notification.message}
                      secondary={new Date(notification.timestamp).toLocaleDateString()}
                    />
                    <Chip
                      label={notification.type}
                      size="small"
                      color={notification.type === 'warning' ? 'warning' : 'info'}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" fullWidth onClick={handleViewAllMessages}>
                  View All Messages
                </Button>
                <Button size="small" variant="contained" fullWidth onClick={handleCompose}>
                  Compose
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
