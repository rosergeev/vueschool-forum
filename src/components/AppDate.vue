<template>
  <span :title="humanFriendlyDate()">
    {{ diffForHumans() }}
  </span>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

const { timestamp } = defineProps<{ timestamp: number }>()

const diffForHumans = () => {
  return dayjs.unix(timestamp).fromNow()
}

const humanFriendlyDate = () => {
  return dayjs.unix(timestamp).format('llll')
}
</script>

<style scoped></style>
