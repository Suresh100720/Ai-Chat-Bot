import express from "express";
import Groq from "groq-sdk";
import "dotenv/config";

const router = express.Router();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// POST /api/claude/chat (Now powered by Groq)
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }]
    });

    res.json({
      reply: response.choices[0].message.content
    });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: "Failed to get response" });
  }
});

export default router;