import { ConfigProvider, theme, Row, Col } from 'antd';
import ClaudeChat from "./components/ClaudeChat";
import ClaudeChatStreaming from "./components/ClaudeChatStreaming";

export default function App() {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div className="min-h-screen flex flex-col bg-[#020617]">
        <main className="flex-grow p-6 md:p-12 max-w-[1600px] mx-auto w-full">
          <Row gutter={[32, 32]} className="h-full">
            <Col xs={24} lg={12}>
              <ClaudeChat />
            </Col>
            <Col xs={24} lg={12}>
              <ClaudeChatStreaming />
            </Col>
          </Row>
        </main>
      </div>
    </ConfigProvider>
  );
}
