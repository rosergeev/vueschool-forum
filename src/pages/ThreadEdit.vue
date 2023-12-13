<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>
      Editing <i>{{ thread.title }}</i>
    </h1>
    <ThreadEditor :title="thread.title" :text="text" @@save="save" @@cancel="cancel" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { usePostsStore } from '@/stores/PostsStore'

import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import ThreadEditor from '@/components/ThreadEditor.vue'

const { id } = defineProps<{
  id: string
}>()
const { updateThread, fetchThread } = useThreadsStore()
const { threads } = storeToRefs(useThreadsStore())
const { posts } = storeToRefs(usePostsStore())
const { fetchPost } = usePostsStore()
const router = useRouter()
import { findById } from '@/helpers'

const save = async ({ title, text }) => {
  const thread = await updateThread({
    id,
    title,
    text
  })
    router.push({ name: 'ThreadShow', params: { id: thread.id } })
}

const cancel = () => {
  router.push({ name: 'ThreadShow', params: { id } })
}

const thread = computed(() => findById(threads.value, id))
const text = computed(() => {
  if (!thread.value.posts) return ''
  const post = findById(posts.value, thread.value.posts[0])

  return post ? post.text : ''
})

const initDBData = async () => {
  const thread = await fetchThread(id)
  await fetchPost(thread.posts[0])
}
initDBData()
</script>

<style scoped></style>
