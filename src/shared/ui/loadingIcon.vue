<template>
    <div class="loading-icon">
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-linecap="round"
                stroke-dasharray="80" stroke-dashoffset="60" />
        </svg>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.loading-icon {
    color: var(--text-secondary);
    display: inline-flex;
}

.spinner {
    animation: spin 1s linear infinite;
    transform-origin: center;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.25));
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>