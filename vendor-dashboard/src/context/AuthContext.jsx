import { createContext, useContext, useState, useEffect } from 'react';
import { authService, brandService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [brand, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const currentUser = authService.getCurrentUser();
        if (currentUser && currentUser.role === 'vendor') {
            setUser(currentUser);
            // Fetch brand info
            fetchBrand();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchBrand = async () => {
        try {
            const brandData = await brandService.getMyBrand();
            setBrand(brandData);
        } catch (error) {
            console.error('Failed to fetch brand:', error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        if (data.user.role !== 'vendor') {
            authService.logout();
            throw new Error('Invalid account type');
        }
        setUser(data.user);
        return data;
    };

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        if (data.user.role !== 'vendor') {
            authService.logout();
            throw new Error('Access denied. Vendor account required.');
        }
        setUser(data.user);
        await fetchBrand();
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setBrand(null);
    };

    const refreshBrand = async () => {
        await fetchBrand();
    };

    const value = {
        user,
        brand,
        login,
        register,
        logout,
        refreshBrand,
        isAuthenticated: !!user,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
