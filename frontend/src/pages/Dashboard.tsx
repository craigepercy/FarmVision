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
} from '@mui/material';
import {
  Agriculture,
  Pets,
  AttachMoney,
  Warning,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Dashboard: React.FC = () => {
  const { stats, notifications } = useSelector((state: RootState) => state.dashboard);

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
            title="Total Acres"
            value={stats.totalAcres.toLocaleString()}
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
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
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
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Farm operations overview and key metrics will be displayed here.
                This includes crop health monitoring, livestock tracking, and equipment status.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              <List dense>
                {notifications.map((notification) => (
                  <ListItem key={notification.id}>
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
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
