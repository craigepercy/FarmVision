import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { Add, Build, Schedule, Person, Warning } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Machinery: React.FC = () => {
  const { equipment } = useSelector((state: RootState) => state.machinery);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'success';
      case 'in-use': return 'warning';
      case 'maintenance': return 'error';
      default: return 'default';
    }
  };

  const getMaintenanceUrgency = (nextMaintenance: string) => {
    const daysUntil = Math.ceil((new Date(nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) return 'error';
    if (daysUntil <= 30) return 'warning';
    return 'success';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Machinery Management
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Equipment
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Equipment
              </Typography>
              <Typography variant="h4">
                {equipment.length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Available
              </Typography>
              <Typography variant="h4" color="success.main">
                {equipment.filter(e => e.status === 'available').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Use
              </Typography>
              <Typography variant="h4" color="warning.main">
                {equipment.filter(e => e.status === 'in-use').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Maintenance
              </Typography>
              <Typography variant="h4" color="error.main">
                {equipment.filter(e => e.status === 'maintenance').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        {equipment.map((item) => (
          <Box key={item.id} sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '400px' }}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {item.name}
                  </Typography>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: {item.type}
                </Typography>

                {item.assignedTo && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <Person sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      Assigned to Staff ID: {item.assignedTo}
                    </Typography>
                  </Box>
                )}

                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Hours Used: {item.hoursUsed}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((item.hoursUsed / 2000) * 100, 100)}
                    color={item.hoursUsed > 1500 ? 'warning' : 'primary'}
                  />
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Next Maintenance
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Schedule sx={{ mr: 1, fontSize: 16 }} />
                    <Typography
                      variant="body2"
                      color={`${getMaintenanceUrgency(item.nextMaintenance)}.main`}
                    >
                      {new Date(item.nextMaintenance).toLocaleDateString()}
                    </Typography>
                    {getMaintenanceUrgency(item.nextMaintenance) === 'error' && (
                      <Warning sx={{ ml: 1, color: 'error.main', fontSize: 16 }} />
                    )}
                  </Box>
                </Box>

                <Box display="flex" gap={1} mt={2}>
                  <Button size="small" startIcon={<Build />}>
                    Maintenance Log
                  </Button>
                  <Button size="small" variant="outlined">
                    Assign
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upcoming Maintenance Schedule
            </Typography>
            <List>
              {equipment
                .filter(e => {
                  const daysUntil = Math.ceil((new Date(e.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntil <= 30;
                })
                .map((item) => {
                  const daysUntil = Math.ceil((new Date(item.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <ListItem key={item.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <Build />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={`${item.type} - Due in ${daysUntil} days`}
                      />
                      <Chip
                        label={daysUntil <= 7 ? 'Urgent' : 'Upcoming'}
                        color={daysUntil <= 7 ? 'error' : 'warning'}
                        size="small"
                      />
                    </ListItem>
                  );
                })}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Machinery;
