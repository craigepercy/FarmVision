import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, PhotoCamera, Assessment, Edit, Delete } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateField, deleteField } from '../store/slices/cropSlice';

const CropManagement: React.FC = () => {
  const { fields } = useSelector((state: RootState) => state.crop);
  const dispatch = useDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleUploadPhoto = (fieldId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Photo uploaded for field:', fieldId, file.name);
        alert(`Photo "${file.name}" uploaded successfully for field analysis!`);
      }
    };
    input.click();
  };

  const handleAnalysis = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const analysisResults = {
        cropHealth: Math.floor(Math.random() * 20) + 80,
        soilMoisture: Math.floor(Math.random() * 30) + 40,
        pestRisk: Math.floor(Math.random() * 40) + 10,
        yieldPrediction: (Math.random() * 2 + 7).toFixed(1)
      };
      alert(`Analysis Results for ${field.name}:
      
Crop Health: ${analysisResults.cropHealth}%
Soil Moisture: ${analysisResults.soilMoisture}%
Pest Risk: ${analysisResults.pestRisk}%
Predicted Yield: ${analysisResults.yieldPrediction} tons/hectare

AI Recommendation: ${analysisResults.cropHealth > 85 ? 'Excellent conditions! Continue current management.' : 'Consider adjusting irrigation and nutrient levels.'}`);
    }
  };

  const handleEditField = (field: any) => {
    setSelectedField(field);
    setFormData(field);
    setEditDialogOpen(true);
  };

  const handleSaveField = () => {
    if (selectedField) {
      dispatch(updateField(formData));
      setEditDialogOpen(false);
      setSelectedField(null);
      setFormData({});
    }
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteField(fieldId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planted': return 'info';
      case 'growing': return 'warning';
      case 'ready': return 'success';
      case 'harvested': return 'default';
      default: return 'default';
    }
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
          Crop Management
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add New Field
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {fields.map((field) => (
          <Box sx={{ flex: '1 1 300px', minWidth: '300px', maxWidth: '400px' }} key={field.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {field.name}
                  </Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip
                      label={field.status}
                      color={getStatusColor(field.status)}
                      size="small"
                    />
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => handleEditField(field)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Crop: {field.crop} ({field.varietal}) • {field.hectares} hectares ({field.plantedHectares} planted)
                </Typography>
                
                <Box mt={2}>
                  <Typography variant="body2" gutterBottom>
                    Health Score: {field.healthScore}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={field.healthScore}
                    color={field.healthScore > 80 ? 'success' : field.healthScore > 60 ? 'warning' : 'error'}
                  />
                </Box>

                <Box display="flex" gap={1} mt={2}>
                  <Button 
                    size="small" 
                    startIcon={<PhotoCamera />}
                    onClick={() => handleUploadPhoto(field.id)}
                  >
                    Upload Photo
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={<Assessment />}
                    onClick={() => handleAnalysis(field.id)}
                  >
                    Analysis
                  </Button>
                </Box>

                <Typography variant="caption" display="block" mt={1}>
                  Last updated: {new Date(field.lastUpdated).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Field Analysis Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed crop analysis, soil health monitoring, and yield predictions will be displayed here.
              Integration with IoT sensors and satellite imagery for comprehensive field management.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Field Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Field: {selectedField?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Field Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Box>
              <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <TextField
                  fullWidth
                  label="Location Address"
                  value={formData.location?.address || ''}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, address: e.target.value}})}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={formData.location?.lat || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, lat: parseFloat(e.target.value) || 0 }
                })}
                inputProps={{ step: 0.000001 }}
              />
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={formData.location?.lng || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  location: { ...formData.location, lng: parseFloat(e.target.value) || 0 }
                })}
                inputProps={{ step: 0.000001 }}
              />
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <TextField
                  fullWidth
                  label="Total Hectares"
                  type="number"
                  value={formData.hectares || ''}
                  onChange={(e) => setFormData({...formData, hectares: parseFloat(e.target.value)})}
                />
              </Box>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <TextField
                  fullWidth
                  label="Planted Hectares"
                  type="number"
                  value={formData.plantedHectares || ''}
                  onChange={(e) => setFormData({...formData, plantedHectares: parseFloat(e.target.value)})}
                />
              </Box>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status || ''}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <MenuItem value="planted">Planted</MenuItem>
                    <MenuItem value="growing">Growing</MenuItem>
                    <MenuItem value="ready">Ready</MenuItem>
                    <MenuItem value="harvested">Harvested</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  label="Crop Type"
                  value={formData.crop || ''}
                  onChange={(e) => setFormData({...formData, crop: e.target.value})}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  label="Varietal"
                  value={formData.varietal || ''}
                  onChange={(e) => setFormData({...formData, varietal: e.target.value})}
                />
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Soil Health</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                <TextField
                  fullWidth
                  label="pH Level"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={formData.soilHealth?.ph || ''}
                  onChange={(e) => setFormData({...formData, soilHealth: {...formData.soilHealth, ph: parseFloat(e.target.value)}})}
                />
              </Box>
              <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                <TextField
                  fullWidth
                  label="Nitrogen (ppm)"
                  type="number"
                  value={formData.soilHealth?.nitrogen || ''}
                  onChange={(e) => setFormData({...formData, soilHealth: {...formData.soilHealth, nitrogen: parseInt(e.target.value)}})}
                />
              </Box>
              <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                <TextField
                  fullWidth
                  label="Phosphorus (ppm)"
                  type="number"
                  value={formData.soilHealth?.phosphorus || ''}
                  onChange={(e) => setFormData({...formData, soilHealth: {...formData.soilHealth, phosphorus: parseInt(e.target.value)}})}
                />
              </Box>
              <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                <TextField
                  fullWidth
                  label="Potassium (ppm)"
                  type="number"
                  value={formData.soilHealth?.potassium || ''}
                  onChange={(e) => setFormData({...formData, soilHealth: {...formData.soilHealth, potassium: parseInt(e.target.value)}})}
                />
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Crop Inputs</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <TextField
                  fullWidth
                  label="Fertilizer Type"
                  value={formData.cropInputs?.fertilizer || ''}
                  onChange={(e) => setFormData({...formData, cropInputs: {...formData.cropInputs, fertilizer: e.target.value}})}
                />
              </Box>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <TextField
                  fullWidth
                  label="Pesticides Used"
                  value={formData.cropInputs?.pesticides || ''}
                  onChange={(e) => setFormData({...formData, cropInputs: {...formData.cropInputs, pesticides: e.target.value}})}
                />
              </Box>
              <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                <TextField
                  fullWidth
                  label="Irrigation (mm/year)"
                  type="number"
                  value={formData.cropInputs?.irrigation || ''}
                  onChange={(e) => setFormData({...formData, cropInputs: {...formData.cropInputs, irrigation: parseInt(e.target.value)}})}
                />
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Historic Yields &amp; Grades</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                <TextField
                  fullWidth
                  label="2023 Yield (tons/ha)"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={formData.historicYields?.[0]?.yield || ''}
                  onChange={(e) => {
                    const yields = formData.historicYields || [{year: 2023, yield: 0, grade: 'A'}];
                    yields[0] = {...yields[0], yield: parseFloat(e.target.value)};
                    setFormData({...formData, historicYields: yields});
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                <FormControl fullWidth>
                  <InputLabel>2023 Grade</InputLabel>
                  <Select
                    value={formData.historicYields?.[0]?.grade || 'A'}
                    onChange={(e) => {
                      const yields = formData.historicYields || [{year: 2023, yield: 0, grade: 'A'}];
                      yields[0] = {...yields[0], grade: e.target.value};
                      setFormData({...formData, historicYields: yields});
                    }}
                  >
                    <MenuItem value="A">Grade A</MenuItem>
                    <MenuItem value="B">Grade B</MenuItem>
                    <MenuItem value="C">Grade C</MenuItem>
                    <MenuItem value="D">Grade D</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                <TextField
                  fullWidth
                  label="2022 Yield (tons/ha)"
                  type="number"
                  inputProps={{ step: "0.1" }}
                  value={formData.historicYields?.[1]?.yield || ''}
                  onChange={(e) => {
                    const yields = formData.historicYields || [{year: 2023, yield: 0, grade: 'A'}, {year: 2022, yield: 0, grade: 'A'}];
                    if (yields.length < 2) yields.push({year: 2022, yield: 0, grade: 'A'});
                    yields[1] = {...yields[1], yield: parseFloat(e.target.value)};
                    setFormData({...formData, historicYields: yields});
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 120px', minWidth: '120px' }}>
                <FormControl fullWidth>
                  <InputLabel>2022 Grade</InputLabel>
                  <Select
                    value={formData.historicYields?.[1]?.grade || 'A'}
                    onChange={(e) => {
                      const yields = formData.historicYields || [{year: 2023, yield: 0, grade: 'A'}, {year: 2022, yield: 0, grade: 'A'}];
                      if (yields.length < 2) yields.push({year: 2022, yield: 0, grade: 'A'});
                      yields[1] = {...yields[1], grade: e.target.value};
                      setFormData({...formData, historicYields: yields});
                    }}
                  >
                    <MenuItem value="A">Grade A</MenuItem>
                    <MenuItem value="B">Grade B</MenuItem>
                    <MenuItem value="C">Grade C</MenuItem>
                    <MenuItem value="D">Grade D</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                AI Recommendations Based on Your Data:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formData.soilHealth?.ph < 6.0 ? 
                  "Soil pH is low - consider lime application to improve nutrient availability. " : 
                  formData.soilHealth?.ph > 7.5 ? 
                  "Soil pH is high - consider sulfur application to lower pH. " : 
                  "Soil pH is optimal. "}
                {formData.soilHealth?.nitrogen < 50 ? 
                  "Nitrogen levels are low - increase nitrogen fertilizer application. " : 
                  "Nitrogen levels are adequate. "}
                {formData.historicYields?.[0]?.yield && formData.historicYields?.[1]?.yield && 
                 formData.historicYields[0].yield < formData.historicYields[1].yield ? 
                  "Yield declined from last year - review pest management and soil health practices." : 
                  "Yield trends are positive - continue current management practices."}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveField} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CropManagement;
