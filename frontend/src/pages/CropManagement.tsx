import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
} from '@mui/material';
import { Add, PhotoCamera, Assessment } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const CropManagement: React.FC = () => {
  const { fields } = useSelector((state: RootState) => state.crop);

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
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
                  <Chip
                    label={field.status}
                    color={getStatusColor(field.status)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Crop: {field.crop} • {field.acres} acres
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
                  <Button size="small" startIcon={<PhotoCamera />}>
                    Upload Photo
                  </Button>
                  <Button size="small" startIcon={<Assessment />}>
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
    </Box>
  );
};

export default CropManagement;
