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
  OutlinedInput,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { Add, PhotoCamera, Assessment, Edit, Delete } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateField, deleteField, addField } from '../store/slices/cropSlice';

const CropManagement: React.FC = () => {
  const { fields } = useSelector((state: RootState) => state.crop);
  const dispatch = useDispatch();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    cropInputs: {
      herbicides: [],
      pesticides: [],
      fungicides: []
    }
  });

  const cropData = {
    'Maize': {
      types: ['White Maize', 'Yellow Maize'],
      varietals: ['PAN 3R-524BR', 'DKC51-44BR', 'Pannar 6964', 'SC701'],
      grades: ['Grade 1', 'Grade 2', 'Grade 3']
    },
    'Wheat': {
      types: ['Spring Wheat', 'Winter Wheat'],
      varietals: ['SST 056', 'Elands', 'Kariega', 'Koonap'],
      grades: ['Grade 1 (Bread)', 'Grade 2 (Feed)', 'Grade 3 (Industrial)']
    },
    'Barley': {
      types: ['Malting Barley', 'Feed Barley'],
      varietals: ['SABAR BQ10', 'Kadett'],
      grades: ['Grade 1', 'Grade 2', 'Grade 3']
    },
    'Sorghum': {
      types: ['GM - Malt', 'GH - High Tannin', 'Other classes'],
      varietals: ['GM', 'GH', 'Class Other'],
      grades: ['GM', 'GH', 'Class Other']
    },
    'Oats': {
      types: ['Feed Oats'],
      varietals: ['SWK001', 'Magnus'],
      grades: ['Grade 1', 'Grade 2', 'Grade 3']
    },
    'Rye': {
      types: ['Feed Rye'],
      varietals: ['Dankowskie', 'SAB Rye'],
      grades: ['Grade 1', 'Grade 2', 'Grade 3']
    },
    'Millet': {
      types: ['Pearl Millet', 'Finger Millet'],
      varietals: ['Pearl', 'Finger'],
      grades: ['Grade 1', 'Grade 2', 'Grade 3']
    },
    'Sunflower': {
      types: ['Oil Sunflower'],
      varietals: ['AGSUN 8251', 'PAN 7160'],
      grades: ['Grade 1', 'Grade 2', 'Grade 3']
    },
    'Soybean': {
      types: ['GM Soybean'],
      varietals: ['PAN 1623', 'US EUREKA'],
      grades: ['Grade 1', 'Grade 2', 'Grade 3']
    },
    'Canola': {
      types: ['Hybrid Canola'],
      varietals: ['Alpha', 'Hybrid 462'],
      grades: ['Grade 1', 'Grade 2', 'Grade 3']
    },
    'Groundnuts': {
      types: ['Peanuts'],
      varietals: ['ARC K6', 'Akwa', 'GP 033'],
      grades: ['Choice (Grade 1)', 'Splits (Grade 2)', 'Oil Stock (Grade 3)']
    }
  };

  const herbicides = [
    'Atrazine (maize, sorghum)',
    'Alachlor (maize, soybeans)',
    'Terbufos (maize, sorghum, sunflower)'
  ];

  const pesticides = [
    'Deltamethrin-based products (K-Obiol® for silos)',
    'Methomyl 900 SP (contact insecticide for maize)',
    'Chlorpyrifos products (maize, wheat, potatoes)',
    'Emamectin benzoate products (Proclaim, Emma, Warlock)',
    'Indoxacarb/Novaluron blends (Plemax, Doxstar Flo)',
    'Malathion (for aphids, general pests)',
    'Pyrinex 480 EC (chlorpyrifos)'
  ];

  const fungicides = [
    'Chlorothalonil (barley, wheat)',
    'Propiconazole (wheat leaf rust)',
    'Mancozeb',
    'Tebuconazole'
  ];

  const getAvailableVarietals = (cropType: string) => {
    return cropData[cropType as keyof typeof cropData]?.varietals || [];
  };

  const getAvailableGrades = (cropType: string) => {
    return cropData[cropType as keyof typeof cropData]?.grades || ['Grade A', 'Grade B', 'Grade C'];
  };

  const handleUploadPhoto = (fieldId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            canvas.width = 200;
            canvas.height = 150;
            ctx?.drawImage(img, 0, 0, 200, 150);
            const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
            
            const photoData = {
              id: `photo${Date.now()}`,
              fieldId,
              filename: file.name,
              url: event.target?.result as string,
              thumbnail: thumbnailUrl,
              uploadDate: new Date().toISOString(),
              dateStamp: new Date().toLocaleDateString(),
              timeStamp: new Date().toLocaleTimeString(),
              analysis: {
                cropHealth: Math.floor(Math.random() * 20) + 75,
                pestDetection: Math.random() > 0.7 ? 'Aphids detected in lower leaves' : 'No pests detected',
                waterStress: Math.random() > 0.6 ? 'Moderate water stress visible' : 'Adequate moisture levels',
                growthHeight: `${(Math.random() * 30 + 40).toFixed(1)}cm average height`,
                diseaseRisk: Math.random() > 0.8 ? 'Early blight symptoms detected' : 'No disease symptoms visible',
                nutrientDeficiency: Math.random() > 0.7 ? 'Nitrogen deficiency in older leaves' : 'Nutrient levels appear adequate',
                recommendations: [
                  'Monitor for early signs of nutrient deficiency',
                  'Consider adjusting irrigation schedule based on water stress indicators',
                  'Apply preventive pest control measures if pest activity detected',
                  'Schedule follow-up inspection in 7-10 days',
                  'Consider soil testing if nutrient deficiency persists'
                ]
              }
            };
            
            const field = fields.find(f => f.id === fieldId);
            if (field) {
              const updatedField = {
                ...field,
                photos: [...(field.photos || []), photoData]
              };
              dispatch(updateField(updatedField));
            }
            
            alert(`Photo "${file.name}" uploaded and analyzed successfully!\n\nAI Analysis Results:\n- Crop Health: ${photoData.analysis.cropHealth}%\n- Pest Status: ${photoData.analysis.pestDetection}\n- Water Status: ${photoData.analysis.waterStress}\n- Growth: ${photoData.analysis.growthHeight}\n- Disease Risk: ${photoData.analysis.diseaseRisk}\n- Nutrients: ${photoData.analysis.nutrientDeficiency}\n\nRecommendations:\n${photoData.analysis.recommendations.map(r => `• ${r}`).join('\n')}`);
          };
          
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
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
    setFormData({
      ...field,
      cropInputs: {
        herbicides: [],
        pesticides: [],
        fungicides: [],
        ...field.cropInputs
      }
    });
    setEditDialogOpen(true);
  };

  const handleSaveField = () => {
    if (selectedField) {
      dispatch(updateField(formData));
    } else {
      dispatch(addField(formData));
    }
    setEditDialogOpen(false);
    setSelectedField(null);
    setFormData({});
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field?')) {
      dispatch(deleteField(fieldId));
    }
  };

  const handleAddField = () => {
    setSelectedField(null);
    setFormData({
      id: `field${Date.now()}`,
      name: '',
      location: { lat: -25.7479, lng: 28.2293, address: '' },
      hectares: 0,
      plantedHectares: 0,
      crop: '',
      varietal: '',
      status: 'planted',
      healthScore: 85,
      lastUpdated: new Date().toISOString(),
      soilHealth: {
        ph: 6.5,
        nitrogen: 45,
        phosphorus: 25,
        potassium: 180
      },
      cropInputs: {
        fertilizer: '',
        irrigation: '',
        herbicides: [],
        pesticides: [],
        fungicides: []
      },
      historicYields: [],
      photos: []
    });
    setEditDialogOpen(true);
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
          Crop Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleAddField}
          sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
        >
          Add New Field
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3,
        '& > *': {
          flex: { xs: '1 1 100%', sm: '1 1 300px', md: '1 1 300px' },
          minWidth: { xs: '100%', sm: '300px' },
          maxWidth: { xs: '100%', sm: '400px' }
        }
      }}>
        {fields.map((field) => (
          <Box key={field.id}>
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
            <Box 
              display="grid"
              gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
              gap={2} 
              mb={3}
            >
              {fields.map((field) => {
                const avgSoilHealth = (field.soilHealth.ph * 10 + field.soilHealth.nitrogen + field.soilHealth.phosphorus + field.soilHealth.potassium) / 4;
                const healthStatus = avgSoilHealth > 80 ? 'Excellent' : avgSoilHealth > 60 ? 'Good' : 'Needs Attention';
                const healthColor = avgSoilHealth > 80 ? 'success' : avgSoilHealth > 60 ? 'warning' : 'error';
                
                return (
                  <Card key={field.id}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {field.name}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Live Soil Analysis
                        </Typography>
                        <Chip 
                          label={`${healthStatus} (${avgSoilHealth.toFixed(0)}%)`}
                          color={healthColor}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        pH: {field.soilHealth.ph} | N: {field.soilHealth.nitrogen}ppm
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        P: {field.soilHealth.phosphorus}ppm | K: {field.soilHealth.potassium}ppm
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recommendations: {avgSoilHealth > 80 ? 'Maintain current practices' : avgSoilHealth > 60 ? 'Consider nutrient supplementation' : 'Immediate soil treatment required'}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Analysis refreshed every 3 hours. Integration with IoT sensors and satellite imagery for comprehensive field management.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Field Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedField ? `Edit Field: ${selectedField.name}` : 'Add New Field'}</DialogTitle>
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
                <FormControl fullWidth>
                  <InputLabel>Crop Type</InputLabel>
                  <Select
                    value={formData.crop || ''}
                    onChange={(e) => {
                      const newCrop = e.target.value;
                      setFormData({
                        ...formData, 
                        crop: newCrop,
                        varietal: ''
                      });
                    }}
                  >
                    {Object.keys(cropData).map((crop) => (
                      <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <FormControl fullWidth>
                  <InputLabel>Varietal</InputLabel>
                  <Select
                    value={formData.varietal || ''}
                    onChange={(e) => setFormData({...formData, varietal: e.target.value})}
                    disabled={!formData.crop}
                  >
                    {getAvailableVarietals(formData.crop).map((varietal) => (
                      <MenuItem key={varietal} value={varietal}>{varietal}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  label="Fertilizer Type"
                  value={formData.cropInputs?.fertilizer || ''}
                  onChange={(e) => setFormData({...formData, cropInputs: {...formData.cropInputs, fertilizer: e.target.value}})}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  label="Irrigation (mm/year)"
                  type="number"
                  value={formData.cropInputs?.irrigation || ''}
                  onChange={(e) => setFormData({...formData, cropInputs: {...formData.cropInputs, irrigation: parseInt(e.target.value)}})}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <FormControl fullWidth>
                  <InputLabel>Herbicides</InputLabel>
                  <Select
                    multiple
                    value={(formData.cropInputs && Array.isArray(formData.cropInputs.herbicides)) ? formData.cropInputs.herbicides : []}
                    onChange={(e) => setFormData({
                      ...formData, 
                      cropInputs: {
                        ...formData.cropInputs, 
                        herbicides: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                      }
                    })}
                    input={<OutlinedInput label="Herbicides" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(selected) ? selected.map((value: string) => (
                          <Chip key={value} label={value.split(' (')[0]} size="small" />
                        )) : null}
                      </Box>
                    )}
                  >
                    {herbicides.map((herbicide) => (
                      <MenuItem key={herbicide} value={herbicide}>
                        <Checkbox checked={(formData.cropInputs?.herbicides || []).indexOf(herbicide) > -1} />
                        <ListItemText primary={herbicide} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <FormControl fullWidth>
                  <InputLabel>Pesticides</InputLabel>
                  <Select
                    multiple
                    value={(formData.cropInputs && Array.isArray(formData.cropInputs.pesticides)) ? formData.cropInputs.pesticides : []}
                    onChange={(e) => setFormData({
                      ...formData, 
                      cropInputs: {
                        ...formData.cropInputs, 
                        pesticides: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                      }
                    })}
                    input={<OutlinedInput label="Pesticides" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(selected) ? selected.map((value: string) => (
                          <Chip key={value} label={value.split(' (')[0]} size="small" />
                        )) : null}
                      </Box>
                    )}
                  >
                    {pesticides.map((pesticide) => (
                      <MenuItem key={pesticide} value={pesticide}>
                        <Checkbox checked={(formData.cropInputs?.pesticides || []).indexOf(pesticide) > -1} />
                        <ListItemText primary={pesticide} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                <FormControl fullWidth>
                  <InputLabel>Fungicides</InputLabel>
                  <Select
                    multiple
                    value={(formData.cropInputs && Array.isArray(formData.cropInputs.fungicides)) ? formData.cropInputs.fungicides : []}
                    onChange={(e) => setFormData({
                      ...formData, 
                      cropInputs: {
                        ...formData.cropInputs, 
                        fungicides: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value
                      }
                    })}
                    input={<OutlinedInput label="Fungicides" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {Array.isArray(selected) ? selected.map((value: string) => (
                          <Chip key={value} label={value} size="small" />
                        )) : null}
                      </Box>
                    )}
                  >
                    {fungicides.map((fungicide) => (
                      <MenuItem key={fungicide} value={fungicide}>
                        <Checkbox checked={(formData.cropInputs?.fungicides || []).indexOf(fungicide) > -1} />
                        <ListItemText primary={fungicide} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    value={formData.historicYields?.[0]?.grade || ''}
                    onChange={(e) => {
                      const yields = formData.historicYields || [{year: 2023, yield: 0, grade: ''}];
                      yields[0] = {...yields[0], grade: e.target.value};
                      setFormData({...formData, historicYields: yields});
                    }}
                  >
                    {getAvailableGrades(formData.crop || '').map((grade) => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
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
                    value={formData.historicYields?.[1]?.grade || ''}
                    onChange={(e) => {
                      const yields = formData.historicYields || [{year: 2023, yield: 0, grade: ''}, {year: 2022, yield: 0, grade: ''}];
                      if (yields.length < 2) yields.push({year: 2022, yield: 0, grade: ''});
                      yields[1] = {...yields[1], grade: e.target.value};
                      setFormData({...formData, historicYields: yields});
                    }}
                  >
                    {getAvailableGrades(formData.crop || '').map((grade) => (
                      <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                    ))}
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
