// test-claude.js (Adapted for Groq)
import Groq from "groq-sdk";
import "dotenv/config";

// The SDK automatically reads GROQ_API_KEY from your environment
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

try {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: "Say hello and tell me one fun fact about space!"
      }
    ]
  });

  // Groq follows the OpenAI response structure
  console.log(response.choices[0].message.content);
} catch (error) {
  console.error("Error calling Groq:", error.message);
}
