"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col h-dvh max-w-2xl mx-auto bg-zinc-50 dark:bg-zinc-950">
      <header className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          AI Assistant
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600 text-center pt-12">
            Ask something to get started.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-white text-zinc-800 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800"
              }`}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="whitespace-pre-wrap"
                      >
                        {part.text}
                      </div>
                    );
                  case "tool-weather":
                  case "tool-convertFahrenheitToCelsius":
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="mt-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2 font-mono text-xs text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="block text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-500 mb-1">
                          {part.type.replace("tool-", "")}
                        </span>
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(part, null, 2)}
                        </pre>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
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
        className="p-4 border-t border-zinc-200 dark:border-zinc-800"
      >
        <input
          className="w-full rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          value={input}
          placeholder="Feel free to chat"
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
