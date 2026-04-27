import { useState } from "react";
import { Card, Input, Button, Typography, Alert, Badge, Space } from 'antd';
import { ThunderboltOutlined, RocketOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

export default function ClaudeChatStreaming() {
  const [inputText, setInputText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!inputText.trim()) return;

    setIsStreaming(true);
    setReplyText("");
    setError(null);

    try {
      const response = await fetch("/api/claude/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

      if (!response.ok) throw new Error("Failed to connect to stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value);
        const lines = chunkText.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.replace("data: ", "");
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError(parsed.error);
              break;
            }
            setReplyText(prev => prev + parsed.chunk);
          } catch (e) {
            console.error("Error parsing stream chunk", e);
          }
        }
      }

    } catch (err) {
      setError(err.message || "Streaming failed.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <Card 
      className="glass glass-hover h-full flex flex-col border-none rounded-[2rem] overflow-hidden shadow-2xl"
      styles={{ body: { padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' } }}
    >
      <div className="flex items-center justify-between mb-10">
        <Space size="middle">
          <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
            <RocketOutlined className="text-2xl text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white m-0">Streaming Mode</h3>
            <Text className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">Real-Time Sync</Text>
          </div>
        </Space>
        <Badge status="processing" color="#a855f7" text={<span className="text-purple-400 text-[10px] font-black uppercase tracking-wider">Live</span>} />
      </div>

      <TextArea
        rows={6}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type to start streaming..."
        className="mb-8 bg-slate-900/50 border-white/5 text-white placeholder:text-slate-600 rounded-3xl p-6 hover:border-purple-500/30 focus:border-purple-500/50 transition-all text-lg"
      />

      <Button 
        type="primary" 
        onClick={handleAsk} 
        loading={isStreaming}
        block
        size="large"
        icon={<ThunderboltOutlined />}
        className="h-16 bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-500 hover:to-fuchsia-600 border-none font-bold rounded-2xl shadow-xl shadow-purple-900/40 text-lg tracking-wide"
      >
        {isStreaming ? "Streaming..." : "Get Answer"}
      </Button>

      {error && (
        <Alert 
          message={error} 
          type="error" 
          showIcon 
          className="mt-8 bg-red-950/30 border-red-500/20 text-red-300 rounded-2xl"
        />
      )}

      {replyText && (
        <div className="mt-10 p-8 rounded-3xl bg-slate-900/80 border border-white/5 flex-grow relative overflow-auto shadow-inner">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse"></div>
              <Text className="text-purple-400 font-bold uppercase tracking-widest text-[10px]">AI Assistant</Text>
            </div>
            {isStreaming && <span className="text-[9px] text-purple-500 font-black uppercase tracking-widest animate-pulse">Receiving...</span>}
          </div>
          <p className="text-slate-200 leading-[1.8] text-[1.05rem] m-0 whitespace-pre-wrap font-medium">
            {replyText}
            {isStreaming && <span className="typing-cursor"></span>}
          </p>
        </div>
      )}
    </Card>
  );
}