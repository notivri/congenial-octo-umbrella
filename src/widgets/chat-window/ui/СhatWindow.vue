<template>
  <div class="chat-window">
    <header
      v-if="!chatStore.isWelcomeScreen"
      class="chat-topbar"
    >
      <button
        type="button"
        class="mobile-menu-btn"
        aria-label="Open menu"
        @click="uiStore.openMobileSidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
        </svg>
      </button>
      <span class="chat-header-title">{{ chatStore.activeChat?.title ?? 'Chat' }}</span>
    </header>

    <header v-else class="chat-topbar chat-topbar--minimal">
      <button
        type="button"
        class="mobile-menu-btn mobile-menu-btn--visible"
        aria-label="Open menu"
        @click="uiStore.openMobileSidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" />
        </svg>
      </button>
    </header>

    <div
      class="chat-body"
      :class="{
        'is-welcome': chatStore.isWelcomeScreen,
        'has-messages': !chatStore.isWelcomeScreen,
      }"
    >
      <Transition name="messages-fade">
        <div
          v-if="!chatStore.isWelcomeScreen"
          ref="messagesContainer"
          class="messages"
        >
          <MessageBubble
            v-for="msg in chatStore.activeChat!.messages"
            :key="msg.id"
            :message-id="msg.id"
            :role="msg.role"
            :content="msg.content || ''"
          />
        </div>
      </Transition>

      <div class="welcome-center">
        <Transition name="greeting">
          <div v-if="chatStore.isWelcomeScreen" class="greeting">
            <h1 class="greeting-title">Hello there</h1>
            <p class="greeting-sub">Type a message to get started</p>
          </div>
        </Transition>

        <SendMessage
          :centered="chatStore.isWelcomeScreen"
          class="composer-widget"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useChatStore } from '@/entities/chat/store/сhatStore';
import { useUiStore } from '@/entities/ui/store/uiStore';
import MessageBubble from '@/entities/message/ui/MessageBubble.vue';
import SendMessage from '@/features/send-message/ui/SendMessage.vue';

const chatStore = useChatStore();
const uiStore = useUiStore();
const messagesContainer = ref<HTMLElement | null>(null);

watch(
  () => chatStore.activeChat?.messages.map(m => m.content).join(''),
  async () => {
    await nextTick();
    const el = messagesContainer.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
);
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-width: 0;
  background: var(--bg-primary);
  overflow: hidden;
}

.chat-topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
  min-height: 48px;
}

.chat-topbar--minimal {
  border-bottom-color: transparent;
  background: transparent;
  min-height: 44px;
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.mobile-menu-btn--visible {
  display: flex;
}

.mobile-menu-btn:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.chat-header-title {
  font-size: 0.9rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.chat-body.is-welcome {
  justify-content: center;
  align-items: center;
}

.chat-body.has-messages {
  justify-content: flex-start;
}

.welcome-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 24px;
  gap: 32px;
  box-sizing: border-box;
}

.chat-body.has-messages .welcome-center {
  max-width: none;
  width: 100%;
  padding: 0;
  gap: 0;
  flex: 0 0 auto;
  justify-content: flex-end;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.composer-widget {
  width: 100%;
  display: flex;
  justify-content: center;
}

.greeting {
  text-align: center;
  width: 100%;
}

.greeting-title {
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.greeting-sub {
  margin-top: 12px;
  font-size: clamp(0.95rem, 2.5vw, 1.05rem);
  color: var(--text-muted);
  line-height: 1.5;
}

.greeting-enter-active,
.greeting-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.greeting-enter-from,
.greeting-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.messages-fade-enter-active {
  transition: opacity 0.4s ease 0.1s;
}

.messages-fade-leave-active {
  transition: opacity 0.25s ease;
}

.messages-fade-enter-from,
.messages-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .mobile-menu-btn,
  .mobile-menu-btn--visible {
    display: flex;
  }

  .chat-topbar,
  .chat-topbar--minimal {
    padding: 10px 12px;
  }

  .welcome-center {
    padding: 16px;
    gap: 24px;
  }

  .messages {
    padding: 16px 12px 12px;
  }
}
</style>
