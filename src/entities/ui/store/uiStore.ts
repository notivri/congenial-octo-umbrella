import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

const MOBILE_BREAKPOINT = 768;

function isMobileViewport() {
  return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT;
}

export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(
    localStorage.getItem('llm-sidebar-collapsed') === 'true'
  );
  const mobileSidebarOpen = ref(false);

  watch(sidebarCollapsed, (value) => {
    localStorage.setItem('llm-sidebar-collapsed', String(value));
  });

  function toggleSidebar() {
    if (isMobileViewport()) {
      mobileSidebarOpen.value = !mobileSidebarOpen.value;
      return;
    }
    sidebarCollapsed.value = !sidebarCollapsed.value;
  }

  function openMobileSidebar() {
    mobileSidebarOpen.value = true;
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false;
  }

  function onViewportChange() {
    if (!isMobileViewport()) {
      mobileSidebarOpen.value = false;
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onViewportChange);
  }

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    toggleSidebar,
    openMobileSidebar,
    closeMobileSidebar,
  };
});
