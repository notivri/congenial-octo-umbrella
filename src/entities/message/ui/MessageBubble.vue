<template>
  <div class="message-wrapper" :class="role">
    <div class="message-row">
      <div :class="['message-bubble', role]">
        <div class="loading" v-if="!content && role === 'assistant'">
          <loadingIcon /> Thinking...
        </div>

        <MarkdownContent v-if="role === 'assistant'" :content="content" />
        <div v-else class="plain-content">{{ content }}</div>
      </div>
      <DeleteMessage :message-id="messageId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import DeleteMessage from '@/features/delete-message/ui/DeleteMessage.vue';
import MarkdownContent from '@/entities/message/ui/MarkdownContent.vue';
import loadingIcon from '@/shared/ui/loadingIcon.vue';
import type { Role } from '@/shared/types/chat';

defineProps<{
  messageId: string;
  role: Role;
  content: string;
}>();
</script>

<style scoped>
.message-wrapper {
  width: 100%;
  max-width: 720px;
  margin-bottom: 14px;
  display: flex;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-wrapper.assistant {
  justify-content: flex-start;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  max-width: 90%;
}

.message-wrapper.user .message-row {
  flex-direction: row-reverse;
}

.message-wrapper:hover :deep(.delete-message-btn) {
  opacity: 1;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.6;
  min-width: 0;
}

.message-bubble.user {
  background-color: var(--msg-user-bg);
  border: 1px solid var(--msg-user-border);
}

.message-bubble.assistant {
  background-color: var(--msg-assistant-bg);
  border: 1px solid var(--msg-assistant-border);
}

.plain-content {
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.loading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-style: italic;
  color: var(--text-secondary);
}
</style>
