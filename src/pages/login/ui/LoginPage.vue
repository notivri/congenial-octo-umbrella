<template>
  <div class="login-page">
    <div class="login-card">
      <form class="login-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>Email</span>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            :class="{ invalid: touched.email && errors.email }"
          />
          <span v-if="touched.email && errors.email" class="error">{{ errors.email }}</span>
        </label>

        <label class="field">
          <span>Password</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="••••••••"
            :class="{ invalid: touched.password && errors.password }"
          />
          <span v-if="touched.password && errors.password" class="error">{{ errors.password }}</span>
        </label>

        <label v-if="mode === 'signup'" class="field">
          <span>Confirm password</span>
          <input
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="••••••••"
            :class="{ invalid: touched.confirmPassword && errors.confirmPassword }"
          />
          <span v-if="touched.confirmPassword && errors.confirmPassword" class="error">
            {{ errors.confirmPassword }}
          </span>
        </label>

        <button type="submit" class="btn-primary">
          {{ mode === 'login' ? 'Log in' : 'Sign up' }}
        </button>
      </form>

      <div class="login-footer">
        <button type="button" class="btn-link" @click="toggleMode">
          {{ mode === 'login' ? 'Create an account' : 'Already have an account?' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const mode = ref<'login' | 'signup'>('login');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const touched = reactive({
  email: false,
  password: false,
  confirmPassword: false,
});

const errors = computed(() => {
  const result: Record<string, string> = {};

  if (!email.value.trim()) {
    result.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    result.email = 'Enter a valid email address';
  }

  if (!password.value) {
    result.password = 'Password is required';
  } else if (password.value.length < 6) {
    result.password = 'Password must be at least 6 characters';
  }

  if (mode.value === 'signup') {
    if (!confirmPassword.value) {
      result.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword.value !== password.value) {
      result.confirmPassword = 'Passwords do not match';
    }
  }

  return result;
});

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login';
  touched.confirmPassword = false;
  confirmPassword.value = '';
}

function handleSubmit() {
  touched.email = true;
  touched.password = true;
  if (mode.value === 'signup') touched.confirmPassword = true;

  if (Object.keys(errors.value).length > 0) {
    return;
  }

  router.push('/chat');
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(196, 122, 44, 0.08) 0%, transparent 50%),
    var(--bg-primary);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 32px;
}

.logo {
  font-family: var(--font-mono);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--accent-color);
  letter-spacing: -0.02em;
}

.subtitle {
  margin-top: 6px;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field span:first-child {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-family: var(--font-mono);
}

.field input {
  padding: 10px 12px;
  font-size: 0.95rem;
}

.field input.invalid {
  border-color: var(--danger);
}

.error {
  font-size: 0.75rem;
  color: var(--danger);
}

.form-error {
  font-size: 0.8rem;
  color: var(--danger);
  text-align: center;
}

.btn-primary {
  margin-top: 4px;
  padding: 11px;
  background: var(--accent-color);
  color: #0f0f0f;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.95rem;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

.login-footer {
  margin-top: 20px;
  text-align: center;
}

.btn-link {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.btn-link:hover {
  color: var(--accent-color);
}
</style>
