import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
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
                        <LockOutlinedIcon sx={{ fontSize: 40, color: '#1a1a1a' }} />
                    </Box>

                    <Typography component="h1" variant="h4" sx={{ mb: 1, color: '#d4af37', fontWeight: 'bold' }}>
                        VIRTUAL MEGA MALL
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 3, color: '#fff' }}>
                        Admin Panel
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
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
                                '&:hover': {
                                    backgroundColor: '#c19b2a'
                                },
                                '&:disabled': {
                                    backgroundColor: '#ccc'
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Sign In'}
                        </Button>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 2, color: '#999', textAlign: 'center' }}>
                        Admin access only. Unauthorized access is prohibited.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
