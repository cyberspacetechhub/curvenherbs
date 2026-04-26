const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gmail App Password
  }
});

const STATUS_MESSAGES = {
  'Pending': {
    subject: '🌿 Order Received – Curvenherbs',
    heading: 'We\'ve received your order!',
    body: 'Thank you for ordering from Curvenherbs. Your order has been received and is awaiting payment confirmation. Please complete your bank transfer to proceed.',
    color: '#f59e0b'
  },
  'Payment Received': {
    subject: '✅ Payment Confirmed – Curvenherbs',
    heading: 'Payment confirmed!',
    body: 'Great news! We have confirmed your payment. Our team is now preparing your herbal products for processing.',
    color: '#10b981'
  },
  'Processing': {
    subject: '🌱 Your Order is Being Prepared – Curvenherbs',
    heading: 'We\'re preparing your order',
    body: 'Your order is currently being carefully prepared and packaged by our team in Abakaliki. We use only 100% natural herbs — good things take a little time!',
    color: '#3b82f6'
  },
  'Shipped': {
    subject: '🚚 Your Order is On Its Way – Curvenherbs',
    heading: 'Your order has been shipped!',
    body: 'Exciting news! Your Curvenherbs package is on its way to you. You can track your delivery status using your tracking number below.',
    color: '#8b5cf6'
  },
  'Out for Delivery': {
    subject: '📦 Out for Delivery – Curvenherbs',
    heading: 'Your order is out for delivery!',
    body: 'Your Curvenherbs package is out for delivery today. Please ensure someone is available to receive it. Once received, click the "Mark as Received" button in your order page.',
    color: '#ec4899'
  },
  'Delivered': {
    subject: '🎉 Order Delivered – Curvenherbs',
    heading: 'Your order has been delivered!',
    body: 'Your Curvenherbs products have been delivered. We hope you love them! Remember to use consistently for best results. Visible changes in 4–8 weeks with a calorie surplus.',
    color: '#16a34a'
  },
  'Cancelled': {
    subject: '❌ Order Cancelled – Curvenherbs',
    heading: 'Your order has been cancelled',
    body: 'Your order has been cancelled. If you did not request this cancellation or have any questions, please contact us on WhatsApp: 08149838596.',
    color: '#ef4444'
  }
};

const buildOrderItemsTable = (items = []) => {
  if (!items.length) return '';
  const rows = items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${item.product?.name || 'Product'}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">₦${item.priceAtPurchase?.toLocaleString()}</td>
    </tr>`).join('');

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:16px 0;font-size:14px;">
      <thead>
        <tr style="background:#f9f5f0;">
          <th style="padding:8px 12px;text-align:left;color:#555;">Product</th>
          <th style="padding:8px 12px;text-align:center;color:#555;">Qty</th>
          <th style="padding:8px 12px;text-align:right;color:#555;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      </table>`;
};

const buildEmailHtml = (order, status, note) => {
  const template = STATUS_MESSAGES[status];
  const itemsTable = buildOrderItemsTable(order.items);
  const trackingRow = order.trackingNumber
    ? `<p style="margin:8px 0;"><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : '';
  const noteRow = note ? `<p style="margin:8px 0;color:#666;font-style:italic;">${note}</p>` : '';

  const markReceivedBtn = status === 'Out for Delivery' || status === 'Shipped'
    ? `<div style="text-align:center;margin:24px 0;">
        <a href="${process.env.FRONTEND_URL}/orders/${order._id}/confirm-delivery"
          style="background:#e91e8c;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
          ✅ Mark as Received
        </a>
       </div>` : '';

  return `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#fdf8f3;font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:#1a4731;padding:24px 32px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:1px;">🌿 CURVENHERBS</h1>
        <p style="color:#a8d5b5;margin:4px 0 0;font-size:13px;">Natural Herbal Body Enhancement</p>
      </div>

      <!-- Status Banner -->
      <div style="background:${template.color};padding:16px 32px;">
        <h2 style="color:#fff;margin:0;font-size:18px;">${template.heading}</h2>
      </div>

      <!-- Body -->
      <div style="padding:28px 32px;">
        <p style="color:#333;font-size:15px;">Hi ${order.customer?.name || 'Valued Customer'},</p>
        <p style="color:#555;font-size:14px;line-height:1.7;">${template.body}</p>

        ${noteRow}

        <!-- Order Details -->
        <div style="background:#f9f5f0;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:4px 0;font-size:14px;"><strong>Order ID:</strong> #${order._id}</p>
          <p style="margin:4px 0;font-size:14px;"><strong>Status:</strong> <span style="color:${template.color};font-weight:bold;">${status}</span></p>
          <p style="margin:4px 0;font-size:14px;"><strong>Total:</strong> ₦${order.totalAmount?.toLocaleString()}</p>
          ${trackingRow}
        </div>

        ${itemsTable}
        ${markReceivedBtn}

        <!-- Footer CTA -->
        <div style="border-top:1px solid #f0e8e0;margin-top:24px;padding-top:20px;text-align:center;">
          <p style="color:#555;font-size:13px;">Questions? Chat with us on WhatsApp</p>
          <a href="https://wa.me/2348149838596" style="background:#25d366;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-size:14px;display:inline-block;">
            💬 WhatsApp Us
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f9f5f0;padding:16px 32px;text-align:center;">
        <p style="color:#999;font-size:12px;margin:0;">© ${new Date().getFullYear()} Curvenherbs · Abakaliki, Ebonyi State, Nigeria</p>
        <p style="color:#999;font-size:12px;margin:4px 0 0;">100% Natural · No Side Effects · Proudly Nigerian</p>
      </div>
    </div>
  </body>
  </html>`;
};

const sendOrderStatusEmail = async (order, status, note = '') => {
  const email = order.customer?.email;
  if (!email) return;

  const template = STATUS_MESSAGES[status];
  if (!template) return;

  await transporter.sendMail({
    from: `"Curvenherbs 🌿" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: template.subject,
    html: buildEmailHtml(order, status, note)
  });
};

module.exports = { sendOrderStatusEmail };
