import React, { useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const AIAssistant: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [, setLastRefresh] = useState(new Date());
  
  const { fields } = useSelector((state: RootState) => state.crop);
  const { cattle, camps } = useSelector((state: RootState) => state.cattle);
  const { transactions } = useSelector((state: RootState) => state.finance);
  const { equipment } = useSelector((state: RootState) => state.machinery);

  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      sender: 'ai',
      message: 'Hello! I\'m your FarmVision AI Assistant with access to your real farm data. How can I help you optimize your operations today?',
      timestamp: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 3 * 60 * 60 * 1000); // 3 hours

    return () => clearInterval(interval);
  }, []);

  const scenarios = [
    'Optimize crop rotation for next season',
    'Analyze cattle health trends',
    'Predict equipment maintenance needs',
    'Weather impact on yield forecast',
    'Cost optimization strategies',
  ];

  const generateAIResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('field')) {
      const avgHealth = fields.reduce((sum, f) => sum + f.healthScore, 0) / fields.length;
      return `Based on your ${fields.length} fields, average crop health is ${avgHealth.toFixed(1)}%. ${avgHealth > 80 ? 'Excellent conditions!' : 'Consider reviewing irrigation and nutrient management.'} Your best performing field is ${fields.sort((a, b) => b.healthScore - a.healthScore)[0]?.name}.`;
    }
    
    if (lowerMessage.includes('cattle') || lowerMessage.includes('livestock')) {
      const healthyCattle = cattle.filter(c => c.healthStatus === 'healthy').length;
      return `You have ${cattle.length} cattle across ${camps.length} camps. ${healthyCattle} are healthy (${((healthyCattle/cattle.length)*100).toFixed(1)}%). ${cattle.length - healthyCattle > 0 ? `${cattle.length - healthyCattle} need attention.` : 'All cattle are in good health!'}`;
    }
    
    if (lowerMessage.includes('finance') || lowerMessage.includes('money') || lowerMessage.includes('profit')) {
      const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return `Your current financial position: R${totalIncome.toLocaleString()} income, R${totalExpenses.toLocaleString()} expenses. Net profit: R${(totalIncome - totalExpenses).toLocaleString()}. ${totalIncome > totalExpenses ? 'Strong performance!' : 'Consider cost optimization strategies.'}`;
    }
    
    if (lowerMessage.includes('equipment') || lowerMessage.includes('machinery')) {
      const availableEquip = equipment.filter(e => e.status === 'Available').length;
      const maintenanceDue = equipment.filter(e => {
        const daysUntil = Math.ceil((new Date(e.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 7;
      }).length;
      return `Equipment status: ${availableEquip}/${equipment.length} available. ${maintenanceDue > 0 ? `${maintenanceDue} units need maintenance within 7 days.` : 'All equipment maintenance is up to date.'}`;
    }
    
    return `Based on your current farm data: ${fields.length} fields, ${cattle.length} cattle, ${equipment.length} equipment units. I can provide specific insights about crops, livestock, finances, or equipment. What would you like to know more about?`;
  };

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
        message: generateAIResponse(message),
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
