import io from 'socket.io-client';
import { toast } from 'react-toastify';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
let socket;

export const connectSocket = (user) => {
    if (!socket) {
        socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Admin socket connected');
            socket.emit('join:admin');
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // New order notifications
        socket.on('order:new', (orderData) => {
            toast.success(`New order received! Order #${orderData.orderNumber}`);
        });

        // Brand approval requests
        socket.on('brand:pending', (brandData) => {
            toast.info(`New brand registration pending: ${brandData.name}`);
        });
    }

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;

export default { connectSocket, disconnectSocket, getSocket };
