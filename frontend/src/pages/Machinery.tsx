import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, Build, Schedule, Person, Warning, Edit, LocationOn, SmartToy } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateEquipmentStatus } from '../store/slices/machinerySlice';

const Machinery: React.FC = () => {
  const { equipment } = useSelector((state: RootState) => state.machinery);
  const dispatch = useDispatch();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<'In-Use' | 'Available' | 'Unavailable'>('Available');

  const handleStatusChange = (equipment: any) => {
    setSelectedEquipment(equipment);
    setNewStatus(equipment.status);
    setStatusDialogOpen(true);
  };

  const handleSaveStatus = () => {
    if (selectedEquipment) {
      dispatch(updateEquipmentStatus({ id: selectedEquipment.id, status: newStatus }));
      setStatusDialogOpen(false);
      setSelectedEquipment(null);
    }
  };

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography 
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
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
                {equipment.filter(e => e.status === 'Available').length}
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
                {equipment.filter(e => e.status === 'In-Use').length}
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
                {equipment.filter(e => e.status === 'Unavailable').length}
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
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size="small"
                    />
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleStatusChange(item)}
                    >
                      Change Status
                    </Button>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Type: {item.type}
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">
                    {item.location.name}
                  </Typography>
                </Box>

                {item.assignedTo && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <Person sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      Assigned to Staff ID: {item.assignedTo}
                    </Typography>
                  </Box>
                )}

                {item.aiRecommendation && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <SmartToy sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2" fontWeight="bold">
                        AI Recommendation
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.aiRecommendation}
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

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Change Equipment Status</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Equipment: {selectedEquipment?.name}
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as 'In-Use' | 'Available' | 'Unavailable')}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="In-Use">In-Use</MenuItem>
              <MenuItem value="Unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveStatus} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Machinery;
