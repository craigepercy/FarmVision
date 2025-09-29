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
import FarmMap from '../components/FarmMap';

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
    <Card sx={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: 3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              color="textSecondary" 
              gutterBottom 
              sx={{ 
                fontWeight: 500,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            color,
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 4
        }}
      >
        Farm Dashboard
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Total Hectares"
            value={stats.totalHectares.toLocaleString()}
            icon={<Agriculture fontSize="large" />}
            color="#10b981"
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Total Livestock"
            value={stats.totalLivestock.toLocaleString()}
            icon={<Pets fontSize="large" />}
            color="#3b82f6"
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Monthly Revenue"
            value={`R${stats.monthlyRevenue.toLocaleString()}`}
            icon={<AttachMoney fontSize="large" />}
            color="#059669"
          />
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <StatCard
            title="Active Alerts"
            value={stats.activeAlerts}
            icon={<Warning fontSize="large" />}
            color="#f59e0b"
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Card sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                Interactive Farm Map
              </Typography>
              <FarmMap height={300} />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 3 }}>
                {[0,1,2,3,4,5,6].map(day => (
                  <Box 
                    key={day} 
                    sx={{ 
                      flex: '1 1 80px', 
                      textAlign: 'center', 
                      p: 1.5, 
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)',
                      borderRadius: 2,
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
                      }
                    }}
                  >
                    <Typography variant="caption" display="block" sx={{ fontWeight: 500, color: '#64748b' }}>
                      {new Date(Date.now() + day * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#1e293b', my: 0.5 }}>
                      {22 + Math.floor(Math.random() * 8)}°C
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#3b82f6', fontWeight: 500 }}>
                      {Math.floor(Math.random() * 30)}% rain
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card sx={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                Inbox & Messages
              </Typography>
              <List dense>
                {threads.slice(0, 3).map((thread) => (
                  <ListItem 
                    key={thread.id} 
                    sx={{ 
                      cursor: 'pointer', 
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        bgcolor: 'rgba(59, 130, 246, 0.05)',
                        transform: 'translateX(4px)'
                      } 
                    }}
                    onClick={() => handleMessageClick(thread.id)}
                  >
                    <ListItemText
                      primary={thread.subject}
                      secondary={`${thread.participants.join(', ')} • ${new Date(thread.lastMessageTime).toLocaleDateString()}`}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 500,
                          color: '#1e293b'
                        },
                        '& .MuiListItemText-secondary': {
                          color: '#64748b'
                        }
                      }}
                    />
                    {thread.unreadCount > 0 && (
                      <Chip
                        label={thread.unreadCount}
                        size="small"
                        sx={{ 
                          minWidth: 24, 
                          height: 20,
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </ListItem>
                ))}
                {notifications.map((notification) => (
                  <ListItem 
                    key={notification.id} 
                    sx={{ 
                      cursor: 'pointer', 
                      borderRadius: 2,
                      mb: 1,
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': { 
                        bgcolor: 'rgba(59, 130, 246, 0.05)',
                        transform: 'translateX(4px)'
                      } 
                    }}
                  >
                    <ListItemText
                      primary={notification.message}
                      secondary={new Date(notification.timestamp).toLocaleDateString()}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 500,
                          color: '#1e293b'
                        },
                        '& .MuiListItemText-secondary': {
                          color: '#64748b'
                        }
                      }}
                    />
                    <Chip
                      label={notification.type}
                      size="small"
                      color={notification.type === 'warning' ? 'warning' : 'info'}
                      sx={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  fullWidth 
                  onClick={handleViewAllMessages}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 500,
                    textTransform: 'none',
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    '&:hover': {
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      background: 'rgba(59, 130, 246, 0.05)'
                    }
                  }}
                >
                  View All Messages
                </Button>
                <Button 
                  size="small" 
                  variant="contained" 
                  fullWidth 
                  onClick={handleCompose}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 500,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)'
                    }
                  }}
                >
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
