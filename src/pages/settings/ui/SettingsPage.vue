<template>
  <div class="settings-page">
    <header class="settings-topbar">
      <RouterLink to="/chat" class="back-link">← Chat</RouterLink>
      <h1>Settings</h1>
    </header>

    <div class="settings-layout">
      <nav class="settings-nav" aria-label="Settings sections">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="nav-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="nav-icon" aria-hidden="true">{{ tab.icon }}</span>
          <span class="nav-label">{{ tab.label }}</span>
        </button>
      </nav>

      <main class="settings-panel">
        <header class="panel-header">
          <h2>{{ activeTabMeta.label }}</h2>
          <p class="panel-desc">{{ activeTabMeta.description }}</p>
        </header>

        <!-- Profile -->
        <div v-show="activeTab === 'profile'" class="panel-content">
          <label class="field">
            <span>Display name</span>
            <input v-model="form.userName" type="text" placeholder="Your name" />
          </label>

          <label class="field">
            <span>Email</span>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              :class="{ invalid: errors.email }"
            />
            <span v-if="errors.email" class="error">{{ errors.email }}</span>
          </label>

          <label class="field">
            <span>New password</span>
            <input
              v-model="form.password"
              type="password"
              placeholder="Leave blank to keep current"
              autocomplete="new-password"
            />
          </label>

          <label class="field">
            <span>Confirm password</span>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Repeat new password"
              :class="{ invalid: errors.password }"
            />
            <span v-if="errors.password" class="error">{{ errors.password }}</span>
          </label>

          <p class="hint">Profile data is stored locally in your browser only.</p>
        </div>

        <!-- General -->
        <div v-show="activeTab === 'general'" class="panel-content">
          <label class="field">
            <span>System prompt</span>
            <textarea
              v-model="form.systemPrompt"
              rows="12"
              placeholder="Instructions for the model..."
            />
            <p class="hint">Sent as the system message on every completion request.</p>
          </label>
        </div>

        <!-- API -->
        <div v-show="activeTab === 'api'" class="panel-content">
          <div class="field">
            <span>Provider</span>
            <div class="provider-options">
              <label
                v-for="(label, key) in API_PROVIDER_LABELS"
                :key="key"
                class="provider-option"
                :class="{ active: form.apiProvider === key }"
              >
                <input
                  v-model="form.apiProvider"
                  type="radio"
                  :value="key"
                  class="sr-only"
                />
                {{ label }}
              </label>
            </div>
          </div>

          <label v-if="form.apiProvider === 'local'" class="field">
            <span>Local API URL</span>
            <input
              v-model="form.localApiUrl"
              type="url"
              placeholder="http://127.0.0.1:8080/v1/chat/completions"
              :class="{ invalid: errors.localApiUrl }"
            />
            <span v-if="errors.localApiUrl" class="error">{{ errors.localApiUrl }}</span>
            <p class="hint">Your llama.cpp or other OpenAI-compatible local server.</p>
          </label>

          <p v-else class="endpoint-hint">
            Using built-in endpoint for <strong>{{ API_PROVIDER_LABELS[form.apiProvider] }}</strong>
            <span class="masked">(URL hidden)</span>
          </p>

          <label class="field">
            <span>API key</span>
            <input
              v-model="form.apiKey"
              type="password"
              placeholder="sk-... or your provider key"
              autocomplete="off"
              :class="{ invalid: errors.apiKey }"
            />
            <span v-if="errors.apiKey" class="error">{{ errors.apiKey }}</span>
            <p class="hint">
              Required for OpenAI and Gemini. Optional for local servers that accept any key.
            </p>
          </label>
        </div>

        <p v-if="saveError" class="save-error">{{ saveError }}</p>

        <div class="panel-actions">
          <button type="button" class="btn-primary" @click="save">Save</button>
          <RouterLink to="/chat" class="btn-secondary">Cancel</RouterLink>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '@/entities/settings/store/settingsStore';
import {
  API_PROVIDER_LABELS,
  type ApiProvider,
} from '@/shared/types/settings';

type SettingsTab = 'profile' | 'general' | 'api';

const tabs: Array<{ id: SettingsTab; label: string; icon: string; description: string }> = [
  {
    id: 'profile',
    label: 'Profile',
    icon: '◎',
    description: 'Your account details stored on this device.',
  },
  {
    id: 'general',
    label: 'General',
    icon: '◇',
    description: 'Default behavior and instructions for the model.',
  },
  {
    id: 'api',
    label: 'API',
    icon: '⬡',
    description: 'Connection to your local or cloud LLM provider.',
  },
];

const router = useRouter();
const settingsStore = useSettingsStore();
const activeTab = ref<SettingsTab>('profile');

const activeTabMeta = computed(
  () => tabs.find(t => t.id === activeTab.value) ?? tabs[0]
);

const form = reactive({
  userName: settingsStore.userName,
  email: settingsStore.email,
  password: '',
  confirmPassword: '',
  systemPrompt: settingsStore.systemPrompt,
  apiProvider: settingsStore.apiProvider as ApiProvider,
  apiKey: settingsStore.apiKey,
  localApiUrl: settingsStore.localApiUrl,
});

const errors = reactive({
  email: '',
  password: '',
  apiKey: '',
  localApiUrl: '',
});

const saveError = ref('');

function validate(): boolean {
  errors.email = '';
  errors.password = '';
  errors.apiKey = '';
  errors.localApiUrl = '';

  if (activeTab.value === 'profile' || activeTab.value === 'general' || activeTab.value === 'api') {
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (form.password || form.confirmPassword) {
      if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      } else if (form.password !== form.confirmPassword) {
        errors.password = 'Passwords do not match';
      }
    }
  }

  if (form.apiProvider === 'local') {
    try {
      new URL(form.localApiUrl);
    } catch {
      errors.localApiUrl = 'Enter a valid URL';
    }
  } else if (!form.apiKey.trim()) {
    errors.apiKey = 'API key is required for this provider';
  }

  return !errors.email && !errors.password && !errors.apiKey && !errors.localApiUrl;
}

function save() {
  saveError.value = '';
  if (!validate()) {
    saveError.value = 'Please fix the errors above';
    if (errors.apiKey || errors.localApiUrl) activeTab.value = 'api';
    else if (errors.email || errors.password) activeTab.value = 'profile';
    return;
  }

  settingsStore.userName = form.userName.trim() || 'User';
  settingsStore.email = form.email.trim();
  settingsStore.systemPrompt = form.systemPrompt;
  settingsStore.apiProvider = form.apiProvider;
  settingsStore.apiKey = form.apiKey;
  settingsStore.localApiUrl = form.localApiUrl.trim();

  if (form.password) {
    settingsStore.password = form.password;
  }

  router.push('/chat');
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
}

.settings-topbar {
  flex-shrink: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-link {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.back-link:hover {
  color: var(--accent-color);
}

.settings-topbar h1 {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 600;
}

.settings-layout {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
}

.settings-nav {
  width: 220px;
  flex-shrink: 0;
  padding: 16px 12px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-dim);
  color: var(--accent-color);
}

.nav-icon {
  width: 20px;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.85;
}

.settings-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.panel-header {
  flex-shrink: 0;
  padding: 24px 32px 0;
}

.panel-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.panel-desc {
  margin-top: 6px;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
}

.panel-actions {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  padding: 16px 32px 24px;
  border-top: 1px solid var(--border-color);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field > span {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.field input,
.field textarea {
  padding: 10px 12px;
  font-size: 0.95rem;
  resize: vertical;
}

.field input.invalid {
  border-color: var(--danger);
}

.field textarea {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  min-height: 200px;
}

.hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.error {
  font-size: 0.75rem;
  color: var(--danger);
}

.provider-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.provider-option {
  padding: 8px 14px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.provider-option:hover {
  border-color: var(--text-muted);
}

.provider-option.active {
  border-color: var(--accent-color);
  background: var(--accent-dim);
  color: var(--accent-color);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.endpoint-hint {
  font-size: 0.85rem;
  color: var(--text-secondary);
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.endpoint-hint strong {
  color: var(--text-primary);
}

.masked {
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.save-error {
  padding: 0 32px;
  color: var(--danger);
  font-size: 0.85rem;
}

.btn-primary {
  padding: 10px 20px;
  background: var(--accent-color);
  color: #0f0f0f;
  border-radius: var(--radius);
  font-weight: 600;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.btn-secondary {
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
}

.btn-secondary:hover {
  border-color: var(--text-muted);
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .settings-layout {
    flex-direction: column;
  }

  .settings-nav {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    padding: 10px 12px;
    gap: 6px;
  }

  .nav-item {
    flex-shrink: 0;
    padding: 8px 14px;
  }

  .nav-label {
    white-space: nowrap;
  }

  .panel-header {
    padding: 16px 16px 0;
  }

  .panel-content {
    padding: 16px;
    max-width: none;
  }

  .panel-actions {
    padding: 12px 16px 20px;
  }

  .save-error {
    padding: 0 16px;
  }
}
</style>
