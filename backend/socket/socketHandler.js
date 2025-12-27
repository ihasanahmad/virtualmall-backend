let io;

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });

        io.on('connection', (socket) => {
            console.log(`✅ New socket connection: ${socket.id}`);

            // Join specific rooms based on user role
            socket.on('join:admin', () => {
                socket.join('admin-room');
                console.log(`Admin joined: ${socket.id}`);
            });

            socket.on('join:vendor', (vendorId) => {
                socket.join(`vendor-${vendorId}`);
                console.log(`Vendor ${vendorId} joined: ${socket.id}`);
            });

            socket.on('join:customer', (customerId) => {
                socket.join(`customer-${customerId}`);
                console.log(`Customer ${customerId} joined: ${socket.id}`);
            });

            socket.on('disconnect', () => {
                console.log(`❌ Socket disconnected: ${socket.id}`);
            });
        });

        console.log('🔌 Socket.io initialized');
        return io;
    },

    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized');
        }
        return io;
    },

    // Emit new order notification to vendor
    notifyVendorNewOrder: (vendorId, orderData) => {
        if (io) {
            io.to(`vendor-${vendorId}`).emit('order:new', orderData);
        }
    },

    // Emit order status update to customer
    notifyCustomerOrderUpdate: (customerId, orderData) => {
        if (io) {
            io.to(`customer-${customerId}`).emit('order:updated', orderData);
        }
    },

    // Emit new order notification to admin
    notifyAdminNewOrder: (orderData) => {
        if (io) {
            io.to('admin-room').emit('order:new', orderData);
        }
    },

    // Emit brand approval notification
    notifyBrandApproval: (vendorId, brandData) => {
        if (io) {
            io.to(`vendor-${vendorId}`).emit('brand:approved', brandData);
        }
    },

    // Emit brand rejection notification
    notifyBrandRejection: (vendorId, brandData) => {
        if (io) {
            io.to(`vendor-${vendorId}`).emit('brand:rejected', brandData);
        }
    },

    // Broadcast to all connected clients
    broadcast: (event, data) => {
        if (io) {
            io.emit(event, data);
        }
    }
};
