import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add, GetApp, SmartToy, CalendarToday } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTransaction } from '../store/slices/financeSlice';

const Finance: React.FC = () => {
  const { transactions, monthlyRevenue, monthlyExpenses, vatAmount } = useSelector((state: RootState) => state.finance);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    description: '',
    amount: 0,
    type: 'income' as 'income' | 'expense',
    category: 'crops' as 'crops' | 'cattle',
    farm: '',
    date: new Date().toISOString().split('T')[0]
  });

  const isOwner = user?.role === 'owner';
  const canViewDashboards = isOwner;
  const canSubmitInvoices = ['owner', 'manager', 'staff'].includes(user?.role || '');

  const handleAddTransaction = () => {
    const newTransaction = {
      id: `trans${Date.now()}`,
      ...transactionForm,
      amount: transactionForm.type === 'expense' ? -Math.abs(transactionForm.amount) : Math.abs(transactionForm.amount),
      date: transactionForm.date,
      status: 'completed'
    };
    dispatch(addTransaction(newTransaction));
    setAddTransactionOpen(false);
    setTransactionForm({
      description: '',
      amount: 0,
      type: 'income',
      category: 'crops',
      farm: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleExportReport = (period: 'MTD' | 'YTD' = 'MTD', farmFilter?: string, categoryFilter?: 'crops' | 'cattle') => {
    const now = new Date();
    const startDate = period === 'MTD' 
      ? new Date(now.getFullYear(), now.getMonth(), 1)
      : new Date(now.getFullYear(), 0, 1);
    
    let filteredTransactions = transactions.filter(t => new Date(t.date) >= startDate);
    
    if (farmFilter) {
      filteredTransactions = filteredTransactions.filter(t => t.farm === farmFilter);
    }
    
    if (categoryFilter) {
      filteredTransactions = filteredTransactions.filter(t => t.category === categoryFilter);
    }

    const csvData = filteredTransactions.map(t => ({
      Date: new Date(t.date).toLocaleDateString(),
      Description: t.description,
      Amount: `R${Math.abs(t.amount).toLocaleString()}`,
      Type: t.amount > 0 ? 'Income' : 'Expense',
      Category: t.category || 'General',
      Farm: t.farm || 'All Farms',
      Status: t.status || 'Completed'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `finance_report_${period}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const chartData = [
    { month: 'Jan', revenue: 85000, expenses: 65000 },
    { month: 'Feb', revenue: 92000, expenses: 68000 },
    { month: 'Mar', revenue: 78000, expenses: 72000 },
    { month: 'Apr', revenue: 105000, expenses: 75000 },
    { month: 'May', revenue: 98000, expenses: 71000 },
    { month: 'Jun', revenue: 112000, expenses: 78000 }
  ];

  const vatData = [
    { name: 'Input VAT', value: 12500, color: '#4caf50' },
    { name: 'Output VAT', value: 18750, color: '#2196f3' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Finance Dashboard
      </Typography>

      {/* Summary Cards */}
      {canViewDashboards && (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Card sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Monthly Revenue
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  R{monthlyRevenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="success.main">
                  +12.5% from last month
                </Typography>
              </Box>
              <CalendarToday sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Monthly Expenses
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  R{monthlyExpenses.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="error.main">
                  +8.3% from last month
                </Typography>
              </Box>
              <CalendarToday sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Net Profit
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  R{(monthlyRevenue - monthlyExpenses).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  +18.7% from last month
                </Typography>
              </Box>
              <CalendarToday sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  VAT Amount
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  R{vatAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="warning.main">
                  Due in 15 days
                </Typography>
              </Box>
              <CalendarToday sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
            </Box>
          </CardContent>
        </Card>
      </Box>
      )}

      {/* Export Buttons */}
      {canSubmitInvoices && (
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Export Reports
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => handleExportReport('MTD')}
                size="small"
              >
                MTD Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => handleExportReport('YTD')}
                size="small"
              >
                YTD Report
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => handleExportReport('MTD', undefined, 'crops')}
                size="small"
              >
                Crops MTD
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => handleExportReport('MTD', undefined, 'cattle')}
                size="small"
              >
                Cattle MTD
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => handleExportReport('YTD', undefined, 'crops')}
                size="small"
              >
                Crops YTD
              </Button>
              <Button
                variant="outlined"
                startIcon={<GetApp />}
                onClick={() => handleExportReport('YTD', undefined, 'cattle')}
                size="small"
              >
                Cattle YTD
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
      )}

      {/* AI Financial Recommendations */}
      {canViewDashboards && (
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SmartToy sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">
                AI Financial Recommendations
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Cash Flow Optimization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consider delaying equipment purchases by 30 days to improve cash flow. Current liquidity ratio suggests maintaining R{(monthlyRevenue * 0.15).toLocaleString()} in reserves.
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  VAT Planning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Optimal timing for large purchases: next 2 weeks. This will maximize VAT input claims and reduce next quarter's liability by approximately R{(vatAmount * 0.12).toLocaleString()}.
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Investment Opportunity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current profit margins suggest investing in precision agriculture technology could increase yields by 12-15% and reduce input costs by R{(monthlyExpenses * 0.08).toLocaleString()} monthly.
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      )}

      {/* SAFFEX Market Integration */}
      {canViewDashboards && (
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SmartToy sx={{ mr: 1 }} />
              <Typography variant="h6">
                SAFFEX Market Data & AI Recommendations
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  🌽 White Maize - SELL (85% confidence)
                </Typography>
                <Typography variant="h6" color="success.dark">
                  R4,250/ton (+3.03% today)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Price 12% above 6-month average. Storage costs increasing. Projected decline in 30-45 days.
                </Typography>
                <Button variant="contained" size="small" sx={{ mt: 1 }}>
                  Create Sale Order
                </Button>
              </Box>
              <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  🌾 Wheat - HOLD (72% confidence)
                </Typography>
                <Typography variant="h6" color="warning.dark">
                  R6,850/ton (+1.26% today)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Seasonal demand increasing. Weather concerns in Western Cape may boost prices 8-12% in 30-60 days.
                </Typography>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                  Monitor Price
                </Button>
              </Box>
              <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  🌻 Sunflower - SELL (78% confidence)
                </Typography>
                <Typography variant="h6" color="info.dark">
                  R8,950/ton (+2.52% today)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Strong upward trend. International demand high. Optimal selling window for next 2-3 weeks.
                </Typography>
                <Button variant="contained" size="small" sx={{ mt: 1 }}>
                  Create Sale Order
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      )}

      {/* Crop Storage Management */}
      {canViewDashboards && (
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Crop Storage Management
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Silage Inventory
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">Maize Silage</Typography>
                    <Chip label="850 tons" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">Lucerne Silage</Typography>
                    <Chip label="320 tons" color="warning" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">Grass Silage</Typography>
                    <Chip label="180 tons" color="error" size="small" />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Stored Crops
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">White Maize (Grade 1)</Typography>
                    <Chip label="1,250 tons" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">Wheat (Grade 1)</Typography>
                    <Chip label="680 tons" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">Sunflower</Typography>
                    <Chip label="420 tons" color="warning" size="small" />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ flex: '1 1 250px' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Storage Facilities
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">Silo A</Typography>
                    <Chip label="85% Full" color="warning" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">Silo B</Typography>
                    <Chip label="62% Full" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">Bunker Storage</Typography>
                    <Chip label="45% Full" color="success" size="small" />
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      )}

      {/* Financial Trends Chart */}
      {canViewDashboards && (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
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
                    label={({ name, value }) => `${name}: R${value.toLocaleString()}`}
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
      )}

      {/* Transaction History */}
      {canViewDashboards && (
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Recent Transactions
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setAddTransactionOpen(true)}
              >
                Add Transaction
              </Button>
            </Box>
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
                          {transaction.type === 'income' ? '+' : '-'}R{Math.abs(transaction.amount).toLocaleString()}
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
      )}

      {/* Add Transaction Dialog */}
      <Dialog open={addTransactionOpen} onClose={() => setAddTransactionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Description"
              value={transactionForm.description}
              onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
              fullWidth
            />
            <TextField
              label="Amount (R)"
              type="number"
              value={transactionForm.amount}
              onChange={(e) => setTransactionForm({ ...transactionForm, amount: parseFloat(e.target.value) || 0 })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={transactionForm.type}
                onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value as 'income' | 'expense' })}
              >
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={transactionForm.category}
                onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value as 'crops' | 'cattle' })}
              >
                <MenuItem value="crops">Crops</MenuItem>
                <MenuItem value="cattle">Cattle</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Farm"
              value={transactionForm.farm}
              onChange={(e) => setTransactionForm({ ...transactionForm, farm: e.target.value })}
              fullWidth
            />
            <TextField
              label="Date"
              type="date"
              value={transactionForm.date}
              onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddTransactionOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTransaction} variant="contained">Add Transaction</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Finance;
