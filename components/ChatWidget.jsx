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

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{ padding: "16px 24px", gap: "16px" }}
        className="fixed bottom-6 right-6 z-40 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md shadow-lg flex items-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="text-base font-medium whitespace-nowrap">Chat with RG</span>
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-96 h-[580px] bg-neutral-900 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">RG</span>
              </div>
              <div>
                <h2 className="text-white font-bold">Chat with RG</h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500"></span>
                  <span className="text-green-500 text-xs">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {messages.length === 0 && !loading && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">RG</span>
                  </div>
                  <span className="text-zinc-400 text-xs">RG Mazon</span>
                </div>
                <div className="ml-9 border-l-2 border-cyan-500 bg-zinc-800 px-5 py-4">
                  <p className="text-white text-sm leading-relaxed">
                    Hi there! 👋 Thanks for visiting my website. Feel free to ask me anything about programming, web development, or my experiences in tech. Let me know how I can help!
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="mb-6">
                {msg.role === "ai" ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">RG</span>
                      </div>
                      <span className="text-zinc-400 text-xs">RG Mazon</span>
                    </div>
                    <div className="ml-9 border-l-2 border-cyan-500 bg-zinc-800 px-5 py-4">
                      <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 px-5 py-4 max-w-[80%]">
                      <p className="text-white text-sm">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">RG</span>
                  </div>
                  <span className="text-zinc-400 text-xs">RG Mazon</span>
                </div>
                <div className="ml-9 border-l-2 border-cyan-500 bg-zinc-800 px-5 py-4 flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-zinc-400 text-sm">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-5 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 1000))}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                maxLength={1000}
                className="flex-1 bg-transparent text-white placeholder-zinc-500 text-sm px-4 py-3 border border-zinc-600 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-10 h-10 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-xs">Ask me about programming, web dev, or tech!</span>
              <span className="text-zinc-500 text-xs">{input.length}/1000</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}