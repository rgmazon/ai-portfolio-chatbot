"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          token: process.env.NEXT_PUBLIC_CHAT_SECRET_TOKEN,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("API Error:", res.status, data);
      }
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Oops — something went wrong." },
      ]);
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

  const charCount = input.length;
  const maxChars = 1000;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 shadow-lg font-medium text-sm transition-all duration-200 border border-gray-200"
      >
        <svg className="inline-block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat with RG
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-gray-900 shadow-2xl border border-gray-800 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                RG
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-semibold text-sm">Chat with RG</h2>
                <p className="text-xs text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-16">
                <p className="text-sm">Start a conversation with RG's AI assistant</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-600 animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-600 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-gray-800 bg-gray-950">
            <div className="flex items-end gap-3 mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  if (e.target.value.length <= maxChars) {
                    setInput(e.target.value);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-4 py-3 transition-colors text-sm font-medium flex items-center justify-center flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-2.965 5.951 2.965a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </button>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 px-1">
              <p>Ask about programming, web dev, or tech!</p>
              <p>{charCount}/{maxChars}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}