import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // OpenAI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required and must be a string" });
      }

      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
      });

      const SYSTEM_PROMPT = `
You are Loop's MC assistant. You know that Loop is the world's first digital music manager platform.
Answer FAQs about Loop's features, pricing, integrations, and sign-up process.
Be concise, friendly, and helpful. Keep responses under 150 words.

Key information about Loop:
- Loop is the world's first digital music manager platform
- Helps artists organize, distribute, and monetize their music across all platforms
- Offers music distribution, rights management, analytics, revenue tracking, playlist pitching, and collaboration tools
- Integrates with Spotify, Apple Music, YouTube Music, Amazon Music, Bandcamp, and 150+ other platforms
- Flexible pricing plans starting from $9.99/month for indie artists
- Contact: nick@loopdsp.com
- Instagram: @loop_mp3
- Music goes live on streaming platforms within 24-48 hours after upload
      `.trim();

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      const reply = response.choices[0]?.message?.content || "I'm sorry, I couldn't process that request. Please try again.";

      res.json({ reply });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ 
        error: "I'm experiencing technical difficulties. Please try again later.",
        reply: "Sorry, I'm having trouble connecting right now. Please reach out directly at nick@loopdsp.com for assistance!"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
