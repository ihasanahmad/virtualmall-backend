import { useState, useEffect } from 'react';
import {
    Container, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Select, MenuItem, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/orders`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrders(data.data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingStatus(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
                { orderStatus: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Order status updated successfully');
            fetchOrders();
            setDialogOpen(false);
        } catch (error) {
            console.error('Error updating order:', error);
            toast.error('Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'warning',
            processing: 'info',
            shipped: 'primary',
            delivered: 'success',
            cancelled: 'error'
        };
        return colors[status] || 'default';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#d4af37' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold', mb: 4 }}>
                My Orders
            </Typography>

            <TableContainer component={Paper} sx={{ bgcolor: '#1a1a1a' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Order #</TableCell>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Customer</TableCell>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Items</TableCell>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell sx={{ color: '#fff' }}>{order.orderNumber}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{order.user?.name}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{order.items?.length}</TableCell>
                                <TableCell sx={{ color: '#d4af37' }}>Rs. {order.totalAmount?.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={order.orderStatus}
                                        color={getStatusColor(order.orderStatus)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell sx={{ color: '#999' }}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<Visibility />}
                                        onClick={() => handleViewOrder(order)}
                                        sx={{ borderColor: '#d4af37', color: '#d4af37' }}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Order Detail Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                {selectedOrder && (
                    <>
                        <DialogTitle sx={{ bgcolor: '#1a1a1a', color: '#d4af37' }}>
                            Order #{selectedOrder.orderNumber}
                        </DialogTitle>
                        <DialogContent sx={{ bgcolor: '#1a1a1a' }}>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1" sx={{ color: '#d4af37', mb: 1 }}>
                                    Customer Information
                                </Typography>
                                <Typography sx={{ color: '#fff' }}>{selectedOrder.user?.name}</Typography>
                                <Typography sx={{ color: '#999' }}>{selectedOrder.user?.email}</Typography>
                                <Typography sx={{ color: '#999' }}>{selectedOrder.shippingAddress?.phone}</Typography>

                                <Typography variant="subtitle1" sx={{ color: '#d4af37', mt: 3, mb: 1 }}>
                                    Shipping Address
                                </Typography>
                                <Typography sx={{ color: '#fff' }}>
                                    {selectedOrder.shippingAddress?.addressLine1}, {selectedOrder.shippingAddress?.city}
                                </Typography>

                                <Typography variant="subtitle1" sx={{ color: '#d4af37', mt: 3, mb: 1 }}>
                                    Update Status
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedOrder.orderStatus}
                                        onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                                        disabled={updatingStatus}
                                        sx={{ color: '#fff' }}
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="processing">Processing</MenuItem>
                                        <MenuItem value="shipped">Shipped</MenuItem>
                                        <MenuItem value="delivered">Delivered</MenuItem>
                                        <MenuItem value="cancelled">Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ bgcolor: '#1a1a1a' }}>
                            <Button onClick={() => setDialogOpen(false)} sx={{ color: '#d4af37' }}>
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
};

export default Orders;
