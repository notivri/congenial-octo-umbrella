import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Chat, Message } from '@/shared/types/chat';

const TITLE_MAX_LENGTH = 48;

export function titleFromMessage(text: string): string {
  const line = text.trim().replace(/\s+/g, ' ');
  if (!line) return 'New chat';
  if (line.length <= TITLE_MAX_LENGTH) return line;
  return `${line.slice(0, TITLE_MAX_LENGTH).trimEnd()}…`;
}

export const useChatStore = defineStore('chat', () => {
  const chats = ref<Chat[]>([]);
  const activeChatId = ref<string | null>(null);

  const savedChats = localStorage.getItem('llm-chats');
  if (savedChats) {
    chats.value = JSON.parse(savedChats);
  }

  watch(chats, (newChats) => {
    localStorage.setItem('llm-chats', JSON.stringify(newChats));
  }, { deep: true });

  const activeChat = computed(() =>
    chats.value.find(c => c.id === activeChatId.value) ?? null
  );

  const isWelcomeScreen = computed(
    () => !activeChat.value || activeChat.value.messages.length === 0
  );

  function startNewChat() {
    activeChatId.value = null;
  }

  function createChatFromPrompt(prompt: string): string {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: titleFromMessage(prompt),
      messages: [],
      createdAt: Date.now(),
    };
    chats.value.unshift(newChat);
    activeChatId.value = newChat.id;
    return newChat.id;
  }

  function setChatTitle(chatId: string, title: string) {
    const chat = chats.value.find(c => c.id === chatId);
    if (chat) chat.title = title;
  }

  function addMessage(chatId: string, message: Omit<Message, 'id'>) {
    const chat = chats.value.find(c => c.id === chatId);
    if (chat) {
      chat.messages.push({ ...message, id: crypto.randomUUID() });
    }
  }

  function updateLastMessage(chatId: string, chunk: string) {
    const chat = chats.value.find(c => c.id === chatId);
    if (chat && chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      if (lastMessage.role === 'assistant') {
        lastMessage.content += chunk;
      }
    }
  }

  function deleteMessage(chatId: string, messageId: string) {
    const chat = chats.value.find(c => c.id === chatId);
    if (chat) {
      chat.messages = chat.messages.filter(m => m.id !== messageId);
    }
  }

  function deleteChat(chatId: string) {
    const index = chats.value.findIndex(c => c.id === chatId);
    if (index === -1) return;

    chats.value.splice(index, 1);

    if (activeChatId.value === chatId) {
      activeChatId.value = null;
    }
  }

  return {
    chats,
    activeChatId,
    activeChat,
    isWelcomeScreen,
    startNewChat,
    createChatFromPrompt,
    setChatTitle,
    addMessage,
    updateLastMessage,
    deleteMessage,
    deleteChat,
  };
});
