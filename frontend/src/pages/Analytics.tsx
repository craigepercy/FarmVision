import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Timeline, TrendingUp, Assessment, Science } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Analytics: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.analytics);
  const [selectedScenario, setSelectedScenario] = React.useState('');
  const [selectedSegment, setSelectedSegment] = React.useState('all');
  const [selectedFarm, setSelectedFarm] = React.useState('');
  const [selectedVarietal, setSelectedVarietal] = React.useState('');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Analytics &amp; Scenario Simulator
        </Typography>
        <Box>
          <FormControl sx={{ mr: 2, minWidth: 150 }}>
            <InputLabel>Segment</InputLabel>
            <Select
              value={selectedSegment}
              label="Segment"
              onChange={(e) => setSelectedSegment(e.target.value)}
            >
              <MenuItem value="all">All Operations</MenuItem>
              <MenuItem value="crops">Crops</MenuItem>
              <MenuItem value="cattle">Cattle</MenuItem>
            </Select>
          </FormControl>
          {selectedSegment !== 'all' && (
            <FormControl sx={{ mr: 2, minWidth: 150 }}>
              <InputLabel>Farm</InputLabel>
              <Select
                value={selectedFarm}
                label="Farm"
                onChange={(e) => setSelectedFarm(e.target.value)}
              >
                <MenuItem value="">All Farms</MenuItem>
                <MenuItem value="north">North Farm</MenuItem>
                <MenuItem value="south">South Farm</MenuItem>
                <MenuItem value="east">East Farm</MenuItem>
              </Select>
            </FormControl>
          )}
          {selectedFarm && (
            <FormControl sx={{ mr: 2, minWidth: 150 }}>
              <InputLabel>Varietal</InputLabel>
              <Select
                value={selectedVarietal}
                label="Varietal"
                onChange={(e) => setSelectedVarietal(e.target.value)}
              >
                <MenuItem value="">All Varietals</MenuItem>
                {selectedSegment === 'crops' ? (
                  <>
                    <MenuItem value="maize">Maize</MenuItem>
                    <MenuItem value="wheat">Wheat</MenuItem>
                    <MenuItem value="soybeans">Soybeans</MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem value="angus">Angus</MenuItem>
                    <MenuItem value="hereford">Hereford</MenuItem>
                    <MenuItem value="brahman">Brahman</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          )}
          <FormControl sx={{ mr: 2, minWidth: 200 }}>
            <InputLabel>Scenario</InputLabel>
            <Select
              value={selectedScenario}
              label="Scenario"
              onChange={(e) => setSelectedScenario(e.target.value)}
            >
              <MenuItem value="drought">Drought Impact</MenuItem>
              <MenuItem value="expansion">Farm Expansion</MenuItem>
              <MenuItem value="market-change">Market Price Change</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<Science />}>
            Run Simulation
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Timeline sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Production Trends
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.productionTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Profitability by Category
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.profitability}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="profit"
                    label={({ category, profit }) => `${category}: R${profit.toLocaleString()}`}
                  >
                    {data.profitability.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weather Impact Analysis
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="temperature" fill="#ff7300" />
                  <Bar dataKey="rainfall" fill="#387908" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Science sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Scenario Simulation Results
                </Typography>
              </Box>
              {selectedScenario ? (
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Scenario: {selectedScenario}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Simulation results and impact analysis will be displayed here based on the selected scenario.
                    This includes projected changes in yield, revenue, and resource requirements.
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select a scenario above to run simulations and view projected outcomes.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <Assessment sx={{ mr: 1 }} />
              <Typography variant="h6">
                Key Performance Indicators
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px', textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main">
                  92%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Crop Health Score
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px', textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary.main">
                  15%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yield Increase YoY
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px', textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="warning.main">
                  R2.1M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Projected Annual Revenue
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px', textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="error.main">
                  8%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resource Efficiency Gain
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Analytics;
