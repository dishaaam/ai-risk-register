import { useState, useRef, useEffect } from "react";
import { askGeneralQuestion } from "../services/aiService";

const SUGGESTED_QUESTIONS = [
  "What is a good risk score threshold?",
  "How do I prioritise security risks?",
  "What are common compliance risks?",
  "How often should risks be reviewed?",
];

const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {/* AI avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-0.5">
          🤖
        </div>
      )}
      <div
        className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-900 text-white rounded-tr-sm"
            : "bg-gray-100 text-gray-800 rounded-tl-sm"
        }`}
      >
        {msg.content}
        {msg.confidence && (
          <p className="text-xs mt-1.5 opacity-60">
            Confidence: {(msg.confidence * 100).toFixed(0)}%
          </p>
        )}
        {msg.error && (
          <p className="text-xs mt-1 text-red-300">{msg.error}</p>
        )}
      </div>
      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs ml-2 flex-shrink-0 mt-0.5">
          👤
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex justify-start mb-3">
    <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">
      🤖
    </div>
    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
  </div>
);

const AiPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm your AI Risk Assistant. Ask me anything about risk management, security, compliance, or your registered risks.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const question = text || input.trim();
    if (!question || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await askGeneralQuestion(question);
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer,
        confidence: data.confidence,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Sorry, I couldn't get a response right now. Please try again.",
        error: "Connection failed",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content: "Hi! I'm your AI Risk Assistant. Ask me anything about risk management, security, compliance, or your registered risks.",
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white text-2xl transition-all duration-300 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-0"
            : "bg-blue-900 hover:bg-blue-800"
        }`}
        title={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Unread dot — shows when panel is closed */}
      {!isOpen && (
        <div className="fixed bottom-16 right-6 z-50 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
      )}

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">

          {/* Panel Header */}
          <div className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <p className="text-sm font-bold">AI Risk Assistant</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <p className="text-xs text-blue-200">Online — LLaMA-3.3-70b</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="text-blue-200 hover:text-white text-xs transition"
                title="Clear chat"
              >
                🗑️ Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-blue-200 hover:text-white transition text-lg leading-none"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-white">

            {/* Messages */}
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {/* Typing indicator */}
            {loading && <TypingIndicator />}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && !loading && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <p className="text-xs text-gray-400 mb-2 font-medium">
                Suggested questions:
              </p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-left text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about risk management..."
                rows={1}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50"
                style={{ maxHeight: "80px" }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="bg-blue-900 text-white w-9 h-9 rounded-xl hover:bg-blue-800 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <span className="text-sm">➤</span>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AiPanel;