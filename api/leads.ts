import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, service } = request.body;
  const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });

  console.log("New Lead Captured:", { name, email, phone, service });

  // 1. Send to Zapier (for GHL and potentially Email)
  const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
  if (zapierUrl) {
    try {
      await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          source: "Studley Dental Chatbot",
          timestamp,
          formattedMessage: `New Enquiry from ${name}\nService: ${service}\nEmail: ${email}\nPhone: ${phone}`
        }),
      });
    } catch (error) {
      console.error("Zapier Error:", error);
    }
  }

  // 2. Direct Email Notification via Resend (if API key exists)
  const resendKey = process.env.RESEND_API_KEY;
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'noman@thecreativecomposite.co.uk';

  if (resendKey) {
    const resend = new Resend(resendKey);
    try {
      await resend.emails.send({
        from: 'Studley Dental Chatbot <onboarding@resend.dev>',
        to: targetEmail,
        subject: `New Lead: ${service} - ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #1a365d;">
            <h2 style="border-bottom: 2px solid #c5a059; padding-bottom: 10px;">New Website Enquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Service Interested:</strong> ${service}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #718096;">Received on: ${timestamp} (UTC)</p>
          </div>
        `,
      });
      console.log("Direct email notification sent via Resend");
    } catch (error) {
      console.error("Resend Email Error:", error);
    }
  }

  return response.status(200).json({
    success: true,
    message: "Lead processed successfully",
  });
}
