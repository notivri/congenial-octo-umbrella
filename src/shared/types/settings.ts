export type ApiProvider = 'local' | 'openai' | 'gemini';

export const API_PROVIDER_LABELS: Record<ApiProvider, string> = {
  local: 'Local (llama.cpp)',
  openai: 'OpenAI',
  gemini: 'Google Gemini',
};

/** Built-in endpoints — not shown in UI except local. */
export const API_ENDPOINTS: Record<Exclude<ApiProvider, 'local'>, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
};

export const DEFAULT_LOCAL_API_URL = 'http://127.0.0.1:8080/v1/chat/completions';
