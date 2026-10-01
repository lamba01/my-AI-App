const CONVERSATIONS_KEY = "chat:conversations";

export function getConversations() {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CONVERSATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveConversationMeta(id, title) {
  const conversations = getConversations();
  const existing = conversations.find((c) => c.id === id);
  if (existing) {
    existing.title = title;
    existing.updatedAt = Date.now();
  } else {
    conversations.unshift({ id, title, updatedAt: Date.now() });
  }
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function getMessages(id) {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(`chat:messages:${id}`);
  return raw ? JSON.parse(raw) : [];
}

export function saveMessages(id, messages) {
  localStorage.setItem(`chat:messages:${id}`, JSON.stringify(messages));
}

export function deleteConversation(id) {
  const conversations = getConversations().filter((c) => c.id !== id);
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  localStorage.removeItem(`chat:messages:${id}`);
}
