import React from 'react';
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
} from '@mui/material';
import { Add, Person, Assignment, Message } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const StaffTasks: React.FC = () => {
  const { staff, tasks } = useSelector((state: RootState) => state.staff);

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
        <Typography variant="h4">
          Staff & Tasks
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<Person />} sx={{ mr: 1 }}>
            Add Staff
          </Button>
          <Button variant="contained" startIcon={<Add />}>
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
                        primary={task.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {task.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Due: {new Date(task.dueDate).toLocaleDateString()}
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
    </Box>
  );
};

export default StaffTasks;
