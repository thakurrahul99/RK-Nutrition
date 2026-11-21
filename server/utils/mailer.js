import nodemailer from 'nodemailer';

const isConfigured = Boolean(
  process.env.SMTP_HOST && 
  process.env.SMTP_USER && 
  process.env.SMTP_PASS
);

let transporter = null;

if (isConfigured) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } catch (err) {
    console.warn('[Mailer] Failed to initialize SMTP transport:', err.message);
  }
}

export async function sendEmail({ to, subject, html, text }) {
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@rknutrition.com';
  
  if (!transporter) {
    // Graceful logging when SMTP is not configured in environment
    console.log(`[Mailer Mock Notification] To: ${to} | Subject: "${subject}" | Details: ${text || subject}`);
    return { success: true, mocked: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"RK Nutrition" <${fromEmail}>`,
      to,
      subject,
      text: text || subject,
      html
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Mailer Error] Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function sendOrderConfirmationEmail(order) {
  const customerName = order.customer?.name || 'Customer';
  const orderNumber = order.orderNumber || order.id;
  const total = order.total || 0;

  const subject = `Order Confirmed: #ORD-${orderNumber} — RK Nutrition`;
  const html = `
    <div style="font-family: sans-serif; background: #111; color: #f5f4f2; padding: 24px; border-radius: 8px;">
      <h2 style="color: #D51F32; margin-top: 0;">RK NUTRITION</h2>
      <p>Hello ${customerName},</p>
      <p>Thank you for choosing RK Nutrition. Your order <strong>#ORD-${orderNumber}</strong> has been confirmed.</p>
      <div style="background: #1c1c1c; padding: 16px; border-left: 4px solid #D51F32; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Total Amount:</strong> ₹${total.toLocaleString('en-IN')}</p>
        <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> ${order.orderStatus}</p>
      </div>
      <p>We are preparing your sports nutrition supplements with verified batch testing.</p>
      <p style="color: #888; font-size: 12px; margin-top: 30px;">RK Nutrition Official Store // Pure Formulations</p>
    </div>
  `;

  return sendEmail({
    to: order.customer.email,
    subject,
    html,
    text: `Your RK Nutrition order #ORD-${orderNumber} has been confirmed. Total: ₹${total}.`
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const subject = 'Password Reset Request — RK Nutrition';
  const html = `
    <div style="font-family: sans-serif; background: #111; color: #f5f4f2; padding: 24px; border-radius: 8px;">
      <h2 style="color: #D51F32;">RK NUTRITION</h2>
      <p>Hello ${name || 'Athlete'},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background: #D51F32; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Reset Password</a>
      </p>
      <p>This single-use link expires in 1 hour. If you did not request this, please disregard this email.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: `Password reset link: ${resetUrl} (Expires in 1 hour)`
  });
}
