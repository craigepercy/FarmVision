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
  SelectAll,
  PhotoCamera,
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
  updateCattle,
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
  const [editCattleOpen, setEditCattleOpen] = useState(false);
  const [selectedCattleForEdit, setSelectedCattleForEdit] = useState<any>(null);
  const [cattleDetailOpen, setCattleDetailOpen] = useState(false);
  const [selectedCattleDetail, setSelectedCattleDetail] = useState<any>(null);
  const [filterSegment, setFilterSegment] = useState<string | null>(null);
  
  const [cattleForm, setCattleForm] = useState({
    tagNumber: '',
    breed: '',
    label: 'Calf (M)' as any,
    age: 0,
    weight: 0,
    campId: camps[0]?.id || '',
    sex: 'Male',
    healthStatus: 'healthy' as 'healthy' | 'sick' | 'treatment',
    vitals: {
      temperature: 38.5,
      heartRate: 60,
      respiratoryRate: 20
    },
    healthNotes: ''
  });

  const cattleBreeds = [
    'Angus', 'Hereford', 'Charolais', 'Limousin', 'Simmental',
    'Brahman', 'Bonsmara', 'Afrikaner', 'Nguni', 'Drakensberger'
  ];
  
  const [campForm, setCampForm] = useState({
    name: '',
    address: '',
    capacity: 0,
    type: 'Bull camp',
    coordinates: { lat: -25.7479, lng: 28.2293 }
  });

  const campTypes = [
    'Breeding camp',
    'Bull camp', 
    'Calving camp',
    'Feedlot pen',
    'Free Graze',
    'Heifer camp',
    'Quarantine camp',
    'Separation pen',
    'Sick pen',
    'Weaner camps'
  ];

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
      photos: [],
      location: camps.find(c => c.id === cattleForm.campId)?.location || { lat: -25.7479, lng: 28.2293, address: 'Unknown' }
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
      sex: 'Male',
      healthStatus: 'healthy' as 'healthy' | 'sick' | 'treatment',
      vitals: {
        temperature: 38.5,
        heartRate: 60,
        respiratoryRate: 20
      },
      healthNotes: ''
    });
  };

  const handleAddCamp = () => {
    const newCamp = {
      id: `camp${Date.now()}`,
      name: campForm.name,
      type: campForm.type,
      location: { 
        lat: campForm.coordinates.lat, 
        lng: campForm.coordinates.lng, 
        address: campForm.address 
      },
      capacity: campForm.capacity,
      currentCount: 0,
    };
    dispatch(addCamp(newCamp));
    setAddCampOpen(false);
    setCampForm({ 
      name: '', 
      address: '', 
      capacity: 0, 
      type: 'Bull camp',
      coordinates: { lat: -25.7479, lng: 28.2293 }
    });
  };

  const handleEditCamp = (camp: any) => {
    setSelectedCampForEdit(camp);
    setCampForm({
      name: camp.name,
      address: camp.location.address,
      capacity: camp.capacity,
      type: camp.type || 'Bull camp',
      coordinates: { lat: camp.location.lat, lng: camp.location.lng }
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

  const handleEditCattle = (cattle: any) => {
    setSelectedCattleForEdit(cattle);
    setCattleForm({
      tagNumber: cattle.tagNumber,
      breed: cattle.breed,
      label: cattle.label,
      age: cattle.age,
      weight: cattle.weight,
      campId: cattle.campId,
      sex: cattle.sex || 'Male',
      healthStatus: cattle.healthStatus || 'healthy',
      vitals: cattle.vitals || { temperature: 38.5, heartRate: 60, respiratoryRate: 20 },
      healthNotes: cattle.healthNotes || ''
    });
    setEditCattleOpen(true);
  };

  const handleUpdateCattle = () => {
    if (selectedCattleForEdit) {
      const updatedCattle = {
        ...selectedCattleForEdit,
        ...cattleForm,
        lastCheckup: new Date().toISOString()
      };
      dispatch(updateCattle(updatedCattle));
      setEditCattleOpen(false);
      setSelectedCattleForEdit(null);
    }
  };

  const handleCattlePhotoUpload = (cattleId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const task = prompt('Add task or comment for this photo:') || '';
          const photoData = {
            id: `photo${Date.now()}`,
            cattleId,
            filename: file.name,
            url: event.target?.result as string,
            uploadDate: new Date().toISOString(),
            dateStamp: new Date().toLocaleDateString(),
            timeStamp: new Date().toLocaleTimeString(),
            task: task,
            notes: prompt('Add additional notes for this photo:') || '',
            location: 'Current location will be auto-detected',
            validated: false
          };
          
          const cattle = filteredCattle.find(c => c.id === cattleId);
          if (cattle) {
            const updatedCattle = {
              ...cattle,
              photos: [...(cattle.photos || []), photoData],
              lastPhotoDate: new Date().toISOString()
            };
            dispatch(updateCattle(updatedCattle));
          }
          
          alert(`Photo uploaded successfully for cattle ${cattle?.tagNumber}!\nTask: ${task}\nPhoto validation pending.`);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleCattleClick = (cattle: any) => {
    const lastPhoto = cattle.photos && cattle.photos.length > 0 ? cattle.photos[cattle.photos.length - 1] : null;
    const currentCamp = camps.find(camp => camp.id === cattle.campId);
    
    setSelectedCattleDetail({
      ...cattle,
      lastPhoto,
      currentLocation: currentCamp ? `${currentCamp.name} (${currentCamp.type})` : 'Unknown location',
      healthReport: {
        lastCheckup: cattle.lastCheckup || 'No recent checkup',
        vaccinationStatus: cattle.vaccinationStatus || 'Unknown',
        healthStatus: cattle.healthStatus || 'Unknown',
        vitals: cattle.vitals || { temperature: 0, heartRate: 0, respiratoryRate: 0 },
        notes: cattle.notes || 'No additional notes'
      }
    });
    setCattleDetailOpen(true);
  };

  const getHealthStats = () => {
    const healthy = cattle.filter(c => c.healthStatus === 'healthy').length;
    const sick = cattle.filter(c => c.healthStatus === 'sick').length;
    const treatment = cattle.filter(c => c.healthStatus === 'treatment').length;
    return { healthy, sick, treatment };
  };

  const healthStats = getHealthStats();

  const filteredCattle = filterSegment 
    ? cattle.filter(c => {
        if (filterSegment === 'healthy') return c.healthStatus === 'healthy';
        if (filterSegment === 'sick') return c.healthStatus === 'sick';
        if (filterSegment === 'treatment') return c.healthStatus === 'treatment';
        return true;
      })
    : selectedCamp 
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
              <Card 
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                onClick={() => setFilterSegment('healthy')}
              >
                <CardContent>
                  <Typography variant="h6" color="success.main">
                    {healthStats.healthy}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Healthy
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Card 
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                onClick={() => setFilterSegment('treatment')}
              >
                <CardContent>
                  <Typography variant="h6" color="warning.main">
                    {healthStats.treatment}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Under Treatment
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Card 
                sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                onClick={() => setFilterSegment('sick')}
              >
                <CardContent>
                  <Typography variant="h6" color="error.main">
                    {healthStats.sick}
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
                      onClick={() => handleCattleClick(animal)}
                      sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
                    />
                    <Box display="flex" gap={1} alignItems="center">
                      <Chip
                        label={animal.healthStatus}
                        color={getHealthColor(animal.healthStatus) as any}
                        size="small"
                      />
                      <Button
                        size="small"
                        startIcon={<PhotoCamera />}
                        variant="outlined"
                        onClick={() => handleCattlePhotoUpload(animal.id)}
                      >
                        Photo
                      </Button>
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
                <FormControl fullWidth>
                  <InputLabel>Breed</InputLabel>
                  <Select
                    value={cattleForm.breed}
                    onChange={(e) => setCattleForm({...cattleForm, breed: e.target.value})}
                  >
                    {cattleBreeds.map(breed => (
                      <MenuItem key={breed} value={breed}>{breed}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              <FormControl fullWidth>
                <InputLabel>Camp Type</InputLabel>
                <Select
                  value={campForm.type}
                  onChange={(e) => setCampForm({...campForm, type: e.target.value})}
                >
                  {campTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={campForm.coordinates.lat}
                onChange={(e) => setCampForm({
                  ...campForm, 
                  coordinates: { ...campForm.coordinates, lat: parseFloat(e.target.value) || 0 }
                })}
                inputProps={{ step: "any" }}
              />
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={campForm.coordinates.lng}
                onChange={(e) => setCampForm({
                  ...campForm, 
                  coordinates: { ...campForm.coordinates, lng: parseFloat(e.target.value) || 0 }
                })}
                inputProps={{ step: "any" }}
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
              <FormControl fullWidth>
                <InputLabel>Camp Type</InputLabel>
                <Select
                  value={campForm.type}
                  onChange={(e) => setCampForm({...campForm, type: e.target.value})}
                >
                  {campTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={campForm.coordinates.lat}
                onChange={(e) => setCampForm({
                  ...campForm, 
                  coordinates: { ...campForm.coordinates, lat: parseFloat(e.target.value) || 0 }
                })}
                inputProps={{ step: "any" }}
              />
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={campForm.coordinates.lng}
                onChange={(e) => setCampForm({
                  ...campForm, 
                  coordinates: { ...campForm.coordinates, lng: parseFloat(e.target.value) || 0 }
                })}
                inputProps={{ step: "any" }}
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

      {/* Edit Cattle Dialog */}
      <Dialog open={editCattleOpen} onClose={() => setEditCattleOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Cattle Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Tag Number"
              value={cattleForm.tagNumber}
              onChange={(e) => setCattleForm({ ...cattleForm, tagNumber: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Breed</InputLabel>
              <Select
                value={cattleForm.breed}
                onChange={(e) => setCattleForm({ ...cattleForm, breed: e.target.value })}
              >
                {cattleBreeds.map((breed) => (
                  <MenuItem key={breed} value={breed}>
                    {breed}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Weight (kg)"
              type="number"
              value={cattleForm.weight}
              onChange={(e) => setCattleForm({ ...cattleForm, weight: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label="Age (months)"
              type="number"
              value={cattleForm.age}
              onChange={(e) => setCattleForm({ ...cattleForm, age: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Sex</InputLabel>
              <Select
                value={cattleForm.sex}
                onChange={(e) => setCattleForm({ ...cattleForm, sex: e.target.value })}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Temperature (°C)"
              type="number"
              value={cattleForm.vitals.temperature}
              onChange={(e) => setCattleForm({ 
                ...cattleForm, 
                vitals: { ...cattleForm.vitals, temperature: parseFloat(e.target.value) || 38.5 }
              })}
              fullWidth
            />
            <TextField
              label="Heart Rate (bpm)"
              type="number"
              value={cattleForm.vitals.heartRate}
              onChange={(e) => setCattleForm({ 
                ...cattleForm, 
                vitals: { ...cattleForm.vitals, heartRate: parseInt(e.target.value) || 60 }
              })}
              fullWidth
            />
            <TextField
              label="Health Notes"
              multiline
              rows={3}
              value={cattleForm.healthNotes}
              onChange={(e) => setCattleForm({ ...cattleForm, healthNotes: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCattleOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateCattle} variant="contained">Update Cattle</Button>
        </DialogActions>
      </Dialog>

      {/* Cattle Detail Dialog */}
      <Dialog open={cattleDetailOpen} onClose={() => setCattleDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Cattle Details - {selectedCattleDetail?.tagNumber}</DialogTitle>
        <DialogContent>
          {selectedCattleDetail && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Breed:</strong> {selectedCattleDetail.breed}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Sex:</strong> {selectedCattleDetail.sex || 'Not specified'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Weight:</strong> {selectedCattleDetail.weight}kg
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Location:</strong> {selectedCattleDetail.location?.address || 'Unknown'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Health Status:</strong> {selectedCattleDetail.healthStatus}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Recent Photos
              </Typography>
              {selectedCattleDetail.photos && selectedCattleDetail.photos.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {selectedCattleDetail.photos.slice(-3).map((photo: any) => (
                    <Box key={photo.id} sx={{ textAlign: 'center' }}>
                      <img 
                        src={photo.url} 
                        alt={photo.filename}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <Typography variant="caption" display="block">
                        {new Date(photo.uploadDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No photos available
                </Typography>
              )}
              
              <Typography variant="h6" gutterBottom>
                Health Report
              </Typography>
              <Typography variant="body2">
                Last checkup: {new Date(selectedCattleDetail.lastCheckup).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Temperature: {selectedCattleDetail.vitals?.temperature || 'N/A'}°C
              </Typography>
              <Typography variant="body2">
                Heart Rate: {selectedCattleDetail.vitals?.heartRate || 'N/A'} bpm
              </Typography>
              {selectedCattleDetail.healthNotes && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Notes:</strong> {selectedCattleDetail.healthNotes}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCattleDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Cattle Dialog */}
      <Dialog open={editCattleOpen} onClose={() => setEditCattleOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Cattle Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Tag Number"
              value={cattleForm.tagNumber}
              onChange={(e) => setCattleForm({ ...cattleForm, tagNumber: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Breed</InputLabel>
              <Select
                value={cattleForm.breed}
                onChange={(e) => setCattleForm({ ...cattleForm, breed: e.target.value })}
              >
                {cattleBreeds.map((breed) => (
                  <MenuItem key={breed} value={breed}>
                    {breed}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Weight (kg)"
              type="number"
              value={cattleForm.weight}
              onChange={(e) => setCattleForm({ ...cattleForm, weight: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label="Age (months)"
              type="number"
              value={cattleForm.age}
              onChange={(e) => setCattleForm({ ...cattleForm, age: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Sex</InputLabel>
              <Select
                value={cattleForm.sex}
                onChange={(e) => setCattleForm({ ...cattleForm, sex: e.target.value })}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Temperature (°C)"
              type="number"
              value={cattleForm.vitals.temperature}
              onChange={(e) => setCattleForm({ 
                ...cattleForm, 
                vitals: { ...cattleForm.vitals, temperature: parseFloat(e.target.value) || 38.5 }
              })}
              fullWidth
            />
            <TextField
              label="Heart Rate (bpm)"
              type="number"
              value={cattleForm.vitals.heartRate}
              onChange={(e) => setCattleForm({ 
                ...cattleForm, 
                vitals: { ...cattleForm.vitals, heartRate: parseInt(e.target.value) || 60 }
              })}
              fullWidth
            />
            <TextField
              label="Health Notes"
              multiline
              rows={3}
              value={cattleForm.healthNotes}
              onChange={(e) => setCattleForm({ ...cattleForm, healthNotes: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCattleOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateCattle} variant="contained">Update Cattle</Button>
        </DialogActions>
      </Dialog>

      {/* Cattle Detail Dialog */}
      <Dialog open={cattleDetailOpen} onClose={() => setCattleDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Cattle Details - {selectedCattleDetail?.tagNumber}</DialogTitle>
        <DialogContent>
          {selectedCattleDetail && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Breed:</strong> {selectedCattleDetail.breed}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Sex:</strong> {selectedCattleDetail.sex || 'Not specified'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Weight:</strong> {selectedCattleDetail.weight}kg
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Location:</strong> {selectedCattleDetail.location?.address || 'Unknown'}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Health Status:</strong> {selectedCattleDetail.healthStatus}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Recent Photos
              </Typography>
              {selectedCattleDetail.photos && selectedCattleDetail.photos.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  {selectedCattleDetail.photos.slice(-3).map((photo: any) => (
                    <Box key={photo.id} sx={{ textAlign: 'center' }}>
                      <img 
                        src={photo.url} 
                        alt={photo.filename}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <Typography variant="caption" display="block">
                        {new Date(photo.uploadDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No photos available
                </Typography>
              )}
              
              <Typography variant="h6" gutterBottom>
                Health Report
              </Typography>
              <Typography variant="body2">
                Last checkup: {new Date(selectedCattleDetail.lastCheckup).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                Temperature: {selectedCattleDetail.vitals?.temperature || 'N/A'}°C
              </Typography>
              <Typography variant="body2">
                Heart Rate: {selectedCattleDetail.vitals?.heartRate || 'N/A'} bpm
              </Typography>
              {selectedCattleDetail.healthNotes && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Notes:</strong> {selectedCattleDetail.healthNotes}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCattleDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Cattle Detail Dialog */}
      <Dialog open={cattleDetailOpen} onClose={() => setCattleDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Cattle Details - {selectedCattleDetail?.tagNumber}</DialogTitle>
        <DialogContent>
          {selectedCattleDetail && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedCattleDetail.breed} - {selectedCattleDetail.label}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Weight:</strong> {selectedCattleDetail.weight}kg
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Age:</strong> {selectedCattleDetail.age} months
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Health Status:</strong> {selectedCattleDetail.healthStatus}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Location:</strong> {camps.find(c => c.id === selectedCattleDetail.campId)?.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Last Checkup:</strong> {new Date(selectedCattleDetail.lastCheckup).toLocaleDateString()}
              </Typography>
              {selectedCattleDetail.photos && selectedCattleDetail.photos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>Last Photo</Typography>
                  <img 
                    src={selectedCattleDetail.photos[selectedCattleDetail.photos.length - 1].url} 
                    alt="Cattle" 
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCattleDetailOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            startIcon={<Edit />}
            onClick={() => {
              setCattleDetailOpen(false);
              handleEditCattle(selectedCattleDetail);
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Cattle Dialog */}
      <Dialog open={!!selectedCattleForEdit} onClose={() => setSelectedCattleForEdit(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Cattle</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Tag Number"
              value={cattleForm.tagNumber}
              onChange={(e) => setCattleForm({ ...cattleForm, tagNumber: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Breed</InputLabel>
              <Select
                value={cattleForm.breed}
                onChange={(e) => setCattleForm({ ...cattleForm, breed: e.target.value })}
              >
                {cattleBreeds.map((breed) => (
                  <MenuItem key={breed} value={breed}>
                    {breed}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Label</InputLabel>
              <Select
                value={cattleForm.label}
                onChange={(e) => setCattleForm({ ...cattleForm, label: e.target.value })}
              >
                {cattleLabels.map((label) => (
                  <MenuItem key={label} value={label}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Weight (kg)"
              type="number"
              value={cattleForm.weight}
              onChange={(e) => setCattleForm({ ...cattleForm, weight: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <TextField
              label="Age (months)"
              type="number"
              value={cattleForm.age}
              onChange={(e) => setCattleForm({ ...cattleForm, age: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Health Status</InputLabel>
              <Select
                value={cattleForm.healthStatus}
                onChange={(e) => setCattleForm({ ...cattleForm, healthStatus: e.target.value })}
              >
                <MenuItem value="healthy">Healthy</MenuItem>
                <MenuItem value="sick">Sick</MenuItem>
                <MenuItem value="treatment">Treatment</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Camp</InputLabel>
              <Select
                value={cattleForm.campId}
                onChange={(e) => setCattleForm({ ...cattleForm, campId: e.target.value })}
              >
                {camps.map((camp) => (
                  <MenuItem key={camp.id} value={camp.id}>
                    {camp.name} {camp.type && `(${camp.type})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedCattleForEdit(null)}>Cancel</Button>
          <Button onClick={handleUpdateCattle} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Cattle Detail Dialog */}
      <Dialog open={cattleDetailOpen} onClose={() => setCattleDetailOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar>
              <Pets />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedCattleDetail?.tagNumber} - {selectedCattleDetail?.breed}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedCattleDetail?.label} | {selectedCattleDetail?.sex} | {selectedCattleDetail?.age} months
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {selectedCattleDetail?.lastPhoto && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Last Photo</Typography>
                <Card sx={{ maxWidth: 300 }}>
                  <img 
                    src={selectedCattleDetail.lastPhoto.url} 
                    alt="Last cattle photo"
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Taken: {selectedCattleDetail.lastPhoto.dateStamp} at {selectedCattleDetail.lastPhoto.timeStamp}
                    </Typography>
                    {selectedCattleDetail.lastPhoto.task && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Task: {selectedCattleDetail.lastPhoto.task}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Location & Details</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Current Location: {selectedCattleDetail?.currentLocation}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Weight: {selectedCattleDetail?.weight}kg | Health: {selectedCattleDetail?.healthStatus}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>Health Report</Typography>
              <Box sx={{ 
                background: 'rgba(148, 163, 184, 0.1)',
                padding: 2,
                borderRadius: 2,
                border: '1px solid rgba(148, 163, 184, 0.2)'
              }}>
                <Typography variant="body2" paragraph>
                  <strong>Health Status:</strong> {selectedCattleDetail?.healthStatus}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Last Checkup:</strong> {selectedCattleDetail?.lastCheckup}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Vitals:</strong>
                </Typography>
                <Typography variant="caption" display="block">
                  Temperature: {selectedCattleDetail?.vitals?.temperature || 'N/A'}°C
                </Typography>
                <Typography variant="caption" display="block">
                  Heart Rate: {selectedCattleDetail?.vitals?.heartRate || 'N/A'} bpm
                </Typography>
                <Typography variant="caption" display="block">
                  Respiratory Rate: {selectedCattleDetail?.vitals?.respiratoryRate || 'N/A'} breaths/min
                </Typography>
                {selectedCattleDetail?.healthNotes && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Notes:</strong> {selectedCattleDetail.healthNotes}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCattleDetailOpen(false)}>Close</Button>
          <Button variant="contained" onClick={() => {
            setCattleDetailOpen(false);
            handleEditCattle(selectedCattleDetail);
          }}>
            Edit Details
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CattleManagement;
