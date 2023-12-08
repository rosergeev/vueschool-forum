<template>
  <span :title="humanFriendlyDate">
    {{ diffForHumans }}
  </span>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { computed } from 'vue'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

const { timestamp } = defineProps<{ timestamp: number | object }>()

const normalizedTimestamp = computed(() => timestamp?.seconds || timestamp)

const diffForHumans = computed(() => dayjs.unix(normalizedTimestamp.value).fromNow())

const humanFriendlyDate = computed(() => dayjs.unix(normalizedTimestamp.value).format('llll'))

</script>

<style scoped></style>
