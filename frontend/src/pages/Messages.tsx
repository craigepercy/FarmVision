import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
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
  Chip,
  IconButton,
  Badge,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Inbox,
  Send,
  Drafts,
  Assignment,
  Add,
  Reply,
  Forward,
  Delete,
  AttachFile,
  Close,
  Person,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { createNewThread, markThreadAsRead } from '../store/slices/messagingSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`messages-tabpanel-${index}`}
      aria-labelledby={`messages-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

const Messages: React.FC = () => {
  const dispatch = useDispatch();
  const { messages, threads } = useSelector((state: RootState) => state.messaging);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeForm, setComposeForm] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedThread(null);
  };

  const handleThreadSelect = (threadId: string) => {
    setSelectedThread(threadId);
    dispatch(markThreadAsRead(threadId));
  };

  const handleCompose = () => {
    if (composeForm.recipient && composeForm.subject && composeForm.content) {
      dispatch(createNewThread({
        recipient: composeForm.recipient,
        subject: composeForm.subject,
        content: composeForm.content,
      }));
      setComposeOpen(false);
      setComposeForm({
        recipient: '',
        subject: '',
        content: '',
        priority: 'normal',
      });
    }
  };

  const handleReply = (threadId: string) => {
    const thread = threads.find(t => t.id === threadId);
    if (thread) {
      setComposeForm({
        recipient: thread.participants.find(p => p !== 'User') || '',
        subject: `Re: ${thread.subject}`,
        content: '',
        priority: 'normal',
      });
      setComposeOpen(true);
    }
  };

  const getFilteredThreads = () => {
    switch (selectedTab) {
      case 0: // Inbox
        return threads.filter(t => t.participants.includes('User') && messages.some(m => m.threadId === t.id && m.recipient === 'User'));
      case 1: // Sent
        return threads.filter(t => messages.some(m => m.threadId === t.id && m.sender === 'User'));
      case 2: // Drafts
        return []; // Implement draft functionality
      case 3: // Tasks
        return threads.filter(t => messages.some(m => m.threadId === t.id && m.type === 'alert'));
      default:
        return threads;
    }
  };

  const getSelectedThreadMessages = () => {
    if (!selectedThread) return [];
    return messages.filter(m => m.threadId === selectedThread).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  const tabs = [
    { label: 'Inbox', icon: <Inbox />, count: threads.filter(t => t.unreadCount > 0).length },
    { label: 'Sent', icon: <Send />, count: 0 },
    { label: 'Drafts', icon: <Drafts />, count: 0 },
    { label: 'Tasks', icon: <Assignment />, count: threads.filter(t => messages.some(m => m.threadId === t.id && m.type === 'alert')).length },
  ];

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
          Messages
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setComposeOpen(true)}
        >
          Compose
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 200px)' }}>
        {/* Left Panel - Folders and Conversations */}
        <Paper sx={{ width: '30%', minWidth: '300px', display: 'flex', flexDirection: 'column' }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={
                  <Badge badgeContent={tab.count} color="error">
                    {tab.icon}
                  </Badge>
                }
                label={tab.label}
                sx={{ minWidth: 'auto' }}
              />
            ))}
          </Tabs>

          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {tabs.map((_tab, index) => (
              <TabPanel key={index} value={selectedTab} index={index}>
                <List sx={{ p: 0 }}>
                  {getFilteredThreads().map((thread) => (
                    <ListItem
                      key={thread.id}
                      component="div"
                      onClick={() => handleThreadSelect(thread.id)}
                      sx={{
                        cursor: 'pointer',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: selectedThread === thread.id ? 'primary.light' : 'transparent',
                        '&:hover': {
                          backgroundColor: selectedThread === thread.id ? 'primary.light' : 'action.hover',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2" sx={{ fontWeight: thread.unreadCount > 0 ? 600 : 400 }}>
                              {thread.subject}
                            </Typography>
                            {thread.unreadCount > 0 && (
                              <Badge badgeContent={thread.unreadCount} color="primary" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {thread.lastMessage}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(thread.lastMessageTime).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
            ))}
          </Box>
        </Paper>

        {/* Right Panel - Message Content */}
        <Paper sx={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
          {selectedThread ? (
            <>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">
                    {threads.find(t => t.id === selectedThread)?.subject}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleReply(selectedThread)}>
                      <Reply />
                    </IconButton>
                    <IconButton>
                      <Forward />
                    </IconButton>
                    <IconButton>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {getSelectedThreadMessages().map((message) => (
                  <Box key={message.id} sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {message.sender}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      {message.type === 'alert' && (
                        <Chip label="Alert" color="error" size="small" sx={{ ml: 'auto' }} />
                      )}
                    </Box>
                    <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body1">
                        {message.content}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="h6" color="text.secondary">
                Select a conversation to view messages
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Compose Dialog */}
      <Dialog open={composeOpen} onClose={() => setComposeOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Compose Message
            <IconButton onClick={() => setComposeOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Recipient"
              value={composeForm.recipient}
              onChange={(e) => setComposeForm({ ...composeForm, recipient: e.target.value })}
              fullWidth
            />
            <TextField
              label="Subject"
              value={composeForm.subject}
              onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={composeForm.priority}
                onChange={(e) => setComposeForm({ ...composeForm, priority: e.target.value as 'low' | 'normal' | 'high' })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Message"
              multiline
              rows={8}
              value={composeForm.content}
              onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
              fullWidth
            />
            <Box display="flex" alignItems="center" gap={1}>
              <Button startIcon={<AttachFile />} variant="outlined" size="small">
                Attach File
              </Button>
              <Typography variant="caption" color="text.secondary">
                No files attached
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setComposeOpen(false)}>Cancel</Button>
          <Button onClick={handleCompose} variant="contained">Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Messages;
