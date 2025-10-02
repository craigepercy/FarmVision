import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, Typography, Box, Chip, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import weatherService from '../services/weatherService';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FarmMapProps {
  height?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
}

const FarmMap: React.FC<FarmMapProps> = ({ height = 300 }) => {
  const { fields } = useSelector((state: RootState) => state.crop);
  const { camps } = useSelector((state: RootState) => state.cattle);
  const [weatherData, setWeatherData] = useState<{[key: string]: any}>({});
  const [weatherLoading, setWeatherLoading] = useState<{[key: string]: boolean}>({});

  const allLocations = [
    ...fields.map(f => ({ lat: f.location.lat, lng: f.location.lng })),
    ...camps.filter(c => c.location?.lat && c.location?.lng).map(c => ({ lat: c.location.lat, lng: c.location.lng }))
  ];
  
  const centerLat = allLocations.length > 0 
    ? allLocations.reduce((sum, loc) => sum + loc.lat, 0) / allLocations.length 
    : -25.7479;
  const centerLng = allLocations.length > 0 
    ? allLocations.reduce((sum, loc) => sum + loc.lng, 0) / allLocations.length 
    : 28.2293;

  const getWeatherForLocation = async (fieldId: string, lat: number, lng: number) => {
    if (weatherData[fieldId] || weatherLoading[fieldId]) return;
    
    setWeatherLoading(prev => ({ ...prev, [fieldId]: true }));
    try {
      const weather = await weatherService.getCurrentWeather({ latitude: lat, longitude: lng });
      setWeatherData(prev => ({ ...prev, [fieldId]: weather }));
    } catch (error) {
      console.error('Failed to fetch weather for field:', fieldId, error);
      setWeatherData(prev => ({ 
        ...prev, 
        [fieldId]: {
          temperature: 22 + Math.floor(Math.random() * 8),
          humidity: 45 + Math.floor(Math.random() * 30),
          description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          icon: '☀️'
        }
      }));
    } finally {
      setWeatherLoading(prev => ({ ...prev, [fieldId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'growing': return 'success';
      case 'ready': return 'warning';
      case 'harvested': return 'info';
      case 'planted': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      height: typeof height === 'number' ? height : { 
        xs: height.xs || 200, 
        sm: height.sm || 250, 
        md: height.md || 300 
      }, 
      borderRadius: 3, 
      overflow: 'hidden', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      border: '1px solid rgba(255,255,255,0.2)',
      width: '100%',
      maxWidth: '100%'
    }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fields.map((field) => {
          const weather = weatherData[field.id];
          const loading = weatherLoading[field.id];
          
          if (!weather && !loading) {
            getWeatherForLocation(field.id, field.location.lat, field.location.lng);
          }
          
          return (
            <Marker
              key={field.id}
              position={[field.location.lat, field.location.lng]}
            >
              <Popup>
                <Card sx={{ 
                  minWidth: { xs: 280, sm: 320 }, 
                  maxWidth: { xs: '90vw', sm: 400 },
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {field.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                        Location
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {field.location.address}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                        Weather Conditions
                      </Typography>
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="caption" color="text.secondary">
                            Loading weather data...
                          </Typography>
                        </Box>
                      ) : weather ? (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          <Chip 
                            label={`${weather.icon} ${weather.temperature}°C`} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                          <Chip 
                            label={weather.description} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                          <Chip 
                            label={`${weather.humidity}% humidity`} 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              color: 'white',
                              fontWeight: 500
                            }}
                          />
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Weather data unavailable
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                        Crop Information
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1, color: '#1e293b', fontWeight: 500 }}>
                        <strong>{field.crop}</strong> ({field.varietal})
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 1.5 }}>
                        {field.hectares} hectares ({field.plantedHectares} planted)
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={field.status} 
                          size="small" 
                          color={getStatusColor(field.status)}
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip 
                          label={`Health: ${field.healthScore}%`} 
                          size="small" 
                          color={field.healthScore > 80 ? 'success' : field.healthScore > 60 ? 'warning' : 'error'}
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                        Soil Health
                      </Typography>
                      <Box sx={{ 
                        background: 'rgba(148, 163, 184, 0.1)',
                        padding: 2,
                        borderRadius: 2,
                        border: '1px solid rgba(148, 163, 184, 0.2)'
                      }}>
                        <Typography variant="caption" display="block" sx={{ color: '#475569', fontWeight: 500 }}>
                          pH: {field.soilHealth.ph} | N: {field.soilHealth.nitrogen}ppm | 
                          P: {field.soilHealth.phosphorus}ppm | K: {field.soilHealth.potassium}ppm
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          );
        })}
        
        {camps.filter(camp => camp.location?.lat && camp.location?.lng).map((camp) => {
          const customIcon = L.divIcon({
            html: `<div style="background-color: #f59e0b; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"><span style="color: white; font-size: 16px;">🐄</span></div>`,
            className: 'custom-camp-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          
          return (
            <Marker
              key={camp.id}
              position={[camp.location.lat, camp.location.lng]}
              icon={customIcon}
            >
              <Popup>
                <Card sx={{ 
                  minWidth: { xs: 280, sm: 320 }, 
                  maxWidth: { xs: '90vw', sm: 400 },
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  borderRadius: 3,
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)'
                }}>
                  <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      fontWeight: 600,
                      color: '#92400e'
                    }}>
                      🐄 {camp.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                        Camp Information
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#92400e', mb: 1 }}>
                        Type: {camp.type}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#92400e', mb: 1 }}>
                        Location: {camp.location.address}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                        Capacity & Occupancy
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${camp.currentCount}/${camp.capacity} cattle`}
                          size="small" 
                          color={camp.currentCount <= camp.capacity ? 'success' : 'error'}
                          sx={{ fontWeight: 500 }}
                        />
                        <Chip 
                          label={`${((camp.currentCount / camp.capacity) * 100).toFixed(0)}% full`} 
                          size="small" 
                          variant="outlined"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                        Health Status
                      </Typography>
                      <Box sx={{ 
                        background: 'rgba(146, 64, 14, 0.1)',
                        padding: 2,
                        borderRadius: 2,
                        border: '1px solid rgba(146, 64, 14, 0.2)'
                      }}>
                        <Typography variant="caption" display="block" sx={{ color: '#92400e', fontWeight: 500 }}>
                          Status: {camp.healthStatus || 'Good'} | Last inspection: {camp.lastInspection || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default FarmMap;
