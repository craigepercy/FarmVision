import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { History, Search, FilterList } from '@mui/icons-material';

const AuditTrail: React.FC = () => {
  const [filterType, setFilterType] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');

  const auditLogs = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      user: 'John Smith',
      action: 'Updated cattle health record',
      entity: 'Cattle RF001234',
      details: 'Changed health status from healthy to treatment',
      type: 'update',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'Sarah Johnson',
      action: 'Added new field',
      entity: 'Field West-C',
      details: 'Created new field with 150 acres for corn planting',
      type: 'create',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      user: 'Farm Owner',
      action: 'Deleted equipment record',
      entity: 'Tractor JD-8320',
      details: 'Removed old tractor from inventory',
      type: 'delete',
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      user: 'System',
      action: 'Automated backup',
      entity: 'Database',
      details: 'Daily backup completed successfully',
      type: 'system',
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      user: 'John Smith',
      action: 'Updated task status',
      entity: 'Task: Cattle Health Check',
      details: 'Marked task as completed',
      type: 'update',
    },
  ];

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create': return 'success';
      case 'update': return 'info';
      case 'delete': return 'error';
      case 'system': return 'default';
      default: return 'default';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesType = !filterType || log.type === filterType;
    const matchesSearch = !searchTerm || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Audit Trail
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <History sx={{ mr: 1 }} />
            <Typography variant="h6">
              System Activity Log
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Track all system activities, user actions, and data changes across your farm management system.
            This audit trail helps maintain accountability and provides a complete history of operations.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <TextField
                fullWidth
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <FormControl fullWidth>
                <InputLabel>Filter by Type</InputLabel>
                <Select
                  value={filterType}
                  label="Filter by Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="create">Create</MenuItem>
                  <MenuItem value="update">Update</MenuItem>
                  <MenuItem value="delete">Delete</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: '0 1 auto' }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setFilterType('');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Activity History ({filteredLogs.length} records)
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Entity</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(log.timestamp).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {log.entity}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {log.details}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.type}
                        color={getActionColor(log.type)}
                        size="small"
                      />
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

export default AuditTrail;
