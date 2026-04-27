import express from "express";
import Groq from "groq-sdk";
import "dotenv/config";

const router = express.Router();
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// POST /api/claude/chat
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
    res.status(500).json({ error: err.message || "Failed to get response" });
  }
});

// POST /api/claude/stream
router.post("/stream", async (req, res) => {
  try {
    const { message } = req.body;

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Streaming error:", err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

export default router;