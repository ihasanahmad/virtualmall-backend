import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Chip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StoreIcon from '@mui/icons-material/Store';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

const VendorLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { user, brand, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Products', icon: <InventoryIcon />, path: '/products' },
        { text: 'Add Product', icon: <AddBoxIcon />, path: '/products/add' },
        { text: 'Orders', icon: <ListAltIcon />, path: '/orders' },
        { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
        { text: 'My Store', icon: <StoreIcon />, path: '/store' }
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'pending': return 'warning';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    const drawer = (
        <Box sx={{ height: '100%', background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
            <Toolbar sx={{ justifyContent: 'center', py: 2, flexDirection: 'column' }}>
                {brand?.logo && (
                    <Avatar
                        src={brand.logo}
                        alt={brand.name}
                        sx={{ width: 60, height: 60, mb: 1 }}
                    />
                )}
                <Typography variant="subtitle1" noWrap sx={{ color: '#d4af37', fontWeight: 'bold' }}>
                    {brand?.name || 'My Brand'}
                </Typography>
                {brand && (
                    <Chip
                        label={brand.status}
                        color={getStatusColor(brand.status)}
                        size="small"
                        sx={{ mt: 1, textTransform: 'uppercase' }}
                    />
                )}
            </Toolbar>
            <Divider sx={{ backgroundColor: '#d4af37' }} />
            <List sx={{ px: 1, pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                                    '& .MuiListItemIcon-root': { color: '#d4af37' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: '#d4af37', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                    boxShadow: '0 2px 10px rgba(212, 175, 55, 0.1)'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#d4af37' }}>
                        Vendor Dashboard
                    </Typography>
                    <IconButton onClick={handleMenuClick}>
                        <Avatar sx={{ bgcolor: '#d4af37', color: '#1a1a1a', fontWeight: 'bold' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        sx={{
                            '& .MuiPaper-root': {
                                backgroundColor: '#2d2d2d',
                                color: '#fff',
                                mt: 1
                            }
                        }}
                    >
                        <MenuItem disabled>
                            <Typography variant="body2">{user?.email}</Typography>
                        </MenuItem>
                        <Divider sx={{ backgroundColor: '#d4af37' }} />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon sx={{ color: '#d4af37' }}>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    backgroundColor: '#0a0a0a',
                    minHeight: '100vh'
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default VendorLayout;
