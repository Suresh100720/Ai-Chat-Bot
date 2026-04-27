# AI Chat App (Groq Powered)

A full-stack application with a React frontend and Node.js backend to interact with the Groq API (using Llama 3.3).

## Project Structure

```text
ai-chat-app/
├── server/                    # Backend (Node.js + Express)
│   ├── routes/                # Express routes
│   │   └── claude.js          # Main AI endpoint (Groq powered)
│   ├── services/              # Business logic & AI interaction
│   │   └── claudeService.js   # Logic using Groq SDK
│   ├── .env                   # API Keys (Add GROQ_API_KEY here)
│   ├── server.js              # Server entry point
│   └── package.json
│
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClaudeChat.jsx
│   │   │   └── ClaudeChatStreaming.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Setup

### Backend
1. `cd server`
2. `npm install`
3. Add `GROQ_API_KEY` to `server/.env`
4. `npm start`

### Frontend
1. `cd client`
2. `npm install`
3. `npm run dev`

## Testing
You can verify your Groq API key by running the standalone test script from the server folder:
```bash
cd server
node test-claude.js
```
