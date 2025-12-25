import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Avatar,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import { brandService } from '../services/api';

const BrandApprovals = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchPendingBrands();
    }, []);

    const fetchPendingBrands = async () => {
        try {
            const response = await brandService.getAllBrands('pending');
            setBrands(response.data || []);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch pending brands' });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (brandId) => {
        setActionLoading(true);
        try {
            await brandService.approveBrand(brandId);
            setMessage({ type: 'success', text: 'Brand approved successfully!' });
            fetchPendingBrands();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to approve brand' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectConfirm = async () => {
        if (!rejectReason.trim()) {
            setMessage({ type: 'error', text: 'Please provide a reason for rejection' });
            return;
        }

        setActionLoading(true);
        try {
            await brandService.rejectBrand(selectedBrand._id, rejectReason);
            setMessage({ type: 'success', text: 'Brand rejected' });
            setRejectDialogOpen(false);
            setRejectReason('');
            fetchPendingBrands();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to reject brand' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewDetails = (brand) => {
        setSelectedBrand(brand);
        setViewDialogOpen(true);
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
            <Typography variant="h4" sx={{ mb: 3, color: '#d4af37', fontWeight: 'bold' }}>
                Brand Approvals
            </Typography>

            {message && (
                <Alert
                    severity={message.type}
                    onClose={() => setMessage(null)}
                    sx={{ mb: 3 }}
                >
                    {message.text}
                </Alert>
            )}

            {brands.length === 0 ? (
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid #d4af37'
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#999' }}>
                        No pending brand approvals
                    </Typography>
                </Paper>
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid #d4af37'
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Brand</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Owner</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Submitted</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {brands.map((brand) => (
                                <TableRow
                                    key={brand._id}
                                    sx={{
                                        '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' }
                                    }}
                                >
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar
                                                src={brand.logo}
                                                alt={brand.name}
                                                sx={{ width: 40, height: 40 }}
                                            />
                                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                {brand.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff' }}>
                                        {brand.owner?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#999' }}>
                                        {new Date(brand.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={brand.status}
                                            color="warning"
                                            size="small"
                                            sx={{ textTransform: 'uppercase' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Visibility />}
                                                onClick={() => handleViewDetails(brand)}
                                                sx={{
                                                    color: '#2196f3',
                                                    borderColor: '#2196f3',
                                                    '&:hover': { borderColor: '#1976d2', backgroundColor: 'rgba(33, 150, 243, 0.1)' }
                                                }}
                                            >
                                                View
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<CheckCircle />}
                                                onClick={() => handleApprove(brand._id)}
                                                disabled={actionLoading}
                                                sx={{
                                                    backgroundColor: '#4caf50',
                                                    '&:hover': { backgroundColor: '#45a049' }
                                                }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<Cancel />}
                                                onClick={() => {
                                                    setSelectedBrand(brand);
                                                    setRejectDialogOpen(true);
                                                }}
                                                disabled={actionLoading}
                                                sx={{
                                                    color: '#f44336',
                                                    borderColor: '#f44336',
                                                    '&:hover': { borderColor: '#d32f2f', backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* View Details Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #d4af37'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    Brand Details
                </DialogTitle>
                <DialogContent>
                    {selectedBrand && (
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <Card sx={{ backgroundColor: '#2d2d2d' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ color: '#999', mb: 1 }}>
                                            Brand Name
                                        </Typography>
                                        <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                            {selectedBrand.name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Card sx={{ backgroundColor: '#2d2d2d' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ color: '#999', mb: 1 }}>
                                            Owner Email
                                        </Typography>
                                        <Typography sx={{ color: '#fff' }}>
                                            {selectedBrand.owner?.email || 'N/A'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card sx={{ backgroundColor: '#2d2d2d' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ color: '#999', mb: 1 }}>
                                            Description
                                        </Typography>
                                        <Typography sx={{ color: '#fff' }}>
                                            {selectedBrand.description || 'No description provided'}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card sx={{ backgroundColor: '#2d2d2d' }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" sx={{ color: '#999', mb: 2 }}>
                                            Brand Logo
                                        </Typography>
                                        <Avatar
                                            src={selectedBrand.logo}
                                            alt={selectedBrand.name}
                                            sx={{ width: 100, height: 100 }}
                                            variant="rounded"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setViewDialogOpen(false)}
                        sx={{ color: '#d4af37' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                open={rejectDialogOpen}
                onClose={() => !actionLoading && setRejectDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #f44336'
                    }
                }}
            >
                <DialogTitle sx={{ color: '#f44336', fontWeight: 'bold' }}>
                    Reject Brand Application
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: '#999', mb: 3 }}>
                        Please provide a reason for rejecting this brand application:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="Enter rejection reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                '& fieldset': { borderColor: '#f44336' },
                                '&:hover fieldset': { borderColor: '#d32f2f' },
                                '&.Mui-focused fieldset': { borderColor: '#f44336' }
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setRejectDialogOpen(false)}
                        disabled={actionLoading}
                        sx={{ color: '#999' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRejectConfirm}
                        disabled={actionLoading}
                        variant="contained"
                        sx={{
                            backgroundColor: '#f44336',
                            '&:hover': { backgroundColor: '#d32f2f' }
                        }}
                    >
                        {actionLoading ? <CircularProgress size={24} /> : 'Reject'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BrandApprovals;
