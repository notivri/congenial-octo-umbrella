import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/pages/login/ui/LoginPage.vue';
import ChatPage from '@/pages/chat/ui/СhatPage.vue';
import SettingsPage from '@/pages/settings/ui/SettingsPage.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/chat', name: 'chat', component: ChatPage },
    { path: '/settings', name: 'settings', component: SettingsPage },
  ],
});
