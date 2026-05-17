<template>
  <div class="composer" :class="{ centered, large: centered }">
    <div class="composer-box">
      <textarea
        ref="textareaRef"
        v-model="text"
        rows="1"
        placeholder="Type a message..."
        :disabled="isGenerating"
        @input="autoResize"
        @keydown.enter.exact.prevent="handleSend"
      />
      <div class="composer-actions">
        <button
          type="button"
          class="send-btn"
          :disabled="!text.trim() || isGenerating"
          title="Send"
          @click="handleSend"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useChatStore, titleFromMessage } from '@/entities/chat/store/сhatStore';
import { useSettingsStore } from '@/entities/settings/store/settingsStore';
import { streamLlmResponse, buildApiMessages } from '@/shared/api/llm';

defineProps<{
  centered?: boolean;
}>();

const text = ref('');
const isGenerating = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const chatStore = useChatStore();
const settingsStore = useSettingsStore();

watch(text, () => autoResize());

function autoResize() {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = 'auto';
  const max = el.closest('.composer.large') ? 220 : 200;
  el.style.height = `${Math.min(el.scrollHeight, max)}px`;
}

async function handleSend() {
  if (!text.value.trim()) return;

  const prompt = text.value.trim();
  text.value = '';
  autoResize();

  let chatId = chatStore.activeChatId;

  if (!chatId) {
    chatId = chatStore.createChatFromPrompt(prompt);
  } else if (chatStore.isWelcomeScreen) {
    chatStore.setChatTitle(chatId, titleFromMessage(prompt));
  }

  chatStore.addMessage(chatId, { role: 'user', content: prompt });
  chatStore.addMessage(chatId, { role: 'assistant', content: '' });

  isGenerating.value = true;

  try {
    const chat = chatStore.chats.find(c => c.id === chatId);
    if (!chat) return;

    const history = chat.messages.slice(0, -1);
    const apiMessages = buildApiMessages(
      settingsStore.systemPrompt,
      history,
      settingsStore.userName
    );

    const stream = streamLlmResponse(apiMessages, {
      endpoint: settingsStore.apiEndpoint,
      apiKey: settingsStore.apiKey,
      provider: settingsStore.apiProvider,
    });
    for await (const chunk of stream) {
      chatStore.updateLastMessage(chatId, chunk);
    }
  } catch (error) {
    console.error('Generation error:', error);
    chatStore.updateLastMessage(chatId, '\n[Network or model error]');
  } finally {
    isGenerating.value = false;
  }
}
</script>

<style scoped>
.composer {
  width: 100%;
  transition: max-width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.composer.centered {
  max-width: 100%;
}

.composer:not(.centered) {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px 24px;
  box-sizing: border-box;
}

.composer-box {
  position: relative;
  background: var(--bg-elevated);
  border: 1px solid #2e2e2e;
  border-radius: 28px;
  padding: 20px 60px 20px 24px;
  min-height: 56px;
  transition:
    border-radius 0.45s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.45s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.45s cubic-bezier(0.4, 0, 0.2, 1),
    min-height 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.composer.large .composer-box {
  padding: 22px 64px 22px 26px;
  min-height: 72px;
  border-radius: 32px;
}

.composer-box:focus-within {
  border-color: #404040;
  box-shadow: 0 0 0 1px #2a2a2a, 0 16px 48px rgba(0, 0, 0, 0.45);
}

textarea {
  width: 30vh;
  resize: none;
  border: none;
  background: transparent;
  padding: 0;
  font-size: 1.05rem;
  line-height: 1.55;
  min-height: 28px;
  max-height: 200px;
  color: var(--text-primary);
  display: block;
}

.composer.large textarea {
  min-height: 32px;
  max-height: 220px;
  font-size: 1.1rem;
}

textarea:focus {
  outline: none;
  box-shadow: none;
}

.composer-actions {
  position: absolute;
  right: 14px;
  bottom: 14px;
}

.composer.large .composer-actions {
  right: 16px;
  bottom: 16px;
}

.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #d4d4d4;
  color: #141414;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
}

.composer.large .send-btn {
  width: 40px;
  height: 40px;
}

.send-btn:hover:not(:disabled) {
  background: #ffffff;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .composer:not(.centered) {
    padding: 0 12px 16px;
  }

  .composer.large .composer-box {
    min-height: 64px;
    padding: 18px 58px 18px 20px;
  }
}
</style>
