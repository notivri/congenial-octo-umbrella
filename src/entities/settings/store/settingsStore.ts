import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { ApiProvider } from '@/shared/types/settings';
import {
  API_ENDPOINTS,
  DEFAULT_LOCAL_API_URL,
} from '@/shared/types/settings';

const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant';

function loadString(key: string, fallback: string): string {
  return localStorage.getItem(key) ?? fallback;
}

export const useSettingsStore = defineStore('settings', () => {
  const userName = ref(loadString('llm-user-name', 'User'));
  const email = ref(loadString('llm-user-email', ''));
  const password = ref(loadString('llm-user-password', ''));

  const systemPrompt = ref(
    loadString('llm-system-prompt', DEFAULT_SYSTEM_PROMPT)
  );

  const storedProvider = localStorage.getItem('llm-api-provider') as ApiProvider | null;
  const apiProvider = ref<ApiProvider>(
    storedProvider && ['local', 'openai', 'gemini'].includes(storedProvider)
      ? storedProvider
      : 'local'
  );
  const apiKey = ref(loadString('llm-api-key', ''));
  const localApiUrl = ref(
    loadString('llm-local-api-url', DEFAULT_LOCAL_API_URL)
  );

  const apiEndpoint = computed(() => {
    if (apiProvider.value === 'local') {
      return localApiUrl.value.trim() || DEFAULT_LOCAL_API_URL;
    }
    return API_ENDPOINTS[apiProvider.value];
  });

  const apiAuthHeader = computed(() => {
    const key = apiKey.value.trim();
    if (key) return `Bearer ${key}`;
    if (apiProvider.value === 'local') return 'Bearer no-key';
    return '';
  });

  watch(userName, (v) => localStorage.setItem('llm-user-name', v));
  watch(email, (v) => localStorage.setItem('llm-user-email', v));
  watch(password, (v) => localStorage.setItem('llm-user-password', v));
  watch(systemPrompt, (v) => localStorage.setItem('llm-system-prompt', v));
  watch(apiProvider, (v) => localStorage.setItem('llm-api-provider', v));
  watch(apiKey, (v) => localStorage.setItem('llm-api-key', v));
  watch(localApiUrl, (v) => localStorage.setItem('llm-local-api-url', v));

  return {
    userName,
    email,
    password,
    systemPrompt,
    apiProvider,
    apiKey,
    localApiUrl,
    apiEndpoint,
    apiAuthHeader,
  };
});
