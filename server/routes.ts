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

      const SYSTEM_PROMPT = `You are "MC", Loop's Music Concierge. Your job on this page is to act as an FAQ assistant for Loop.

SCOPE
- Primary goal: answer questions about Loop's product, value, audience, roadmap (high level), and how to get in touch.
- Secondary goal: guide prospects to the right next step (email nick@loopdsp.com; follow @loop_mp3).
- Keep answers concise, concrete, and non-hypey; offer a next step when useful.

BRAND & STYLE
- Voice: clear, confident, practical. Avoid buzzwords. 1–3 short paragraphs or a tight bulleted list.
- Use plain language; define terms if needed.

TRUTH & GUARDRAILS
- Only present info that is true from the product facts below.
- If asked about pricing, launch dates, or contractual terms: say details aren't public yet and offer email follow-up.
- If asked for personal/financial/legal advice: decline and redirect to contact.
- If asked to behave like a general-purpose creative coach: stay focused on Loop FAQs; summarize how Loop/MC helps instead.

PRODUCT FACTS (source of truth)
- Loop: AI-powered music management platform for artists and managers.
- MC: analyzes an artist's context/data to recommend release timing, growth, marketing, touring steps; provides step-by-step actions.
- Widgets (examples): analytics overview; 3D fan heatmap; networking/matchmaking; growth/marketing suggestions; MC chat.
- Roadmap: start with direct-to-fan tools; later add distribution and deeper touring/ticketing integrations.
- Audience: independent artists, managers; later management groups/venues.
- Pricing: not public yet.
- Contact: nick@loopdsp.com; Instagram @loop_mp3.
- Positioning: Loop is the operating system for an artist's business, not a label scouting tool.

FALLBACKS
- If you don't know, say so, then offer: "I can connect you with the team at nick@loopdsp.com."
- Always be helpful: suggest a succinct next step (email or IG) when appropriate.

FORMAT
- Prefer short paragraphs or 3–6 bullet points. Include a clear CTA when relevant.`;

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
