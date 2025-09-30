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
  TextField,
} from '@mui/material';
import { Add, Build, Schedule, Person, Warning, Edit, LocationOn, SmartToy } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateEquipmentStatus, addEquipment, updateEquipment } from '../store/slices/machinerySlice';

const Machinery: React.FC = () => {
  const { equipment } = useSelector((state: RootState) => state.machinery);
  const dispatch = useDispatch();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [maintenanceLogOpen, setMaintenanceLogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'In-Use' | 'Available' | 'Unavailable'>('Available');
  const [addEquipmentOpen, setAddEquipmentOpen] = useState(false);
  const [addMaintenanceOpen, setAddMaintenanceOpen] = useState(false);
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    type: '',
    location: '',
    hoursUsed: 0,
    nextMaintenance: ''
  });
  const [maintenanceForm, setMaintenanceForm] = useState({
    date: '',
    type: '',
    description: '',
    cost: '',
    technician: '',
    nextServiceDate: ''
  });

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

  const handleAddEquipment = () => {
    const newEquipment = {
      id: `equip${Date.now()}`,
      name: equipmentForm.name,
      type: equipmentForm.type,
      status: 'Available' as const,
      assignedTo: null,
      location: { lat: -25.7479, lng: 28.2293, name: equipmentForm.location },
      lastMaintenance: new Date().toISOString(),
      nextMaintenance: equipmentForm.nextMaintenance || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      hoursUsed: equipmentForm.hoursUsed,
      aiRecommendation: 'New equipment - schedule initial inspection'
    };
    dispatch(addEquipment(newEquipment));
    setAddEquipmentOpen(false);
    setEquipmentForm({
      name: '',
      type: '',
      location: '',
      hoursUsed: 0,
      nextMaintenance: ''
    });
  };

  const handleMaintenanceLog = (equipment: any) => {
    setSelectedEquipment(equipment);
    setMaintenanceLogOpen(true);
  };

  const handleAddMaintenance = () => {
    if (selectedEquipment) {
      const newMaintenance = {
        id: `maintenance${Date.now()}`,
        equipmentId: selectedEquipment.id,
        ...maintenanceForm,
        createdDate: new Date().toISOString()
      };
      
      dispatch(updateEquipment({
        ...selectedEquipment,
        maintenanceHistory: [...(selectedEquipment.maintenanceHistory || []), newMaintenance],
        lastMaintenance: maintenanceForm.date
      }));
      
      setAddMaintenanceOpen(false);
      setMaintenanceForm({
        date: '',
        type: '',
        description: '',
        cost: '',
        technician: '',
        nextServiceDate: ''
      });
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
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" 
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={4}
        gap={2}
      >
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
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setAddEquipmentOpen(true)}
          sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
        >
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
                  <Button size="small" startIcon={<Build />} onClick={() => handleMaintenanceLog(item)}>
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

      {/* Add Equipment Dialog */}
      <Dialog open={addEquipmentOpen} onClose={() => setAddEquipmentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Equipment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Equipment Name"
              value={equipmentForm.name}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Type"
              value={equipmentForm.type}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, type: e.target.value })}
              fullWidth
            />
            <TextField
              label="Location"
              value={equipmentForm.location}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, location: e.target.value })}
              fullWidth
            />
            <TextField
              label="Hours Used"
              type="number"
              value={equipmentForm.hoursUsed}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, hoursUsed: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label="Next Maintenance Date"
              type="date"
              value={equipmentForm.nextMaintenance}
              onChange={(e) => setEquipmentForm({ ...equipmentForm, nextMaintenance: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddEquipmentOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEquipment} variant="contained">Add Equipment</Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Log Dialog */}
      <Dialog open={maintenanceLogOpen} onClose={() => setMaintenanceLogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Maintenance Log - {selectedEquipment?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Maintenance History
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar><Build /></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Oil Change & Filter Replacement"
                  secondary="2024-09-15 - R850 - Routine maintenance completed"
                />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar><Build /></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Hydraulic System Check"
                  secondary="2024-08-20 - R1,200 - Minor leak repaired"
                />
              </ListItem>
            </List>
            <Button variant="contained" startIcon={<Add />} sx={{ mt: 2 }} onClick={() => setAddMaintenanceOpen(true)}>
              Add Maintenance Record
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceLogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Maintenance Dialog */}
      <Dialog open={addMaintenanceOpen} onClose={() => setAddMaintenanceOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Maintenance Record - {selectedEquipment?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Maintenance Date"
              type="date"
              value={maintenanceForm.date}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Maintenance Type</InputLabel>
              <Select
                value={maintenanceForm.type}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, type: e.target.value })}
              >
                <MenuItem value="Oil Change">Oil Change</MenuItem>
                <MenuItem value="Filter Replacement">Filter Replacement</MenuItem>
                <MenuItem value="Hydraulic Service">Hydraulic Service</MenuItem>
                <MenuItem value="Engine Service">Engine Service</MenuItem>
                <MenuItem value="Tire Replacement">Tire Replacement</MenuItem>
                <MenuItem value="Brake Service">Brake Service</MenuItem>
                <MenuItem value="General Inspection">General Inspection</MenuItem>
                <MenuItem value="Repair">Repair</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              multiline
              rows={3}
              value={maintenanceForm.description}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Cost (ZAR)"
              type="number"
              value={maintenanceForm.cost}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })}
              fullWidth
            />
            <TextField
              label="Technician"
              value={maintenanceForm.technician}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, technician: e.target.value })}
              fullWidth
            />
            <TextField
              label="Next Service Date"
              type="date"
              value={maintenanceForm.nextServiceDate}
              onChange={(e) => setMaintenanceForm({ ...maintenanceForm, nextServiceDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMaintenanceOpen(false)}>Cancel</Button>
          <Button onClick={handleAddMaintenance} variant="contained">Add Record</Button>
        </DialogActions>
      </Dialog>

      {/* Maintenance Log Dialog */}
      <Dialog open={maintenanceLogOpen} onClose={() => setMaintenanceLogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Maintenance Log - {selectedEquipment?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Maintenance Records</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Oil Change & Filter Replacement"
                  secondary="Date: 2025-09-15 | Cost: R1,250 | Next due: 2025-12-15"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Hydraulic System Inspection"
                  secondary="Date: 2025-08-20 | Cost: R850 | Status: Completed"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tire Rotation & Pressure Check"
                  secondary="Date: 2025-07-10 | Cost: R450 | Next due: 2025-10-10"
                />
              </ListItem>
            </List>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Upcoming Maintenance</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Annual Service & Inspection"
                  secondary="Due: 2025-10-15 | Estimated cost: R3,500"
                />
                <Chip label="Due Soon" color="warning" size="small" />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Brake System Check"
                  secondary="Due: 2025-11-01 | Estimated cost: R1,200"
                />
                <Chip label="Scheduled" color="info" size="small" />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceLogOpen(false)}>Close</Button>
          <Button variant="contained">Add Maintenance Record</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Machinery;
