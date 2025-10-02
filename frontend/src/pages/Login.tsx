import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (email && password) {
        const mockUser = {
          id: '1',
          email,
          name: 'Farm Owner',
          role: 'owner' as const,
        };
        
        dispatch(loginSuccess({
          user: mockUser,
          token: 'mock-jwt-token',
        }));
        
        navigate('/dashboard');
      } else {
        setError('Please enter both email and password');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #81C784 100%)',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        p: 2,
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          width: '100%',
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{ 
              mb: 1, 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FarmVision
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Intelligent Farm Management, Simplified
          </Typography>
        </Box>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'primary.main',
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'primary.main',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2, 
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
              boxShadow: '0 4px 16px rgba(46, 125, 50, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: 'rgba(46, 125, 50, 0.3)',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
            <Box textAlign="center">
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
