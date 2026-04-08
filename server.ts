import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for lead capture
  app.post("/api/leads", async (req, res) => {
    const { name, email, phone, service } = req.body;

    console.log("New Lead Captured:", { name, email, phone, service });

    // Trigger Zapier Webhook if configured
    const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
    if (zapierUrl) {
      try {
        const response = await fetch(zapierUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            phone,
            service,
            source: "Studley Dental Chatbot",
            timestamp: new Date().toISOString(),
          }),
        });
        
        if (!response.ok) {
          console.error("Zapier Webhook failed:", await response.text());
        } else {
          console.log("Lead sent to Zapier successfully");
        }
      } catch (error) {
        console.error("Error sending lead to Zapier:", error);
      }
    }

    // In a real app, you'd also send an email here using nodemailer or similar.
    // For this demo, we'll just return success.
    res.json({ success: true, message: "Lead captured and processed" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
