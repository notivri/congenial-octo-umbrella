<template>
  <div ref="root" class="user-menu" :class="{ minimal }">
    <button
      type="button"
      class="user-trigger"
      :title="settingsStore.userName"
      @click.stop="toggleOpen"
    >
      <span class="avatar">{{ initials }}</span>
      <template v-if="!minimal">
        <span class="user-name">{{ settingsStore.userName }}</span>
        <span class="chevron" :class="{ open: isOpen }">▾</span>
      </template>
    </button>

    <Transition name="popout">
      <div v-if="isOpen" class="popout" :class="{ 'popout-minimal': minimal }">
        <RouterLink to="/settings" class="popout-item" @click="close">
          <span class="popout-icon">⚙</span>
          Settings
        </RouterLink>
        <RouterLink to="/login" class="popout-item danger" @click="close">
          <span class="popout-icon">↪</span>
          Log out
        </RouterLink>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useSettingsStore } from '@/entities/settings/store/settingsStore';

defineProps<{
  minimal?: boolean;
}>();

const settingsStore = useSettingsStore();
const isOpen = ref(false);
const root = ref<HTMLElement | null>(null);

const initials = computed(() => {
  const name = settingsStore.userName.trim();
  if (!name) return '?';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
});

function toggleOpen() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) {
    close();
  }
}

onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));
</script>

<style scoped>
.user-menu {
  position: relative;
}

.user-menu.minimal {
  display: flex;
  justify-content: center;
}

.user-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius);
  color: var(--text-secondary);
}

.user-menu.minimal .user-trigger {
  width: auto;
  padding: 4px;
}

.user-trigger:hover {
  background: var(--bg-elevated);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-color), #8b5a2b);
  color: #0f0f0f;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  flex: 1;
  text-align: left;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chevron {
  font-size: 0.65rem;
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.popout {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  z-index: 30;
  min-width: 160px;
}

.popout.popout-minimal {
  left: calc(100% + 8px);
  bottom: 0;
  right: auto;
}

.popout-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.popout-item:hover {
  background: var(--bg-input);
  color: var(--text-primary);
}

.popout-item.danger:hover {
  color: var(--danger);
  background: var(--danger-dim);
}

.popout-icon {
  width: 18px;
  text-align: center;
  opacity: 0.7;
}

.popout-enter-active,
.popout-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.popout-enter-from,
.popout-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.popout-minimal.popout-enter-from,
.popout-minimal.popout-leave-to {
  transform: translateX(-6px);
}
</style>
