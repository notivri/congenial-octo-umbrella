<template>
  <button
    type="button"
    class="delete-message-btn"
    title="Delete message"
    @click="handleDelete"
  >
    ×
  </button>
</template>

<script setup lang="ts">
import { useChatStore } from '@/entities/chat/store/сhatStore';

const props = defineProps<{
  messageId: string;
}>();

const chatStore = useChatStore();

function handleDelete() {
  if (!chatStore.activeChatId) return;
  chatStore.deleteMessage(chatStore.activeChatId, props.messageId);
}
</script>

<style scoped>
.delete-message-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}

.delete-message-btn:hover {
  background: var(--danger-dim);
  color: var(--danger);
}
</style>
