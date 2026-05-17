<template>
  <button
    type="button"
    class="delete-chat-btn"
    title="Delete chat"
    @click.stop="handleDelete"
  >
    ×
  </button>
</template>

<script setup lang="ts">
import { useChatStore } from '@/entities/chat/store/сhatStore';

const props = defineProps<{
  chatId: string;
}>();

const chatStore = useChatStore();

function handleDelete() {
  if (confirm('Delete this chat?')) {
    chatStore.deleteChat(props.chatId);
  }
}
</script>

<style scoped>
.delete-chat-btn {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease;
}

.delete-chat-btn:hover {
  background: var(--danger-dim);
  color: var(--danger);
}
</style>
