<script setup lang="ts">
const { t } = useI18n()

useHead({ title: () => t('home.title') })
</script>

<template>
  <main class="flex min-h-svh flex-col items-center justify-center gap-6 px-6">
    <h1 class="text-3xl font-bold">
      {{ t('home.title') }}
    </h1>
    <p class="text-center text-base text-muted-foreground">
      {{ t('home.tagline') }}
    </p>
    <HealthStatusCard />
  </main>
</template>
