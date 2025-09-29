import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import { Add, GetApp, TrendingUp, TrendingDown } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Finance: React.FC = () => {
  const { transactions, monthlyRevenue, monthlyExpenses, vatAmount } = useSelector((state: RootState) => state.finance);

  const mockChartData = [
    { month: 'Jan', revenue: 85000, expenses: 65000 },
    { month: 'Feb', revenue: 92000, expenses: 68000 },
    { month: 'Mar', revenue: 78000, expenses: 72000 },
    { month: 'Apr', revenue: 105000, expenses: 75000 },
    { month: 'May', revenue: 125000, expenses: 85000 },
    { month: 'Jun', revenue: 135000, expenses: 88000 },
  ];

  const vatData = [
    { name: 'VAT Owed', value: vatAmount, color: '#ff6b6b' },
    { name: 'Net Income', value: monthlyRevenue - monthlyExpenses - vatAmount, color: '#4ecdc4' },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Finance Dashboard
        </Typography>
        <Box>
          <Button variant="outlined" startIcon={<GetApp />} sx={{ mr: 1 }}>
            Export Report
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            Add Transaction
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    ${monthlyRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Monthly Expenses
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    ${monthlyExpenses.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingDown color="error" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Net Profit
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    ${(monthlyRevenue - monthlyExpenses).toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    VAT Owed
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    ${vatAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ color: 'warning.main' }}>
                  <Typography variant="h3">%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#f44336" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                VAT Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vatData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                  >
                    {vatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type}
                            color={transaction.type === 'income' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                            fontWeight="bold"
                          >
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
};

export default Finance;
