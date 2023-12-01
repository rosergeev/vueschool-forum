<template>
  <div class="col-full push-top">
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

const { forumId } = defineProps<{
  forumId: string
}>()
const { createThread } = useThreadsStore()
const { forums } = storeToRefs(useForumsStore())
const router = useRouter()

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

const forum = computed(() => findById(forums.value, forumId))
</script>

<style scoped></style>
