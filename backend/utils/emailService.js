const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send email
exports.sendEmail = async (options) => {
    const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME || 'Virtual Mega Mall'} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.html
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        return false;
    }
};

// Order confirmation email template
exports.orderConfirmationEmail = (order) => {
    const itemsHtml = order.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>Rs. ${item.price.toLocaleString()}</td>
      <td>Rs. ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #d4af37; padding: 30px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #1a1a1a; color: #d4af37; }
        .total { font-size: 18px; font-weight: bold; color: #d4af37; }
        .footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for shopping at Virtual Mega Mall!</p>
        </div>
        <div class="content">
          <h2>Order #${order.orderNumber}</h2>
          <p>Hi ${order.shippingAddress.fullName},</p>
          <p>Your order has been confirmed and will be processed soon.</p>
          
          <h3>Order Details:</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <p><strong>Subtotal:</strong> Rs. ${order.subtotal.toLocaleString()}</p>
          <p><strong>Shipping:</strong> Rs. ${order.shippingCost.toLocaleString()}</p>
          <p><strong>Tax:</strong> Rs. ${order.tax.toLocaleString()}</p>
          <p class="total">Total: Rs. ${order.total.toLocaleString()}</p>
          
          <h3>Shipping Address:</h3>
          <p>
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.addressLine1}<br>
            ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
            Phone: ${order.shippingAddress.phone}
          </p>
          
          <p>You can track your order status at any time by logging into your account.</p>
        </div>
        <div class="footer">
          <p>Virtual Mega Mall - Pakistan's First 3D Shopping Experience</p>
          <p>Questions? Contact us at support@virtualmegamall.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Vendor order notification template
exports.vendorOrderNotification = (order, brandItems) => {
    const itemsHtml = brandItems.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>Rs. ${item.price.toLocaleString()}</td>
    </tr>
  `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4af37; color: #1a1a1a; padding: 30px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Order Received!</h1>
        </div>
        <div class="content">
          <h2>Order #${order.orderNumber}</h2>
          <p>You have received a new order from Virtual Mega Mall.</p>
          
          <h3>Items to Fulfill:</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <h3>Ship To:</h3>
          <p>
            ${order.shippingAddress.fullName}<br>
            ${order.shippingAddress.addressLine1}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
            Phone: ${order.shippingAddress.phone}
          </p>
          
          <p><strong>Please log in to your vendor dashboard to process this order.</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
};
