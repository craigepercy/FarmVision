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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemIcon,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { 
  Pets, 
  Add, 
  LocalHospital, 
  LocationOn, 
  MoveToInbox,
  Edit,
  Delete,
  SelectAll
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  selectCattle, 
  selectAllCattle, 
  moveCattle, 
  addCattle, 
  addCamp, 
  updateCamp, 
  deleteCamp,
  setSelectedCamp,
} from '../store/slices/cattleSlice';

const CattleManagement: React.FC = () => {
  const { cattle, camps, selectedCattle, selectedCamp } = useSelector((state: RootState) => state.cattle);
  const dispatch = useDispatch();
  
  const [tabValue, setTabValue] = useState(0);
  const [addCattleOpen, setAddCattleOpen] = useState(false);
  const [addCampOpen, setAddCampOpen] = useState(false);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [editCampOpen, setEditCampOpen] = useState(false);
  const [selectedCampForEdit, setSelectedCampForEdit] = useState<any>(null);
  const [targetCampId, setTargetCampId] = useState('');
  
  const [cattleForm, setCattleForm] = useState({
    tagNumber: '',
    breed: '',
    label: 'Calf (M)' as any,
    age: 0,
    weight: 0,
    campId: camps[0]?.id || '',
  });
  
  const [campForm, setCampForm] = useState({
    name: '',
    address: '',
    capacity: 0,
  });

  const cattleLabels = [
    'Calf (M)', 'Calf (F)', 'Weaner (M)', 'Weaner (F)', 'Yearling (M)', 'Yearling (F)',
    'Bull calf', 'Steer', 'Bull', 'Heifer', 'First-calf Heifer', 'Cow',
    'Replacement Heifer', 'Bred Heifer', 'Open Cow/Heifer', 'Pregnant/Bred Cow/Heifer',
    'Lactating Cow', 'Dry Cow', 'Cull Cow/Bull'
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'sick': return 'error';
      case 'treatment': return 'warning';
      default: return 'default';
    }
  };

  const handleSelectCattle = (cattleId: string) => {
    dispatch(selectCattle(cattleId));
  };

  const handleSelectAll = () => {
    const allSelected = selectedCattle.length === cattle.length;
    dispatch(selectAllCattle(!allSelected));
  };

  const handleMoveCattle = () => {
    if (selectedCattle.length > 0 && targetCampId) {
      dispatch(moveCattle({ 
        cattleIds: selectedCattle.map(c => c.id), 
        targetCampId 
      }));
      setMoveDialogOpen(false);
      setTargetCampId('');
    }
  };

  const handleAddCattle = () => {
    const newCattle = {
      id: `cattle${Date.now()}`,
      ...cattleForm,
      healthStatus: 'healthy' as const,
      lastCheckup: new Date().toISOString(),
    };
    dispatch(addCattle(newCattle));
    setAddCattleOpen(false);
    setCattleForm({
      tagNumber: '',
      breed: '',
      label: 'Calf (M)' as any,
      age: 0,
      weight: 0,
      campId: camps[0]?.id || '',
    });
  };

  const handleAddCamp = () => {
    const newCamp = {
      id: `camp${Date.now()}`,
      name: campForm.name,
      location: { lat: -25.7479, lng: 28.2293, address: campForm.address },
      capacity: campForm.capacity,
      currentCount: 0,
    };
    dispatch(addCamp(newCamp));
    setAddCampOpen(false);
    setCampForm({ name: '', address: '', capacity: 0 });
  };

  const handleEditCamp = (camp: any) => {
    setSelectedCampForEdit(camp);
    setCampForm({
      name: camp.name,
      address: camp.location.address,
      capacity: camp.capacity,
    });
    setEditCampOpen(true);
  };

  const handleUpdateCamp = () => {
    if (selectedCampForEdit) {
      const updatedCamp = {
        ...selectedCampForEdit,
        name: campForm.name,
        location: { ...selectedCampForEdit.location, address: campForm.address },
        capacity: campForm.capacity,
      };
      dispatch(updateCamp(updatedCamp));
      setEditCampOpen(false);
      setSelectedCampForEdit(null);
    }
  };

  const handleDeleteCamp = (campId: string) => {
    const camp = camps.find(c => c.id === campId);
    if (camp && camp.currentCount === 0) {
      if (confirm(`Are you sure you want to delete ${camp.name}?`)) {
        dispatch(deleteCamp(campId));
      }
    } else {
      alert('Cannot delete camp with cattle. Move cattle first.');
    }
  };

  const filteredCattle = selectedCamp 
    ? cattle.filter(c => c.campId === selectedCamp)
    : cattle;

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
          Cattle Management
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddCattleOpen(true)}
          >
            Add Cattle
          </Button>
          <Button
            variant="outlined"
            startIcon={<LocationOn />}
            onClick={() => setAddCampOpen(true)}
          >
            Add Camp
          </Button>
          {selectedCattle.length > 0 && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<MoveToInbox />}
              onClick={() => setMoveDialogOpen(true)}
            >
              Move Selected ({selectedCattle.length})
            </Button>
          )}
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Cattle Inventory" />
        <Tab label="Camp Management" />
      </Tabs>

      {tabValue === 0 && (
        <>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary.main">
                    {cattle.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Cattle
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="success.main">
                    {cattle.filter(c => c.healthStatus === 'healthy').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Healthy
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="warning.main">
                    {cattle.filter(c => c.healthStatus === 'treatment').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Under Treatment
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="error.main">
                    {cattle.filter(c => c.healthStatus === 'sick').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sick
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Camp</InputLabel>
              <Select
                value={selectedCamp || ''}
                onChange={(e) => dispatch(setSelectedCamp(e.target.value || null))}
              >
                <MenuItem value="">All Camps</MenuItem>
                {camps.map(camp => (
                  <MenuItem key={camp.id} value={camp.id}>
                    {camp.name} ({camp.currentCount}/{camp.capacity})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Cattle Inventory {selectedCamp && `- ${camps.find(c => c.id === selectedCamp)?.name}`}
                </Typography>
                <Button
                  startIcon={<SelectAll />}
                  onClick={handleSelectAll}
                  size="small"
                >
                  {selectedCattle.length === filteredCattle.length ? 'Deselect All' : 'Select All'}
                </Button>
              </Box>
              <List>
                {filteredCattle.map((animal) => (
                  <ListItem key={animal.id}>
                    <ListItemIcon>
                      <Checkbox
                        checked={animal.selected || false}
                        onChange={() => handleSelectCattle(animal.id)}
                      />
                    </ListItemIcon>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Pets />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${animal.breed} - Tag: ${animal.tagNumber}`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Label: {animal.label} • Age: {animal.age} months • Weight: {animal.weight}kg
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Camp: {camps.find(c => c.id === animal.campId)?.name}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip
                        label={animal.healthStatus}
                        color={getHealthColor(animal.healthStatus) as any}
                        size="small"
                      />
                      <Button
                        size="small"
                        startIcon={<LocalHospital />}
                        variant="outlined"
                      >
                        Health Check
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Cattle Camps
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {camps.map(camp => (
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }} key={camp.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {camp.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {camp.location.address}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Capacity: {camp.currentCount}/{camp.capacity}
                    </Typography>
                    <Box display="flex" gap={1} mt={2}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditCamp(camp)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Delete />}
                        color="error"
                        onClick={() => handleDeleteCamp(camp.id)}
                        disabled={camp.currentCount > 0}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Dialog open={addCattleOpen} onClose={() => setAddCattleOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Cattle</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  label="Tag Number"
                  value={cattleForm.tagNumber}
                  onChange={(e) => setCattleForm({...cattleForm, tagNumber: e.target.value})}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  label="Breed"
                  value={cattleForm.breed}
                  onChange={(e) => setCattleForm({...cattleForm, breed: e.target.value})}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Label</InputLabel>
                <Select
                  value={cattleForm.label}
                  onChange={(e) => setCattleForm({...cattleForm, label: e.target.value as any})}
                >
                  {cattleLabels.map(label => (
                    <MenuItem key={label} value={label}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <TextField
                  fullWidth
                  label="Age (months)"
                  type="number"
                  value={cattleForm.age}
                  onChange={(e) => setCattleForm({...cattleForm, age: parseInt(e.target.value)})}
                />
              </Box>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={cattleForm.weight}
                  onChange={(e) => setCattleForm({...cattleForm, weight: parseInt(e.target.value)})}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <FormControl fullWidth>
                  <InputLabel>Camp</InputLabel>
                  <Select
                    value={cattleForm.campId}
                    onChange={(e) => setCattleForm({...cattleForm, campId: e.target.value})}
                  >
                    {camps.map(camp => (
                      <MenuItem key={camp.id} value={camp.id}>
                        {camp.name} ({camp.currentCount}/{camp.capacity})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCattleOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCattle} variant="contained">Add Cattle</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addCampOpen} onClose={() => setAddCampOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Camp</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Camp Name"
                value={campForm.name}
                onChange={(e) => setCampForm({...campForm, name: e.target.value})}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Location Address"
                value={campForm.address}
                onChange={(e) => setCampForm({...campForm, address: e.target.value})}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                value={campForm.capacity}
                onChange={(e) => setCampForm({...campForm, capacity: parseInt(e.target.value)})}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCampOpen(false)}>Cancel</Button>
          <Button onClick={handleAddCamp} variant="contained">Add Camp</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editCampOpen} onClose={() => setEditCampOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Camp</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Camp Name"
                value={campForm.name}
                onChange={(e) => setCampForm({...campForm, name: e.target.value})}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Location Address"
                value={campForm.address}
                onChange={(e) => setCampForm({...campForm, address: e.target.value})}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Capacity"
                type="number"
                value={campForm.capacity}
                onChange={(e) => setCampForm({...campForm, capacity: parseInt(e.target.value)})}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCampOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateCamp} variant="contained">Update Camp</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={moveDialogOpen} onClose={() => setMoveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Move Selected Cattle ({selectedCattle.length})</DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
            Selected cattle:
          </Typography>
          <List dense>
            {selectedCattle.map(cattle => (
              <ListItem key={cattle.id}>
                <ListItemText
                  primary={`${cattle.breed} - ${cattle.tagNumber}`}
                  secondary={cattle.label}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <FormControl fullWidth>
            <InputLabel>Target Camp</InputLabel>
            <Select
              value={targetCampId}
              onChange={(e) => setTargetCampId(e.target.value)}
            >
              {camps.map(camp => (
                <MenuItem key={camp.id} value={camp.id}>
                  {camp.name} ({camp.currentCount}/{camp.capacity})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMoveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleMoveCattle} 
            variant="contained"
            disabled={!targetCampId}
          >
            Move Cattle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CattleManagement;
