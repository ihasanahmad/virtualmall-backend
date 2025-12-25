import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { vendorAnalyticsService } from '../services/api';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    ShoppingCart,
    AttachMoney,
    Inventory,
    Star,
    PendingActions
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon, color }) => (
    <Card
        sx={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            border: `1px solid ${color}`,
            boxShadow: `0 4px 20px rgba(${color === '#d4af37' ? '212, 175, 55' : '255, 255, 255'}, 0.1)`
        }}
    >
        <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="body2" sx={{ color: '#999', mb: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        backgroundColor: `${color}20`,
                        borderRadius: 2,
                        p: 2
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const VendorDashboard = () => {
    const { brand } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await vendorAnalyticsService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    if (!brand) {
        return (
            <Alert severity="info">
                Please complete brand registration to access the dashboard.
            </Alert>
        );
    }

    if (brand.status === 'pending') {
        return (
            <Box>
                <Alert severity="warning" sx={{ mb: 3 }}>
                    Your brand application is pending approval. You'll be notified once it's reviewed.
                </Alert>
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid #ff9800'
                    }}
                >
                    <PendingActions sx={{ fontSize: 64, color: '#ff9800', mb: 2 }} />
                    <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                        Application Under Review
                    </Typography>
                    <Typography sx={{ color: '#999' }}>
                        Our team is reviewing your brand application. This typically takes 24-48 hours.
                    </Typography>
                </Paper>
            </Box>
        );
    }

    if (brand.status === 'rejected') {
        return (
            <Alert severity="error">
                Your brand application was rejected. Reason: {brand.rejectedReason || 'Not specified'}
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, color: '#d4af37', fontWeight: 'bold' }}>
                Dashboard Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Sales"
                        value={stats?.totalSales || 0}
                        icon={<ShoppingCart sx={{ fontSize: 40, color: '#2196f3' }} />}
                        color="#2196f3"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Revenue"
                        value={`Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`}
                        icon={<AttachMoney sx={{ fontSize: 40, color: '#4caf50' }} />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Products"
                        value={stats?.activeProducts || 0}
                        icon={<Inventory sx={{ fontSize: 40, color: '#d4af37' }} />}
                        color="#d4af37"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Avg Rating"
                        value={stats?.averageRating || 0}
                        icon={<Star sx={{ fontSize: 40, color: '#ff9800' }} />}
                        color="#ff9800"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Paper
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                            border: '1px solid #d4af37'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, color: '#d4af37', fontWeight: 'bold' }}>
                            Sales Trends
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats?.monthlySales || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="month" stroke="#999" />
                                <YAxis stroke="#999" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #d4af37',
                                        borderRadius: '8px'
                                    }}
                                    labelStyle={{ color: '#d4af37' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#d4af37"
                                    fill="url(#colorSales)"
                                />
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={4}>
                    <Paper
                        sx={{
                            p: 3,
                            background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                            border: '1px solid #d4af37',
                            height: '100%'
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 3, color: '#d4af37', fontWeight: 'bold' }}>
                            Store Information
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="body2" sx={{ color: '#999' }}>Brand Name</Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{brand.name}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ color: '#999' }}>Status</Typography>
                                <Typography sx={{ color: '#4caf50', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {brand.status}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ color: '#999' }}>Commission Rate</Typography>
                                <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{brand.commissionRate}%</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" sx={{ color: '#999' }}>Member Since</Typography>
                                <Typography sx={{ color: '#fff' }}>
                                    {new Date(brand.createdAt).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default VendorDashboard;
