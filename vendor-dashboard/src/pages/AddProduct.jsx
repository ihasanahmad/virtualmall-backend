import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, categoryService } from '../services/api';
import { useDropzone } from 'react-dropzone';
import {
    Container,
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [compareAtPrice, setCompareAtPrice] = useState('');
    const [inventory, setInventory] = useState('');
    const [sku, setSku] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAllCategories();
            setCategories(response.data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 5,
        onDrop: (acceptedFiles) => {
            setImages(acceptedFiles);
            const previews = acceptedFiles.map(file => URL.createObjectURL(file));
            setImagePreviews(previews);
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const productData = {
                name,
                description,
                category,
                price: parseFloat(price),
                compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
                inventory: parseInt(inventory),
                sku
            };

            await productService.createProduct(productData, images);
            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Box>
                <Typography variant="h4" sx={{ mb: 3, color: '#d4af37', fontWeight: 'bold' }}>
                    Add New Product
                </Typography>

                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        p: 4,
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                        border: '1px solid #d4af37'
                    }}
                >
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Product Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={4}
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={category}
                                    label="Category"
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="SKU (Optional)"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Price (Rs.)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Compare at Price (Optional)"
                                value={compareAtPrice}
                                onChange={(e) => setCompareAtPrice(e.target.value)}
                                helperText="Original price for showing discount"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Inventory"
                                value={inventory}
                                onChange={(e) => setInventory(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="subtitle2" sx={{ color: '#d4af37', mb: 2 }}>
                                Product Images (Max 5) *
                            </Typography>
                            <Box
                                {...getRootProps()}
                                sx={{
                                    border: '2px dashed #d4af37',
                                    borderRadius: 2,
                                    p: 4,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: 'rgba(212, 175, 55, 0.05)',
                                    '&:hover': { backgroundColor: 'rgba(212, 175, 55, 0.1)' }
                                }}
                            >
                                <input {...getInputProps()} />
                                {imagePreviews.length > 0 ? (
                                    <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
                                        {imagePreviews.map((preview, index) => (
                                            <img
                                                key={index}
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <>
                                        <CloudUploadIcon sx={{ fontSize: 48, color: '#d4af37', mb: 2 }} />
                                        <Typography sx={{ color: '#fff' }}>
                                            Drag & drop images here, or click to select
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#999' }}>
                                            Upload up to 5 images
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" gap={2} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/products')}
                                    sx={{
                                        color: '#999',
                                        borderColor: '#999',
                                        '&:hover': { borderColor: '#fff', color: '#fff' }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: '#d4af37',
                                        color: '#1a1a1a',
                                        fontWeight: 'bold',
                                        '&:hover': { backgroundColor: '#c19b2a' }
                                    }}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Create Product'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
};

export default AddProduct;
