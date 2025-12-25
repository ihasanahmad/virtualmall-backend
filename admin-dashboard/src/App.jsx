import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BrandApprovals from './pages/BrandApprovals';

// Create dark theme matching the Virtual Mega Mall brand
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4af37', // Gold
    },
    secondary: {
      main: '#2d2d2d',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#999999',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="brands/approvals" element={<BrandApprovals />} />
              <Route path="brands" element={<div style={{ color: '#fff' }}>Manage Brands (Coming Soon)</div>} />
              <Route path="categories" element={<div style={{ color: '#fff' }}>Categories (Coming Soon)</div>} />
              <Route path="users" element={<div style={{ color: '#fff' }}>Users (Coming Soon)</div>} />
              <Route path="analytics" element={<div style={{ color: '#fff' }}>Analytics (Coming Soon)</div>} />
              <Route path="settings" element={<div style={{ color: '#fff' }}>Settings (Coming Soon)</div>} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
