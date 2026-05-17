import type { Message } from '@/shared/types/chat';

interface ChatCompletionChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

export interface LlmRequestConfig {
  endpoint: string;
  apiKey: string;
  provider: 'local' | 'openai' | 'gemini';
}

export async function* streamLlmResponse(
  messages: Array<{ role: string; content: string }>,
  config: LlmRequestConfig
): AsyncGenerator<string, void, unknown> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const key = config.apiKey.trim();
  if (key) {
    headers.Authorization = `Bearer ${key}`;
  } else if (config.provider === 'local') {
    headers.Authorization = 'Bearer no-key';
  }

  const model =
    config.provider === 'openai'
      ? 'gpt-4o-mini'
      : config.provider === 'gemini'
        ? 'gemini-2.0-flash'
        : undefined;

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...(model ? { model } : {}),
      messages,
      stream: true,
      max_tokens: 4096,
      temperature: 0.7,
      stop: config.provider === 'local' ? ['</s>', 'Llama:', 'User:'] : undefined,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(
      `LLM API Error (${response.status}): ${response.statusText}${errText ? ` — ${errText.slice(0, 200)}` : ''}`
    );
  }

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const cleanedLine = line.trim();

      if (!cleanedLine || cleanedLine === 'data: [DONE]') continue;
      if (!cleanedLine.startsWith('data: ')) continue;

      try {
        const jsonStr = cleanedLine.replace('data: ', '');
        const data = JSON.parse(jsonStr) as ChatCompletionChunk;

        const content = data.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      } catch (e) {
        console.error('SSE Parsing error:', e);
      }
    }
  }
}

export function buildApiMessages(
  systemPrompt: string,
  history: Message[],
  userName: string
): Array<{ role: string; content: string }> {
  const apiMessages: Array<{ role: string; content: string }> = [
    { role: 'system', content: systemPrompt },
  ];

  for (const msg of history) {
    if (msg.role === 'user') {
      apiMessages.push({
        role: 'user',
        content: `${userName}: ${msg.content}`,
      });
    } else if (msg.role === 'assistant') {
      apiMessages.push({ role: 'assistant', content: msg.content });
    }
  }

  return apiMessages;
}
