<template>
  <aside
    class="sidebar"
    :class="{
      collapsed: uiStore.sidebarCollapsed && !isMobile,
      'mobile-open': uiStore.mobileSidebarOpen,
    }"
  >
    <!-- Minimal (icon-only) — desktop only -->
    <template v-if="uiStore.sidebarCollapsed && !isMobile">
      <div class="sidebar-minimal">
        <button
          type="button"
          class="icon-btn"
          title="Expand sidebar"
          @click="uiStore.toggleSidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <button type="button" class="icon-btn" title="New chat" @click="onNewChat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" stroke-linecap="round" />
          </svg>
        </button>

        <div class="minimal-spacer" />

        <UserMenu minimal />
      </div>
    </template>

    <!-- Full sidebar -->
    <template v-else>
      <div class="sidebar-header">
        <button
          type="button"
          class="icon-btn"
          :title="isMobile ? 'Close sidebar' : 'Collapse sidebar'"
          @click="onToggle"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path
              v-if="isMobile"
              d="M18 6L6 18M6 6l12 12"
              stroke-linecap="round"
            />
            <path
              v-else
              d="M15 18l-6-6 6-6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <button type="button" class="create-btn" @click="onNewChat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14" stroke-linecap="round" />
        </svg>
        New chat
      </button>

      <div class="chat-list">
        <div
          v-for="chat in chatStore.chats"
          :key="chat.id"
          class="chat-item"
          :class="{ active: chat.id === chatStore.activeChatId && !chatStore.isWelcomeScreen }"
          @click="onSelectChat(chat.id)"
        >
          <span class="chat-title">{{ chat.title }}</span>
          <DeleteChat :chat-id="chat.id" />
        </div>
      </div>

      <footer class="sidebar-footer">
        <UserMenu />
      </footer>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useChatStore } from '@/entities/chat/store/сhatStore';
import { useUiStore } from '@/entities/ui/store/uiStore';
import DeleteChat from '@/features/delete-chat/ui/DeleteChat.vue';
import UserMenu from '@/features/user-menu/ui/UserMenu.vue';

const emit = defineEmits<{
  navigate: [];
}>();

const chatStore = useChatStore();
const uiStore = useUiStore();
const isMobile = ref(false);

const MOBILE_BREAKPOINT = 768;

function checkMobile() {
  isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
}

function onToggle() {
  if (isMobile.value) {
    uiStore.closeMobileSidebar();
  } else {
    uiStore.toggleSidebar();
  }
}

function onNewChat() {
  chatStore.startNewChat();
  emit('navigate');
}

function onSelectChat(id: string) {
  chatStore.activeChatId = id;
  emit('navigate');
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border-sidebar);
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  transition:
    width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  z-index: 100;
}

.sidebar.collapsed {
  width: 52px;
  min-width: 52px;
}

.sidebar-minimal {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 12px 0;
  gap: 8px;
}

.minimal-spacer {
  flex: 1;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 12px;
  border-bottom: 1px solid var(--border-sidebar);
}

.icon-btn {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-secondary);
}

.icon-btn:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.create-btn {
  margin: 10px 12px;
  padding: 10px 12px;
  border: 1px dashed var(--border-sidebar);
  border-radius: var(--radius);
  color: var(--text-secondary);
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.create-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: var(--accent-dim);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 8px 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: var(--radius);
  margin-bottom: 2px;
}

.chat-item:hover :deep(.delete-chat-btn),
.chat-item.active :deep(.delete-chat-btn) {
  opacity: 1;
}

.chat-item.active,
.chat-item:hover {
  background-color: var(--bg-elevated);
}

.chat-title {
  flex: 1;
  font-size: 0.85rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item.active .chat-title {
  color: var(--text-primary);
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--border-sidebar);
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: min(280px, 85vw);
    min-width: unset;
    transform: translateX(-100%);
    box-shadow: none;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 8px 0 32px rgba(0, 0, 0, 0.45);
  }

  .sidebar.collapsed {
    width: min(280px, 85vw);
    min-width: unset;
  }
}
</style>
