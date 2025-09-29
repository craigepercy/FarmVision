import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Add, QrCode, LocalHospital, LocationOn } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const CattleManagement: React.FC = () => {
  const { herd, totalCount } = useSelector((state: RootState) => state.cattle);

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'sick': return 'error';
      case 'treatment': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Cattle Management
        </Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add New Cattle
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Herd
              </Typography>
              <Typography variant="h4">
                {totalCount}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Healthy
              </Typography>
              <Typography variant="h4" color="success.main">
                {herd.filter(c => c.healthStatus === 'healthy').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                In Treatment
              </Typography>
              <Typography variant="h4" color="warning.main">
                {herd.filter(c => c.healthStatus === 'treatment').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sick
              </Typography>
              <Typography variant="h4" color="error.main">
                {herd.filter(c => c.healthStatus === 'sick').length}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Herd Overview
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>RFID Tag</TableCell>
                  <TableCell>Breed</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Weight (lbs)</TableCell>
                  <TableCell>Health Status</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {herd.map((cattle) => (
                  <TableRow key={cattle.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <QrCode sx={{ mr: 1 }} />
                        {cattle.rfidTag}
                      </Box>
                    </TableCell>
                    <TableCell>{cattle.breed}</TableCell>
                    <TableCell>{cattle.age} years</TableCell>
                    <TableCell>{cattle.weight}</TableCell>
                    <TableCell>
                      <Chip
                        label={cattle.healthStatus}
                        color={getHealthStatusColor(cattle.healthStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <LocationOn sx={{ mr: 1 }} />
                        {cattle.location}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<LocalHospital />}>
                        Health Log
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CattleManagement;
