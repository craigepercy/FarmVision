import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
} from '@mui/material';
import { SmartToy, Send, Close, Lightbulb } from '@mui/icons-material';

const AIAssistant: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      sender: 'ai',
      message: 'Hello! I\'m your FarmVision AI Assistant. How can I help you optimize your farm operations today?',
      timestamp: new Date().toISOString(),
    },
  ]);

  const scenarios = [
    'Optimize crop rotation for next season',
    'Analyze cattle health trends',
    'Predict equipment maintenance needs',
    'Weather impact on yield forecast',
    'Cost optimization strategies',
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message,
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => [...prev, newMessage]);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: `I understand you're asking about "${message}". Based on your farm data, I recommend analyzing your current metrics and implementing data-driven strategies. Would you like me to run a detailed analysis?`,
        timestamp: new Date().toISOString(),
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);

    setMessage('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Assistant
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SmartToy sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              Intelligent Farm Management Assistant
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Get AI-powered insights and recommendations for your farm operations. 
            Ask questions about crop management, livestock care, equipment optimization, and more.
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Suggested Scenarios
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {scenarios.map((scenario, index) => (
              <Chip
                key={index}
                label={scenario}
                icon={<Lightbulb />}
                onClick={() => setMessage(scenario)}
                clickable
                variant="outlined"
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent AI Insights
          </Typography>
          <List>
            <ListItem>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <SmartToy />
              </Avatar>
              <ListItemText
                primary="Crop Health Optimization"
                secondary="Based on weather patterns, consider adjusting irrigation schedule for Field A to improve yield by 12%"
              />
            </ListItem>
            <ListItem>
              <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                <SmartToy />
              </Avatar>
              <ListItemText
                primary="Equipment Maintenance Alert"
                secondary="Tractor maintenance due in 5 days. Schedule now to prevent potential downtime during harvest season"
              />
            </ListItem>
            <ListItem>
              <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                <SmartToy />
              </Avatar>
              <ListItemText
                primary="Market Price Prediction"
                secondary="Corn prices expected to rise 8% next month. Consider timing your sales accordingly"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setChatOpen(true)}
      >
        <SmartToy />
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <SmartToy sx={{ mr: 1 }} />
              AI Assistant Chat
            </Box>
            <Button onClick={() => setChatOpen(false)}>
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, overflowY: 'auto', mb: 2 }}>
            {chatHistory.map((chat) => (
              <Box
                key={chat.id}
                display="flex"
                justifyContent={chat.sender === 'user' ? 'flex-end' : 'flex-start'}
                mb={1}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: chat.sender === 'user' ? 'primary.main' : 'grey.200',
                    color: chat.sender === 'user' ? 'white' : 'text.primary',
                  }}
                >
                  <Typography variant="body2">{chat.message}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Ask me anything about your farm..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AIAssistant;
