<template>
  <div v-if="ready" class="container col-full">
    <div class="col-full push-top" v-if="forum">
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
  </div>
</template>

<script setup lang="ts">
import ThreadList from '../components/ThreadList.vue'
import { computed, onBeforeMount } from 'vue'
import { useForumsStore } from '@/stores/ForumsStore'
import { useThreadsStore } from '../stores/ThreadsStore'
import { useUsersStore } from '@/stores/UsersStore'
import { storeToRefs } from 'pinia'
import { findById } from '@/helpers'
import useAsyncDataStatus from '@/composables/useAsyncDataStatus'

const { id } = defineProps<{
  id: string
}>()

const threadsStore = useThreadsStore()
const forumsStore = useForumsStore()
const usersStore = useUsersStore()

const { forums } = storeToRefs(forumsStore)
const { thread } = storeToRefs(threadsStore)

const { ready, fetched } = useAsyncDataStatus()

const { fetchForum } = forumsStore
const { fetchThreads } = threadsStore
const { fetchUsers } = usersStore
// const {thread}= threadStore;

const forum = computed(() => findById(forums.value, id))
const filteredThreads = computed(() => {
  if (!forum) return []
  return forum.value.threads.map((threadId) => thread.value(threadId))
})

const initDBData = async () => {
  const forum = await fetchForum(id)
  const threads = await fetchThreads(forum.threads)
  await fetchUsers(threads.map((thread) => thread.userId))
  fetched()
}

await initDBData()
</script>

<style scoped></style>
