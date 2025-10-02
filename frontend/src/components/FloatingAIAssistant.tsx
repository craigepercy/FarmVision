import React, { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Button,
  Badge,
} from '@mui/material';
import {
  SmartToy,
  Close,
  Send,
  Minimize,
  KeyboardArrowUp,
  Person,
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import perplexityService from '../services/perplexityService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}


const FloatingAIAssistant: React.FC = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { equipment } = useSelector((state: RootState) => state.machinery);
  const { fields } = useSelector((state: RootState) => state.crop);
  const { cattle } = useSelector((state: RootState) => state.cattle);
  
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [hasUnreadSuggestions, setHasUnreadSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (open && chatHistory.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        sender: 'ai',
        content: getContextualWelcome(),
        timestamp: new Date(),
        actions: getContextualActions(),
      };
      setChatHistory([welcomeMessage]);
      setHasUnreadSuggestions(false);
    }
  }, [open, location.pathname]);

  const getContextualWelcome = (): string => {
    const path = location.pathname;
    const userName = user?.name || 'there';

    switch (path) {
      case '/dashboard':
        return `Hi ${userName}! I can see you're on the dashboard. I can help you understand your farm's performance, weather alerts, or suggest priority actions for today.`;
      case '/crops':
        return `Hi ${userName}! I see you're managing crops. I can help with field analysis, planting recommendations, or harvest timing based on current conditions.`;
      case '/cattle':
        return `Hi ${userName}! I'm here to help with cattle management. I can assist with health monitoring, breeding schedules, or feed optimization.`;
      case '/machinery':
        return `Hi ${userName}! I can help with equipment management, maintenance scheduling, or suggest optimal equipment assignments for your current operations.`;
      case '/finance':
        return `Hi ${userName}! I can help analyze your financial performance, suggest cost optimizations, or provide market insights for better decision-making.`;
      default:
        return `Hi ${userName}! I'm your AI farm assistant. I have access to all your farm data and can help with any questions or tasks you have.`;
    }
  };

  const getContextualActions = (): Array<{ label: string; action: () => void }> => {
    const path = location.pathname;
    const actions: Array<{ label: string; action: () => void }> = [];

    switch (path) {
      case '/dashboard':
        actions.push(
          { label: 'Show today\'s priorities', action: () => handleQuickAction('priorities') },
          { label: 'Weather summary', action: () => handleQuickAction('weather') },
          { label: 'Farm performance', action: () => handleQuickAction('performance') }
        );
        break;
      case '/crops':
        actions.push(
          { label: 'Field health analysis', action: () => handleQuickAction('field-health') },
          { label: 'Harvest recommendations', action: () => handleQuickAction('harvest') },
          { label: 'Planting schedule', action: () => handleQuickAction('planting') }
        );
        break;
      case '/cattle':
        actions.push(
          { label: 'Health check alerts', action: () => handleQuickAction('cattle-health') },
          { label: 'Breeding schedule', action: () => handleQuickAction('breeding') },
          { label: 'Feed optimization', action: () => handleQuickAction('feed') }
        );
        break;
      case '/machinery':
        actions.push(
          { label: 'Maintenance due', action: () => handleQuickAction('maintenance') },
          { label: 'Equipment efficiency', action: () => handleQuickAction('efficiency') },
          { label: 'Assignment suggestions', action: () => handleQuickAction('assignments') }
        );
        break;
      case '/finance':
        actions.push(
          { label: 'Profit analysis', action: () => handleQuickAction('profit') },
          { label: 'Market recommendations', action: () => handleQuickAction('market') },
          { label: 'Cost optimization', action: () => handleQuickAction('costs') }
        );
        break;
    }

    return actions;
  };

  const handleQuickAction = (actionType: string) => {
    let response = '';
    
    switch (actionType) {
      case 'priorities':
        response = `Based on your current operations, here are today's priorities:
        
1. **Urgent**: Cattle vaccination due in North Field (15 head)
2. **Important**: Weather alert - Heavy rain expected tomorrow, secure equipment
3. **Routine**: Harvest Field B - optimal moisture content reached
4. **Planning**: Review fertilizer application for South Field next week

Would you like me to create tasks for any of these items?`;
        break;
      case 'weather':
        response = `Current weather summary for your farms:
        
🌡️ **Temperature**: 24°C (feels like 26°C)
🌧️ **Rain**: 40% chance, 5mm expected
💨 **Wind**: 12 km/h from SW
📊 **Humidity**: 68%

**Alerts**: Heavy rain forecast for tomorrow (25mm). Consider:
- Moving cattle to higher ground
- Securing loose equipment
- Postponing field work until Thursday`;
        break;
      case 'field-health':
        response = `Field health analysis across your ${fields.length} fields:
        
🟢 **Excellent** (3 fields): North Field A, South Field C, East Field B
🟡 **Good** (2 fields): West Field A, Central Field
🟠 **Needs attention** (1 field): South Field A - pH levels low, consider lime application

**Recommendations**:
- South Field A: Apply 2 tons lime per hectare
- Monitor East Field B for pest activity (increased this season)
- North Field A ready for harvest in 7-10 days`;
        break;
      case 'maintenance':
        const maintenanceDue = equipment.filter(e => {
          const daysUntil = Math.ceil((new Date(e.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return daysUntil <= 30;
        });
        
        response = `Equipment maintenance summary:
        
**Due within 7 days** (${maintenanceDue.filter(e => {
          const days = Math.ceil((new Date(e.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return days <= 7;
        }).length}):
${maintenanceDue.filter(e => {
  const days = Math.ceil((new Date(e.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  return days <= 7;
}).map(e => `- ${e.name}: ${Math.ceil((new Date(e.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`).join('\n')}

**Due within 30 days** (${maintenanceDue.length}):
${maintenanceDue.map(e => `- ${e.name}: ${Math.ceil((new Date(e.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`).join('\n')}

Would you like me to schedule maintenance appointments?`;
        break;
      case 'market':
        response = `Market analysis and recommendations:
        
**Current Prices** (SAFFEX):
- White Maize: R4,250/ton (+3.03% today) 📈
- Wheat: R6,850/ton (+1.26% today) 📈
- Sunflower: R8,950/ton (+2.52% today) 📈

**AI Recommendations**:
🟢 **SELL** White Maize (85% confidence)
- Price 12% above 6-month average
- Storage costs increasing
- Projected decline in 30-45 days

🟡 **HOLD** Wheat (72% confidence)
- Seasonal demand increasing
- Weather concerns in Western Cape may boost prices

Would you like detailed analysis for any commodity?`;
        break;
      default:
        response = `I'm here to help! What would you like to know about your farm operations?`;
    }

    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      content: response,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, aiMessage]);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    const currentMessage = message;
    setMessage('');
    setIsTyping(true);

    try {
      const context = {
        currentPage: location.pathname,
        farmData: {
          fields,
          cattle,
          equipment,
          user,
        },
        weatherData: {
          temperature: 24,
          description: 'Partly cloudy',
          humidity: 68,
          windSpeed: 12,
        },
        marketData: {
          whiteMaize: 4250,
          wheat: 6850,
          sunflower: 8950,
        },
      };

      const aiResponse = await perplexityService.generateResponse(currentMessage, context);
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const fallbackResponse = generateAIResponse(currentMessage);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        content: fallbackResponse,
        timestamp: new Date(),
      };

      setChatHistory(prev => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('weather')) {
      return `Current weather conditions show 24°C with 40% chance of rain. Tomorrow expects heavy rainfall (25mm). I recommend securing equipment and moving cattle to higher ground. Would you like me to create weather-related tasks?`;
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return `Current market prices: White Maize R4,250/ton (+3.03%), Wheat R6,850/ton (+1.26%). Based on analysis, I recommend selling white maize now (85% confidence) due to above-average pricing. Hold wheat for 30-45 days as seasonal demand increases. Need detailed commodity analysis?`;
    }
    
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('equipment')) {
      const maintenanceDue = equipment.filter(e => {
        const daysUntil = Math.ceil((new Date(e.nextMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntil <= 7;
      });
      
      return `You have ${maintenanceDue.length} pieces of equipment due for maintenance within 7 days. Priority items: ${maintenanceDue.map(e => e.name).join(', ')}. Shall I schedule maintenance appointments or provide detailed service requirements?`;
    }
    
    if (lowerMessage.includes('cattle') || lowerMessage.includes('livestock')) {
      return `Your cattle herd status: ${cattle.length} head total, ${cattle.filter(c => c.healthStatus === 'healthy').length} healthy. Upcoming: 15 head due for vaccination in North Field, breeding season starts in 3 weeks. Any specific cattle management questions?`;
    }
    
    if (lowerMessage.includes('crop') || lowerMessage.includes('field') || lowerMessage.includes('harvest')) {
      return `Field analysis: ${fields.length} fields monitored. North Field A ready for harvest (optimal moisture), South Field A needs lime application (low pH). East Field B showing excellent growth. Which field would you like detailed analysis for?`;
    }
    
    return `I understand you're asking about "${userMessage}". Based on your current farm data, I can provide specific insights. Could you be more specific about what aspect you'd like me to analyze? I have access to all your farm operations, weather data, market prices, and equipment status.`;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          width: 60,
          height: 60,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: hasUnreadSuggestions ? 'pulse 2s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 0 0 0 rgba(46, 125, 50, 0.7)',
            },
            '70%': {
              boxShadow: '0 0 0 10px rgba(46, 125, 50, 0)',
            },
            '100%': {
              boxShadow: '0 0 0 0 rgba(46, 125, 50, 0)',
            },
          },
        }}
        onClick={() => setOpen(true)}
      >
        <Badge
          badgeContent={hasUnreadSuggestions ? '!' : 0}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.75rem',
              minWidth: '16px',
              height: '16px',
            },
          }}
        >
          <SmartToy sx={{ fontSize: '1.5rem' }} />
        </Badge>
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            position: 'fixed',
            bottom: minimized ? -540 : 100,
            right: 24,
            top: 'auto',
            left: 'auto',
            width: 400,
            height: minimized ? 60 : 600,
            maxWidth: 'none',
            maxHeight: 'none',
            margin: 0,
            borderRadius: 3,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
          },
        }}
        BackdropProps={{
          sx: { backgroundColor: 'transparent' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: minimized ? 'none' : '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
            color: 'white',
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              <SmartToy />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Farm AI Assistant
            </Typography>
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={() => setMinimized(!minimized)}
              sx={{ color: 'white', mr: 1 }}
            >
              {minimized ? <KeyboardArrowUp /> : <Minimize />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: 'white' }}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        {!minimized && (
          <DialogContent sx={{ p: 0, height: 'calc(100% - 120px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {chatHistory.map((msg) => (
                <Box
                  key={msg.id}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      display: 'flex',
                      flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                      gap: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'secondary.main',
                      }}
                    >
                      {msg.sender === 'user' ? <Person /> : <SmartToy />}
                    </Avatar>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.100',
                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {msg.content}
                      </Typography>
                      {msg.actions && msg.actions.length > 0 && (
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {msg.actions.map((action, index) => (
                            <Button
                              key={index}
                              size="small"
                              variant="outlined"
                              onClick={action.action}
                              sx={{ fontSize: '0.75rem' }}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </Box>
              ))}
              
              {isTyping && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', mr: 1 }}>
                    <SmartToy />
                  </Avatar>
                  <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                    <Typography variant="body2" color="text.secondary">
                      AI is typing...
                    </Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ask me anything about your farm..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  multiline
                  maxRows={3}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default FloatingAIAssistant;
