import { useEffect, useState } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import {
    TrendingUp,
    Store,
    Inventory,
    PendingActions,
    AttachMoney
} from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService } from '../services/api';

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

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const data = await analyticsService.getDashboardStats();
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

    return (
        <Box>
            <Typography variant="h4" sx={{ mb: 4, color: '#d4af37', fontWeight: 'bold' }}>
                Dashboard Overview
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Revenue"
                        value={`Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`}
                        icon={<AttachMoney sx={{ fontSize: 40, color: '#4caf50' }} />}
                        color="#4caf50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Brands"
                        value={stats?.activeBrands || 0}
                        icon={<Store sx={{ fontSize: 40, color: '#2196f3' }} />}
                        color="#2196f3"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Products"
                        value={stats?.totalProducts || 0}
                        icon={<Inventory sx={{ fontSize: 40, color: '#d4af37' }} />}
                        color="#d4af37"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Pending Approvals"
                        value={stats?.pendingApprovals || 0}
                        icon={<PendingActions sx={{ fontSize: 40, color: '#ff9800' }} />}
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
                            Revenue Trends
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats?.monthlyRevenue || []}>
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
                                    dataKey="revenue"
                                    stroke="#d4af37"
                                    fill="url(#colorRevenue)"
                                />
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(212, 175, 55, 0.3)',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.2)' }
                                }}
                            >
                                <Typography sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                    Review Brand Approvals
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#999' }}>
                                    {stats?.pendingApprovals || 0} pending
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(33, 150, 243, 0.3)',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.2)' }
                                }}
                            >
                                <Typography sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                                    Manage Categories
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#999' }}>
                                    Add or edit categories
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                    borderRadius: 2,
                                    border: '1px solid rgba(76, 175, 80, 0.3)',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                                }}
                            >
                                <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                    View Analytics
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#999' }}>
                                    Detailed reports
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
