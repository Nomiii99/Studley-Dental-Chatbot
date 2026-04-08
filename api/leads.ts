import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, service } = request.body;

  console.log("New Lead Captured (Vercel):", { name, email, phone, service });

  const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
  
  if (zapierUrl) {
    try {
      const zapResponse = await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          source: "Studley Dental Chatbot (Vercel)",
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!zapResponse.ok) {
        console.error("Zapier Webhook failed:", await zapResponse.text());
      }
    } catch (error) {
      console.error("Error sending lead to Zapier:", error);
    }
  }

  return response.status(200).json({
    success: true,
    message: "Lead captured and processed via Vercel Serverless",
  });
}
