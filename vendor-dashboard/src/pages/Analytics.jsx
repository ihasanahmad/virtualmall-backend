import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, ShoppingBag, LocalShipping, AttachMoney } from '@mui/icons-material';
import axios from 'axios';

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [salesTrends, setSalesTrends] = useState([]);
    const [productPerformance, setProductPerformance] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const [overviewRes, trendsRes, productsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/analytics/vendor/overview`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL}/analytics/vendor/sales-trends?period=month`, { headers }),
                axios.get(`${import.meta.env.VITE_API_URL}/analytics/vendor/products`, { headers })
            ]);

            setOverview(overviewRes.data.data);
            setSalesTrends(trendsRes.data.data || []);
            setProductPerformance(productsRes.data.data || []);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 4 }}>
                My Analytics
            </Typography>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, bgcolor: '#1a1a1a', border: '1px solid #d4af37' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AttachMoney sx={{ color: '#d4af37', mr: 1 }} />
                            <Typography variant="caption" sx={{ color: '#999' }}>Total Revenue</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                            Rs. {(overview?.totalRevenue || 0).toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, bgcolor: '#1a1a1a', border: '1px solid #4caf50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocalShipping sx={{ color: '#4caf50', mr: 1 }} />
                            <Typography variant="caption" sx={{ color: '#999' }}>Total Orders</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                            {overview?.totalOrders || 0}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, bgcolor: '#1a1a1a', border: '1px solid #2196f3' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <ShoppingBag sx={{ color: '#2196f3', mr: 1 }} />
                            <Typography variant="caption" sx={{ color: '#999' }}>Total Products</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                            {overview?.totalProducts || 0}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 3, bgcolor: '#1a1a1a', border: '1px solid #ff9800' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <TrendingUp sx={{ color: '#ff9800', mr: 1 }} />
                            <Typography variant="caption" sx={{ color: '#999' }}>Items Sold</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                            {overview?.totalItemsSold || 0}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Sales Trends Chart */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: '#1a1a1a' }}>
                        <Typography variant="h6" sx={{ color: '#d4af37', mb: 3 }}>Sales Trends</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#999" />
                                <YAxis stroke="#999" />
                                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #d4af37' }} />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#d4af37" strokeWidth={2} name="Sales" />
                                <Line type="monotone" dataKey="orders" stroke="#4caf50" strokeWidth={2} name="Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>

            {/* Product Performance */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: '#1a1a1a' }}>
                        <Typography variant="h6" sx={{ color: '#d4af37', mb: 3 }}>Product Performance</Typography>
                        {productPerformance.map((product, index) => (
                            <Box key={product._id} sx={{ mb: 2, p: 2, bgcolor: '#0a0a0a', borderRadius: 1 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={5}>
                                        <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#999' }}>
                                            Stock: {product.stock}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={2}>
                                        <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>Sales</Typography>
                                        <Typography sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                                            {product.sales}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={2}>
                                        <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>Orders</Typography>
                                        <Typography sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                                            {product.orders}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} md={3}>
                                        <Typography variant="caption" sx={{ color: '#999', display: 'block' }}>Revenue</Typography>
                                        <Typography sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                                            Rs. {product.revenue.toLocaleString()}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Analytics;
