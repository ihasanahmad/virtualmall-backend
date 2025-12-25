import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Login = () => {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register({ name, email, password });
            navigate('/register-brand');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: '#d4af37',
                            borderRadius: '50%',
                            padding: 2,
                            marginBottom: 2
                        }}
                    >
                        <StorefrontIcon sx={{ fontSize: 40, color: '#1a1a1a' }} />
                    </Box>

                    <Typography component="h1" variant="h4" sx={{ mb: 1, color: '#d4af37', fontWeight: 'bold' }}>
                        VENDOR PORTAL
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#999', textAlign: 'center' }}>
                        Manage your brand & products on Virtual Mega Mall
                    </Typography>

                    <Tabs
                        value={tab}
                        onChange={(e, newValue) => setTab(newValue)}
                        sx={{
                            mb: 3,
                            '& .MuiTab-root': { color: '#999' },
                            '& .Mui-selected': { color: '#d4af37' },
                            '& .MuiTabs-indicator': { backgroundColor: '#d4af37' }
                        }}
                    >
                        <Tab label="Login" />
                        <Tab label="Register" />
                    </Tabs>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {tab === 0 ? (
                        <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#d4af37' },
                                        '&:hover fieldset': { borderColor: '#d4af37' },
                                        '&.Mui-focused fieldset': { borderColor: '#d4af37' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#d4af37' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#d4af37' },
                                        '&:hover fieldset': { borderColor: '#d4af37' },
                                        '&.Mui-focused fieldset': { borderColor: '#d4af37' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#d4af37' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' }
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    backgroundColor: '#d4af37',
                                    color: '#1a1a1a',
                                    fontWeight: 'bold',
                                    '&:hover': { backgroundColor: '#c19b2a' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#d4af37' },
                                        '&:hover fieldset': { borderColor: '#d4af37' },
                                        '&.Mui-focused fieldset': { borderColor: '#d4af37' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#d4af37' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email Address"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#d4af37' },
                                        '&:hover fieldset': { borderColor: '#d4af37' },
                                        '&.Mui-focused fieldset': { borderColor: '#d4af37' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#d4af37' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': { borderColor: '#d4af37' },
                                        '&:hover fieldset': { borderColor: '#d4af37' },
                                        '&.Mui-focused fieldset': { borderColor: '#d4af37' }
                                    },
                                    '& .MuiInputLabel-root': { color: '#d4af37' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#d4af37' }
                                }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    backgroundColor: '#d4af37',
                                    color: '#1a1a1a',
                                    fontWeight: 'bold',
                                    '&:hover': { backgroundColor: '#c19b2a' }
                                }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Create Account'}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
