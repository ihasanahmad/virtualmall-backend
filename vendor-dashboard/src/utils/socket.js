import io from 'socket.io-client';
import { toast } from 'react-toastify';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
let socket;

export const connectSocket = (user) => {
    if (!socket) {
        socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Vendor socket connected');

            if (user?.brand?._id) {
                socket.emit('join:vendor', user.brand._id);
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // New order notifications
        socket.on('order:new', (orderData) => {
            toast.success(`New order received! Order #${orderData.orderNumber}`);
        });

        // Brand approval status
        socket.on('brand:approved', (brandData) => {
            toast.success(`Your brand "${brandData.name}" has been approved!`);
        });

        socket.on('brand:rejected', (brandData) => {
            toast.error(`Your brand "${brandData.name}" was rejected. Reason: ${brandData.reason}`);
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
