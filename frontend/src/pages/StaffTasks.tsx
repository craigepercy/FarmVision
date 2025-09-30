import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
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
  FormControlLabel,
} from '@mui/material';
import { Add, Person, Assignment, Message, Edit, CheckCircle } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addStaff, updateStaff, addTask, completeTask } from '../store/slices/staffSlice';

const StaffTasks: React.FC = () => {
  const { staff, tasks } = useSelector((state: RootState) => state.staff);
  const dispatch = useDispatch();
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editStaffOpen, setEditStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    assignedFarms: [] as string[],
    employeeNumber: '',
    dateOfBirth: '',
    idNumber: '',
    certifications: [] as string[],
    photo: '',
    permissions: [] as string[]
  });
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    requiresProof: false,
    farm: '',
    category: 'general' as 'general' | 'crops' | 'cattle' | 'maintenance'
  });

  const handleAddStaff = () => {
    const newStaff = {
      id: `staff${Date.now()}`,
      ...staffForm,
      status: 'active' as const,
      assignedTasks: 0
    };
    dispatch(addStaff(newStaff));
    setAddStaffOpen(false);
    setStaffForm({
      name: '',
      role: '',
      email: '',
      phone: '',
      assignedFarms: [],
      employeeNumber: '',
      dateOfBirth: '',
      idNumber: '',
      certifications: [],
      photo: '',
      permissions: []
    });
  };

  const handleEditStaff = (staff: any) => {
    setSelectedStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      assignedFarms: staff.assignedFarms || [],
      employeeNumber: staff.employeeNumber || '',
      dateOfBirth: staff.dateOfBirth || '',
      idNumber: staff.idNumber || '',
      certifications: staff.certifications || [],
      photo: staff.photo || '',
      permissions: staff.permissions || []
    });
    setEditStaffOpen(true);
  };

  const handleUpdateStaff = () => {
    if (selectedStaff) {
      const updatedStaff = {
        ...selectedStaff,
        ...staffForm
      };
      dispatch(updateStaff(updatedStaff));
      setEditStaffOpen(false);
      setSelectedStaff(null);
    }
  };

  const handleAddTask = () => {
    const newTask = {
      id: `task${Date.now()}`,
      ...taskForm,
      status: 'pending' as const,
      createdDate: new Date().toISOString(),
      completionProof: null
    };
    dispatch(addTask(newTask));
    setAddTaskOpen(false);
    setTaskForm({
      title: '',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      requiresProof: false,
      farm: '',
      category: 'general'
    });
  };

  const handleCompleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task?.requiresProof) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,application/pdf';
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          dispatch(completeTask({ 
            taskId, 
            proof: { 
              filename: file.name, 
              uploadDate: new Date().toISOString() 
            } 
          }));
        }
      };
      input.click();
    } else {
      dispatch(completeTask({ taskId, proof: null }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
          Staff & Tasks
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<Person />} sx={{ mr: 1 }} onClick={() => setAddStaffOpen(true)}>
            Add Staff
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddTaskOpen(true)}>
            New Task
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Staff Roster
              </Typography>
              <List>
                {staff.map((member, index) => (
                  <React.Fragment key={member.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {member.role} • {member.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.assignedTasks} active tasks
                            </Typography>
                          </Box>
                        }
                      />
                      <Box>
                        <Chip
                          label={member.status}
                          color={member.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                        <Button 
                          size="small" 
                          startIcon={<Edit />} 
                          sx={{ ml: 1 }} 
                          onClick={() => handleEditStaff(member)}
                        >
                          Edit
                        </Button>
                        <Button size="small" startIcon={<Message />} sx={{ ml: 1 }}>
                          Message
                        </Button>
                      </Box>
                    </ListItem>
                    {index < staff.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Tasks
              </Typography>
              <List>
                {tasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box 
                            sx={{ cursor: 'pointer' }}
                            onClick={() => console.log('Task clicked:', task.id)}
                          >
                            <Typography variant="subtitle2">
                              #{task.id.slice(-4)} - {task.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {task.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due: {new Date(task.dueDate).toLocaleDateString()} | Assigned to: {staff.find(s => s.id === task.assignedTo)?.name || 'Unassigned'}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Chip
                          label={task.priority}
                          color={getPriorityColor(task.priority)}
                          size="small"
                        />
                        <Chip
                          label={task.status}
                          color={getStatusColor(task.status)}
                          size="small"
                        />
                        {task.status !== 'completed' && (
                          <Button
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleCompleteTask(task.id)}
                            sx={{ ml: 1 }}
                          >
                            Complete
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                    {index < tasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 100%', minWidth: '100%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Assignment & Approval System
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Advanced task management features including assignment workflows, approval processes, 
                and staff messaging system will be implemented here. This includes role-based task 
                assignment and progress tracking.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Add Staff Dialog */}
      <Dialog open={addStaffOpen} onClose={() => setAddStaffOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Staff Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={staffForm.name}
              onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={staffForm.role}
                onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
              >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Foreman">Foreman</MenuItem>
                <MenuItem value="Worker">Worker</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Email"
              type="email"
              value={staffForm.email}
              onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone"
              value={staffForm.phone}
              onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Employee Number"
              value={staffForm.employeeNumber}
              onChange={(e) => setStaffForm({ ...staffForm, employeeNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={staffForm.dateOfBirth}
              onChange={(e) => setStaffForm({ ...staffForm, dateOfBirth: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="ID Number"
              value={staffForm.idNumber}
              onChange={(e) => setStaffForm({ ...staffForm, idNumber: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Assigned Farms</InputLabel>
              <Select
                multiple
                value={staffForm.assignedFarms}
                onChange={(e) => setStaffForm({ ...staffForm, assignedFarms: e.target.value as string[] })}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="North Field A">North Field A</MenuItem>
                <MenuItem value="South Field B">South Field B</MenuItem>
                <MenuItem value="East Pasture">East Pasture</MenuItem>
                <MenuItem value="West Grazing">West Grazing</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Certifications</InputLabel>
              <Select
                multiple
                value={staffForm.certifications}
                onChange={(e) => setStaffForm({ ...staffForm, certifications: e.target.value as string[] })}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="Hazardous Materials Handling">Hazardous Materials Handling</MenuItem>
                <MenuItem value="Heavy Machinery Operation">Heavy Machinery Operation</MenuItem>
                <MenuItem value="Livestock Management">Livestock Management</MenuItem>
                <MenuItem value="Crop Protection">Crop Protection</MenuItem>
                <MenuItem value="First Aid">First Aid</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddStaffOpen(false)}>Cancel</Button>
          <Button onClick={handleAddStaff} variant="contained">Add Staff</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={editStaffOpen} onClose={() => setEditStaffOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Staff Member</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={staffForm.name}
              onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Role"
              value={staffForm.role}
              onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={staffForm.email}
              onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone"
              value={staffForm.phone}
              onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Employee Number"
              value={staffForm.employeeNumber}
              onChange={(e) => setStaffForm({ ...staffForm, employeeNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Date of Birth"
              type="date"
              value={staffForm.dateOfBirth}
              onChange={(e) => setStaffForm({ ...staffForm, dateOfBirth: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="ID Number"
              value={staffForm.idNumber}
              onChange={(e) => setStaffForm({ ...staffForm, idNumber: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={staffForm.role}
                onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
              >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Foreman">Foreman</MenuItem>
                <MenuItem value="Worker">Worker</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assigned Farms</InputLabel>
              <Select
                multiple
                value={staffForm.assignedFarms}
                onChange={(e) => setStaffForm({ ...staffForm, assignedFarms: e.target.value as string[] })}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="North Field A">North Field A</MenuItem>
                <MenuItem value="South Field B">South Field B</MenuItem>
                <MenuItem value="East Pasture">East Pasture</MenuItem>
                <MenuItem value="West Grazing">West Grazing</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Certifications</InputLabel>
              <Select
                multiple
                value={staffForm.certifications}
                onChange={(e) => setStaffForm({ ...staffForm, certifications: e.target.value as string[] })}
                renderValue={(selected) => selected.join(', ')}
              >
                <MenuItem value="Hazardous Materials Handling">Hazardous Materials Handling</MenuItem>
                <MenuItem value="Heavy Machinery Operation">Heavy Machinery Operation</MenuItem>
                <MenuItem value="Livestock Management">Livestock Management</MenuItem>
                <MenuItem value="Crop Protection">Crop Protection</MenuItem>
                <MenuItem value="First Aid">First Aid</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditStaffOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateStaff} variant="contained">Update Staff</Button>
        </DialogActions>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={addTaskOpen} onClose={() => setAddTaskOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Task Title"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              fullWidth
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Assign To</InputLabel>
              <Select
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
              >
                {staff.map((member) => (
                  <MenuItem key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Due Date"
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={taskForm.requiresProof}
                  onChange={(e) => setTaskForm({ ...taskForm, requiresProof: e.target.checked })}
                />
              }
              label="Requires photo/document proof for completion"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTaskOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTask} variant="contained">Create Task</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffTasks;
