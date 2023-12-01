<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <router-link
        :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
        class="btn-green btn-small"
        >Start a thread</router-link
      >
    </div>
  </div>
  <div class="col-full push-top">
    <ThreadList :threads="filteredThreads" />
  </div>
</template>

<script setup lang="ts">
import ThreadList from '../components/ThreadList.vue'
import { computed } from 'vue'
import { useForumsStore } from '@/stores/ForumsStore'
import { useThreadsStore } from '../stores/ThreadsStore'
import { storeToRefs } from 'pinia'
import { findById } from '@/helpers'

const { id } = defineProps<{
  id: string
}>()

const threadStore = useThreadsStore()
const { forums } = storeToRefs(useForumsStore())
const { threads, thread } = storeToRefs(threadStore)
// const {thread}= threadStore;

const forum = computed(() => findById(forums.value, id))
const filteredThreads = computed(() =>
  forum.value.threads.map((threadId) => thread.value(threadId))
)
</script>

<style scoped></style>
