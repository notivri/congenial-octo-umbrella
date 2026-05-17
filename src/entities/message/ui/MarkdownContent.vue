<template>
  <div class="markdown-content" v-html="html" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { renderMarkdown } from '@/shared/lib/markdown';

const props = defineProps<{
  content: string;
}>();

const html = computed(() => renderMarkdown(props.content));
</script>

<style scoped>
.markdown-content {
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 0.95rem;
}

.markdown-content :deep(p) {
  margin: 0 0 0.75em;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  margin: 1em 0 0.5em;
  font-weight: 600;
  line-height: 1.3;
}

.markdown-content :deep(h1) { font-size: 1.35em; }
.markdown-content :deep(h2) { font-size: 1.2em; }
.markdown-content :deep(h3) { font-size: 1.05em; }

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.4em;
}

.markdown-content :deep(li) {
  margin: 0.25em 0;
}

.markdown-content :deep(blockquote) {
  margin: 0.75em 0;
  padding: 0.5em 0 0.5em 1em;
  border-left: 3px solid var(--accent-color);
  color: var(--text-secondary);
}

.markdown-content :deep(pre) {
  margin: 0.75em 0;
  padding: 12px 14px;
  background: #0a0a0a;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-content :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
}

.markdown-content :deep(p code),
.markdown-content :deep(li code) {
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 4px;
}

.markdown-content :deep(pre code) {
  padding: 0;
  background: none;
}

.markdown-content :deep(table) {
  width: 100%;
  margin: 0.75em 0;
  border-collapse: collapse;
  font-size: 0.9em;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid var(--border-color);
  padding: 8px 10px;
  text-align: left;
}

.markdown-content :deep(th) {
  background: rgba(255, 255, 255, 0.04);
}

.markdown-content :deep(a) {
  color: var(--accent-color);
  text-decoration: underline;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 1em 0;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: var(--text-primary);
}
</style>
