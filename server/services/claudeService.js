import Groq from "groq-sdk";
import "dotenv/config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getChatResponse = async (message) => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "llama-3.3-70b-versatile",
  });
  return chatCompletion.choices[0].message.content;
};

export const getChatStream = async (message) => {
  return await groq.chat.completions.create({
    messages: [{ role: "user", content: message }],
    model: "llama-3.3-70b-versatile",
    stream: true,
  });
};