import { useState } from "react";
import { Card, Input, Button, Typography, Alert, Badge, Space } from 'antd';
import { SendOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

export default function ClaudeChat() {
  const [inputText, setInputText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!inputText.trim()) return;

    setLoadingState(true);
    setReplyText("");
    setError(null);

    try {
      const response = await fetch("/api/claude/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });

      const responseData = await response.json();
      if (responseData.error) throw new Error(responseData.error);
      setReplyText(responseData.reply);

    } catch (err) {
      setError(err.message || "Connecting to server failed.");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <Card
      className="glass glass-hover h-full flex flex-col border-none rounded-[2rem] overflow-hidden shadow-2xl"
      styles={{ body: { padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' } }}
    >
      <div className="flex items-center justify-between mb-10">
        <Space size="middle">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <SafetyCertificateOutlined className="text-2xl text-blue-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white m-0">Standard Mode</h3>
            <Text className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">Optimized Response</Text>
          </div>
        </Space>
        <Badge status="processing" color="#10b981" text={<span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">Ready</span>} />
      </div>

      <TextArea
        rows={6}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="How can I assist you today?"
        className="mb-8 bg-slate-900/50 border-white/5 text-white placeholder:text-slate-600 rounded-3xl p-6 hover:border-blue-500/30 focus:border-blue-500/50 transition-all text-lg"
      />

      <Button
        type="primary"
        onClick={handleAsk}
        loading={loadingState}
        block
        size="large"
        icon={<SendOutlined />}
        className="h-16 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 border-none font-bold rounded-2xl shadow-xl shadow-blue-900/40 text-lg tracking-wide"
      >
        {loadingState ? "Thinking..." : "Get Answer"}
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <Text className="text-blue-400 font-bold uppercase tracking-widest text-[10px]">AI Assistant</Text>
          </div>
          <p className="text-slate-200 leading-[1.8] text-[1.05rem] m-0 whitespace-pre-wrap font-medium">{replyText}</p>
        </div>
      )}
    </Card>
  );
}