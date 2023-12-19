<template>
  <div v-if="ready" class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>
    <ThreadEditor @@save="save" @@cancel="cancel" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { useForumsStore } from '@/stores/ForumsStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import ThreadEditor from '@/components/ThreadEditor.vue'
import { findById } from '@/helpers'
import useAsyncDataStatus from '@/composables/useAsyncDataStatus'

const { forumId } = defineProps<{
  forumId: string
}>()

const { createThread } = useThreadsStore()
const forumsStore = useForumsStore()
const { forums } = storeToRefs(forumsStore)
const { fetchForum } = forumsStore
const router = useRouter()

const { ready, fetched } = useAsyncDataStatus()

const save = async ({ title, text }) => {
  const thread = await createThread({
    forumId: forum.value.id,
    title,
    text
  })
  router.push({ name: 'ThreadShow', params: { id: thread.id } })
}

const cancel = () => {
  router.push({ name: 'Forum', params: { id: forumId } })
}

const forum = computed(() => findById(forums.value, forumId) || {})

const initDBData = () => {
  fetchForum(forumId)
  fetched()
}
initDBData()
</script>

<style scoped></style>
