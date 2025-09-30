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

  const isOwner = user?.role === 'owner';
  const canViewDashboards = isOwner;
  const canSubmitInvoices = ['owner', 'manager', 'staff'].includes(user?.role || '');
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    description: '',
    amount: 0,
    type: 'income' as 'income' | 'expense',
    category: 'crops' as 'crops' | 'cattle',
    farm: '',
    date: new Date().toISOString().split('T')[0]
  });

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
    a.href = url;
    const filterSuffix = farmFilter ? `-${farmFilter}` : '';
    const categorySuffix = categoryFilter ? `-${categoryFilter}` : '';
    a.download = `farm-financial-report-${period}${filterSuffix}${categorySuffix}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (user?.role !== 'owner') {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Finance - Submit Receipts
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Submit Invoice/Receipt
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload invoices and receipts for your assigned farms.
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              Upload Receipt
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
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
          Finance Dashboard
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={() => handleExportReport('MTD')}
            >
              Export MTD
            </Button>
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={() => handleExportReport('YTD')}
            >
              Export YTD
            </Button>
          </Box>
          <Button variant="contained" startIcon={<Add />} onClick={() => setAddTransactionOpen(true)}>
            Add Transaction
          </Button>
        </Box>
      </Box>

      {canViewDashboards ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card sx={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.4)',
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }} gutterBottom>
                  Monthly Revenue
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  R{monthlyRevenue.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }} gutterBottom>
                Monthly Expenses
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                R{monthlyExpenses.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{
            background: (monthlyRevenue - monthlyExpenses) >= 0 
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: (monthlyRevenue - monthlyExpenses) >= 0 
              ? '0 8px 32px rgba(59, 130, 246, 0.3)'
              : '0 8px 32px rgba(239, 68, 68, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: (monthlyRevenue - monthlyExpenses) >= 0 
                ? '0 20px 40px rgba(59, 130, 246, 0.4)'
                : '0 20px 40px rgba(239, 68, 68, 0.4)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }} gutterBottom>
                Net Profit
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                R{(monthlyRevenue - monthlyExpenses).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
          <Card sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.5px' }} gutterBottom>
                VAT Owed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                R{vatAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          </Box>
        </Box>
      ) : (
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Access Restricted
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Financial dashboards and detailed data are only available to users with Owner role.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {canSubmitInvoices ? 'You can submit invoices and receipts for your assigned farms.' : 'Contact your administrator for access.'}
            </Typography>
            {canSubmitInvoices && (
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" startIcon={<Add />}>
                  Submit Invoice/Receipt
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* MTD/YTD Section */}
      {canViewDashboards && (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Month-to-Date Performance
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 150px', textAlign: 'center', p: 1 }}>
                  <Typography variant="h5" color="success.main">
                    R{(monthlyRevenue * 0.7).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MTD Revenue
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 150px', textAlign: 'center', p: 1 }}>
                  <Typography variant="h5" color="error.main">
                    R{(monthlyExpenses * 0.65).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MTD Expenses
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 150px', textAlign: 'center', p: 1 }}>
                  <Typography variant="h5" color="primary.main">
                    R{((monthlyRevenue * 0.7) - (monthlyExpenses * 0.65)).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MTD Profit
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <CalendarToday sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Year-to-Date Performance
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 150px', textAlign: 'center', p: 1 }}>
                  <Typography variant="h5" color="success.main">
                    R{(monthlyRevenue * 8.5).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    YTD Revenue
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 150px', textAlign: 'center', p: 1 }}>
                  <Typography variant="h5" color="error.main">
                    R{(monthlyExpenses * 8.2).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    YTD Expenses
                  </Typography>
                </Box>
                <Box sx={{ flex: '1 1 150px', textAlign: 'center', p: 1 }}>
                  <Typography variant="h5" color="primary.main">
                    R{((monthlyRevenue * 8.5) - (monthlyExpenses * 8.2)).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    YTD Profit
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
      )}

      {/* AI Recommendations Section */}
      {canViewDashboards && (
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SmartToy sx={{ mr: 1 }} />
              <Typography variant="h6">
                AI Financial Recommendations
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  VAT Optimization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consider purchasing R{(vatAmount * 0.6).toLocaleString()} worth of equipment this month to optimize VAT claims and reduce tax liability by approximately R{(vatAmount * 0.09).toLocaleString()}.
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 300px', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Cash Flow Optimization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on seasonal patterns, consider selling R{(monthlyRevenue * 0.3).toLocaleString()} worth of grain inventory before month-end to improve cash flow and reduce storage costs.
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

      {canViewDashboards && (
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
                            {transaction.type === 'income' ? '+' : '-'}R{transaction.amount.toLocaleString()}
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
              label="Amount (ZAR)"
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
