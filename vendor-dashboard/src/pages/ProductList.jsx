import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
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
    Button,
    Chip,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await productService.getMyProducts();
            setProducts(response.data || []);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch products' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await productService.deleteProduct(id);
            setMessage({ type: 'success', text: 'Product deleted successfully' });
            fetchProducts();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete product' });
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
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    My Products
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/products/add')}
                    sx={{
                        backgroundColor: '#d4af37',
                        color: '#1a1a1a',
                        fontWeight: 'bold',
                        '&:hover': { backgroundColor: '#c19b2a' }
                    }}
                >
                    Add Product
                </Button>
            </Box>

            {message && (
                <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 3 }}>
                    {message.text}
                </Alert>
            )}

            {products.length === 0 ? (
                <Paper
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid #d4af37'
                    }}
                >
                    <Typography variant="h6" sx={{ color: '#999', mb: 2 }}>
                        No products yet
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/products/add')}
                        sx={{
                            backgroundColor: '#d4af37',
                            color: '#1a1a1a',
                            '&:hover': { backgroundColor: '#c19b2a' }
                        }}
                    >
                        Add Your First Product
                    </Button>
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
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Product</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Category</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Price</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Stock</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ color: '#d4af37', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow
                                    key={product._id}
                                    sx={{ '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.05)' } }}
                                >
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            {product.images?.[0] && (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                                                />
                                            )}
                                            <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                {product.name}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff' }}>
                                        {product.category?.name || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff' }}>
                                        Rs. {product.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell sx={{ color: '#fff' }}>
                                        {product.inventory}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.status}
                                            color={product.status === 'active' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box display="flex" gap={1}>
                                            <IconButton
                                                size="small"
                                                sx={{ color: '#2196f3' }}
                                                onClick={() => navigate(`/products/${product._id}`)}
                                            >
                                                <Visibility />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ color: '#d4af37' }}
                                                onClick={() => navigate(`/products/edit/${product._id}`)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                sx={{ color: '#f44336' }}
                                                onClick={() => handleDelete(product._id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default ProductList;
