<script setup lang="ts">
import { Activity, CircleAlert, CircleCheck, Loader2 } from '@lucide/vue'
import { useHealthStore } from '~/stores/health'

const { t } = useI18n()
const store = useHealthStore()
const { status, health } = storeToRefs(store)

onMounted(() => store.refresh())
</script>

<template>
  <UiCard class="w-full max-w-sm">
    <UiCardHeader>
      <UiCardTitle class="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted-foreground">
        <Activity class="size-4" />
        {{ t('health.title') }}
      </UiCardTitle>
    </UiCardHeader>
    <UiCardContent class="flex flex-col gap-3">
      <Loader2 v-if="status === 'loading'" class="size-5 animate-spin text-muted-foreground" :aria-label="t('health.title')" />
      <p v-else-if="status === 'online' && health" class="flex items-center gap-2 text-success">
        <CircleCheck class="size-4 shrink-0" />
        {{ t('health.online', { service: health.service, version: health.version, database: health.database }) }}
      </p>
      <template v-else>
        <p class="flex items-center gap-2 text-destructive">
          <CircleAlert class="size-4 shrink-0" />
          {{ t('health.error') }}
        </p>
        <UiButton variant="outline" @click="store.refresh()">
          {{ t('common.retry') }}
        </UiButton>
      </template>
    </UiCardContent>
  </UiCard>
</template>
