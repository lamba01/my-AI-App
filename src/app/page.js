"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import {
  getConversations,
  saveConversationMeta,
  getMessages,
  saveMessages,
} from "../lib/chatStorage";

export default function ChatWrapper() {
  const [conversations, setConversations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [conversationId, setConversationId] = useState(() => {
    const list = getConversations();
    return list[0]?.id ?? crypto.randomUUID();
  });

  const startNewConversation = () => {
    const id = crypto.randomUUID();
    setConversationId(id);
    setConversations(getConversations());
    setSidebarOpen(false);
  };

  const selectConversation = (id) => {
    setConversationId(id);
    setSidebarOpen(false);
  };

  if (!conversationId) return null;

  return (
    <div className="flex h-dvh relative">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-56 border-r border-zinc-200 dark:border-zinc-800 p-3 space-y-2 overflow-y-auto bg-zinc-50 dark:bg-zinc-950 transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <button
          onClick={startNewConversation}
          className="w-full text-sm text-left px-3 py-2 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          + New conversation
        </button>
        {conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => selectConversation(c.id)}
            className={`w-full text-sm text-left px-3 py-2 rounded-lg truncate ${
              c.id === conversationId
                ? "bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:text-zinc-200"
            }`}
          >
            {c.title || "New conversation"}
          </button>
        ))}
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open conversations"
            className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-zinc-700 dark:text-zinc-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate">
            {conversations.find((c) => c.id === conversationId)?.title ||
              "New conversation"}
          </span>
        </div>

        <Chat
          key={conversationId}
          conversationId={conversationId}
          onMessagesChange={() => setConversations(getConversations())}
        />
      </div>
    </div>
  );
}

function Chat({ conversationId, onMessagesChange }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat({
    id: conversationId,
    messages: getMessages(conversationId),
  });

  useEffect(() => {
    if (messages.length === 0) return;
    saveMessages(conversationId, messages);

    const firstUserMsg = messages.find((m) => m.role === "user");
    const titlePart = firstUserMsg?.parts.find((p) => p.type === "text");
    if (titlePart) {
      saveConversationMeta(conversationId, titlePart.text.slice(0, 40));
      onMessagesChange();
    }
  }, [messages, conversationId, onMessagesChange]);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-zinc-950">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white text-zinc-800 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800"
              }`}
            >
              {message.parts.map((part, i) =>
                part.type === "text" ? (
                  <div key={i} className="whitespace-pre-wrap">
                    {part.text}
                  </div>
                ) : null,
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="p-4 border-t border-zinc-200"
      >
        <input
          className="w-full rounded-full dark:text-white border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
          value={input}
          placeholder="Ask something..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
