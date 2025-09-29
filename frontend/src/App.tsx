import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CropManagement from './pages/CropManagement';
import CattleManagement from './pages/CattleManagement';
import StaffTasks from './pages/StaffTasks';
import Finance from './pages/Finance';
import Machinery from './pages/Machinery';
import Analytics from './pages/Analytics';
import AIAssistant from './pages/AIAssistant';
import AuditTrail from './pages/AuditTrail';
import Notifications from './pages/Notifications';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/crops"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CropManagement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cattle"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <CattleManagement />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <StaffTasks />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/finance"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Finance />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/machinery"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Machinery />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AIAssistant />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AuditTrail />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Notifications />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/unauthorized"
              element={
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h1>Unauthorized</h1>
                  <p>You don't have permission to access this page.</p>
                </div>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
