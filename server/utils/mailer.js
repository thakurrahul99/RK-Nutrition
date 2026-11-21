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

const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export async function sendEmail({ to, subject, html, text }) {
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@rknutrition.com';

  if (!transporter) {
    // Explicitly report mock mode; no email is actually sent.
    console.warn('[Mailer] SMTP is not configured. Email delivery skipped.');
    return { success: false, mocked: true, error: 'SMTP is not configured.' };
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
    console.error('[Mailer Error] Email delivery failed:', err.message);
    return { success: false, error: 'Email delivery failed.' };
  }
}

export async function sendOrderConfirmationEmail(order) {
  const customerName = escapeHtml(order.customer?.name || 'Customer');
  const orderNumber = escapeHtml(order.orderNumber || order.id);
  const total = Number(order.total || 0);
  const paymentMethod = escapeHtml(order.paymentMethod);
  const orderStatus = escapeHtml(order.orderStatus);

  const subject = `Order Confirmed: #ORD-${orderNumber} — RK Nutrition`;
  const html = `
    <div style="font-family: sans-serif; background: #111; color: #f5f4f2; padding: 24px; border-radius: 8px;">
      <h2 style="color: #D51F32; margin-top: 0;">RK NUTRITION</h2>
      <p>Hello ${customerName},</p>
      <p>Thank you for choosing RK Nutrition. Your order <strong>#ORD-${orderNumber}</strong> has been confirmed.</p>
      <div style="background: #1c1c1c; padding: 16px; border-left: 4px solid #D51F32; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Total Amount:</strong> ₹${total.toLocaleString('en-IN')}</p>
        <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> ${orderStatus}</p>
      </div>
      <p>We are preparing your sports nutrition supplements.</p>
      <p style="color: #888; font-size: 12px; margin-top: 30px;">RK Nutrition Official Store</p>
    </div>
  `;

  return sendEmail({
    to: order.customer.email,
    subject,
    html,
    text: `Your RK Nutrition order #ORD-${order.orderNumber || order.id} has been confirmed. Total: ₹${total}.`
  });
}

export async function sendPasswordResetEmail({ to, name, resetUrl }) {
  const safeName = escapeHtml(name || 'Customer');
  let safeResetUrl = '';
  try {
    const parsedUrl = new URL(resetUrl);
    if (parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:') {
      safeResetUrl = escapeHtml(parsedUrl.href);
    }
  } catch {
    // Invalid reset URLs are omitted from the HTML email.
  }

  const subject = 'Password Reset Request — RK Nutrition';
  const html = `
    <div style="font-family: sans-serif; background: #111; color: #f5f4f2; padding: 24px; border-radius: 8px;">
      <h2 style="color: #D51F32;">RK NUTRITION</h2>
      <p>Hello ${safeName},</p>
      <p>We received a request to reset your password. Use the link below to set a new password:</p>
      ${safeResetUrl ? `<p style="margin: 24px 0;"><a href="${safeResetUrl}" style="background: #D51F32; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 4px; display: inline-block;">Reset Password</a></p>` : '<p>Reset link unavailable. Please request a new password reset.</p>'}
      <p>This single-use link expires in 1 hour. If you did not request this, please disregard this email.</p>
    </div>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: safeResetUrl
      ? `Password reset link: ${resetUrl} (Expires in 1 hour)`
      : 'Please request a new password reset link. (Expires in 1 hour)'
  });
}
