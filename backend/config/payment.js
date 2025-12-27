require('dotenv').config();

module.exports = {
    jazzcash: {
        merchantId: process.env.JAZZCASH_MERCHANT_ID || 'MC12345',
        password: process.env.JAZZCASH_PASSWORD || 'test_password',
        integritySalt: process.env.JAZZCASH_SALT || 'test_salt',
        returnUrl: process.env.JAZZCASH_RETURN_URL || 'http://localhost:3000/payment/callback',
        apiUrl: process.env.JAZZCASH_API_URL || 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform'
    },

    easypaisa: {
        storeId: process.env.EASYPAISA_STORE_ID || 'store123',
        storePassword: process.env.EASYPAISA_PASSWORD || 'test_password',
        merchantId: process.env.EASYPAISA_MERCHANT_ID || 'merchant123',
        returnUrl: process.env.EASYPAISA_RETURN_URL || 'http://localhost:3000/payment/callback',
        apiUrl: process.env.EASYPAISA_API_URL || 'https://easypay-api.easypaisa.com.pk/easypay/Index.jsf'
    },

    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key',
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_key',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test',
        currency: 'pkr'
    }
};
