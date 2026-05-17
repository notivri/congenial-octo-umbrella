<template>
  <div class="chat-page">
    <Transition name="backdrop">
      <button
        v-if="uiStore.mobileSidebarOpen"
        type="button"
        class="sidebar-backdrop"
        aria-label="Close sidebar"
        @click="uiStore.closeMobileSidebar"
      />
    </Transition>

    <Sidebar @navigate="uiStore.closeMobileSidebar" />

    <ChatWindow />
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/widgets/sidebar/ui/SideBar.vue';
import ChatWindow from '@/widgets/chat-window/ui/СhatWindow.vue';
import { useUiStore } from '@/entities/ui/store/uiStore';

const uiStore = useUiStore();
</script>

<style scoped>
.chat-page {
  display: flex;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  background: var(--bg-primary);
  position: relative;
}

.sidebar-backdrop {
  display: none;
}

@media (max-width: 768px) {
  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 90;
    background: rgba(0, 0, 0, 0.55);
    border: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .backdrop-enter-active,
  .backdrop-leave-active {
    transition: opacity 0.25s ease;
  }

  .backdrop-enter-from,
  .backdrop-leave-to {
    opacity: 0;
  }
}
</style>
