import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Collapse
} from '@mui/material';
import {
  Refresh,
  ExpandMore,
  ExpandLess,
  LocationOn,
  Thermostat,
  Water,
  Air
} from '@mui/icons-material';
import weatherService from '../services/weatherService';

interface WeatherWidgetProps {
  coordinates?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  showForecast?: boolean;
  showInsights?: boolean;
  compact?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  coordinates,
  showForecast = true,
  showInsights = true,
  compact = false
}) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(!compact);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (showInsights) {
        const data = await weatherService.getFarmingWeatherInsights(coordinates);
        setWeatherData(data);
      } else {
        const [current, forecast] = await Promise.all([
          weatherService.getCurrentWeather(coordinates),
          showForecast ? weatherService.getWeatherForecast(coordinates, 7) : null
        ]);
        setWeatherData({ current, forecast: forecast?.forecast || [] });
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [coordinates, showForecast, showInsights]);

  const handleRefresh = () => {
    fetchWeatherData();
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  if (loading) {
    return (
      <Card sx={{ minHeight: compact ? 120 : 200 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <CircularProgress size={40} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Loading weather data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ minHeight: compact ? 120 : 200 }}>
        <CardContent>
          <Alert 
            severity="error" 
            action={
              <IconButton size="small" onClick={handleRefresh}>
                <Refresh />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!weatherData) return null;

  const { current, forecast, alerts, insights } = weatherData;

  return (
    <Card sx={{ 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      border: '1px solid rgba(25, 118, 210, 0.12)'
    }}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {current.location}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!compact && (
              <Tooltip title="Refresh weather data">
                <IconButton size="small" onClick={handleRefresh} disabled={loading}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            )}
            {compact && (
              <IconButton size="small" onClick={toggleExpanded}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Current Weather */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h2" sx={{ fontSize: '3rem', fontWeight: 300, mr: 2 }}>
            {current.icon}
          </Typography>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 600, lineHeight: 1 }}>
              {current.temperature}°C
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {current.description}
            </Typography>
          </Box>
        </Box>

        {/* Weather Details */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: '120px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Water sx={{ mr: 1, color: 'info.main', fontSize: '1.2rem' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Humidity
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {current.humidity}%
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: '120px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Air sx={{ mr: 1, color: 'success.main', fontSize: '1.2rem' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Wind
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {current.windSpeed} km/h
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: '120px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Thermostat sx={{ mr: 1, color: 'warning.main', fontSize: '1.2rem' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Feels like
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {current.temperature}°C
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Alerts */}
        {alerts && alerts.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {alerts.map((alert: any, index: number) => (
              <Alert 
                key={index}
                severity={alert.type}
                sx={{ mb: 1, fontSize: '0.875rem' }}
                icon={<span style={{ fontSize: '1.2rem' }}>{alert.icon}</span>}
              >
                {alert.message}
              </Alert>
            ))}
          </Box>
        )}

        {/* Expandable Content */}
        <Collapse in={expanded}>
          {/* Forecast */}
          {showForecast && forecast && forecast.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                7-Day Forecast
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { 
                  xs: 'repeat(3, 1fr)', 
                  sm: 'repeat(4, 1fr)', 
                  md: 'repeat(7, 1fr)' 
                },
                gap: 1,
                width: '100%'
              }}>
                {forecast.slice(0, 7).map((day: any, index: number) => (
                  <Box 
                    key={index}
                    sx={{ 
                      textAlign: 'center', 
                      p: 1, 
                      borderRadius: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {day.date}
                    </Typography>
                    <Typography variant="h6" sx={{ fontSize: '1.5rem', my: 0.5 }}>
                      {day.icon}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {day.maxTemp}°
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {day.minTemp}°
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Insights */}
          {insights && insights.length > 0 && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Farming Insights
              </Typography>
              {insights.map((insight: any, index: number) => (
                <Chip
                  key={index}
                  label={insight.message}
                  icon={<span style={{ fontSize: '1rem' }}>{insight.icon}</span>}
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          )}
        </Collapse>

        {/* Last Updated */}
        {lastUpdated && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
            Last updated: {lastUpdated.toLocaleTimeString('en-ZA')}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
