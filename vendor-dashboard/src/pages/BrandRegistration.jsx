import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { brandService } from '../services/api';
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
    Step,
    Stepper,
    StepLabel
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const steps = ['Brand Info', 'Business Details', 'Bank Information'];

const BrandRegistration = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { refreshBrand } = useAuth();
    const navigate = useNavigate();

    // Brand Info
    const [brandName, setBrandName] = useState('');
    const [description, setDescription] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');

    // Business Details
    const [legalName, setLegalName] = useState('');
    const [taxId, setTaxId] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [businessType, setBusinessType] = useState('');

    // Bank Details
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [iban, setIban] = useState('');

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    });

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const brandData = {
                name: brandName,
                description,
                businessInfo: {
                    legalName,
                    taxId,
                    registrationNumber,
                    businessType
                },
                bankDetails: {
                    accountName,
                    accountNumber,
                    bankName,
                    iban
                }
            };

            await brandService.registerBrand(brandData, logoFile);
            await refreshBrand();
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <TextField
                            fullWidth
                            required
                            label="Brand Name"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            required
                            multiline
                            rows={4}
                            label="Brand Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <Typography variant="subtitle2" sx={{ color: '#d4af37', mb: 2 }}>
                            Upload Brand Logo *
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
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            ) : (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: '#d4af37', mb: 2 }} />
                                    <Typography sx={{ color: '#fff' }}>
                                        Drag & drop logo here, or click to select
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </>
                );

            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Legal Business Name"
                                value={legalName}
                                onChange={(e) => setLegalName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Tax ID / NTN"
                                value={taxId}
                                onChange={(e) => setTaxId(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Registration Number"
                                value={registrationNumber}
                                onChange={(e) => setRegistrationNumber(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Business Type"
                                placeholder="e.g., Private Limited, Sole Proprietorship"
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                );

            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Account Holder Name"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Account Number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Bank Name"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="IBAN (Optional)"
                                value={iban}
                                onChange={(e) => setIban(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                );

            default:
                return null;
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{ minHeight: '100vh', py: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                    }}
                >
                    <Typography component="h1" variant="h4" sx={{ mb: 1, color: '#d4af37', fontWeight: 'bold' }}>
                        Register Your Brand
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 4, color: '#999' }}>
                        Complete the registration to start selling on Virtual Mega Mall
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <StepLabel
                                key={label}
                                sx={{
                                    '& .MuiStepLabel-label': { color: '#999' },
                                    '& .Mui-active': { color: '#d4af37' },
                                    '& .Mui-completed': { color: '#4caf50' },
                                    '& .MuiStepIcon-root': { color: '#666' },
                                    '& .MuiStepIcon-root.Mui-active': { color: '#d4af37' },
                                    '& .MuiStepIcon-root.Mui-completed': { color: '#4caf50' }
                                }}
                            >
                                {label}
                            </StepLabel>
                        ))}
                    </Stepper>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        {renderStepContent(activeStep)}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ color: '#d4af37' }}
                            >
                                Back
                            </Button>
                            {activeStep === steps.length - 1 ? (
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
                                    {loading ? <CircularProgress size={24} /> : 'Submit for Approval'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{
                                        backgroundColor: '#d4af37',
                                        color: '#1a1a1a',
                                        fontWeight: 'bold',
                                        '&:hover': { backgroundColor: '#c19b2a' }
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>

                    <Typography variant="body2" sx={{ mt: 3, color: '#999', textAlign: 'center' }}>
                        Your application will be reviewed by our team within 24-48 hours
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default BrandRegistration;
