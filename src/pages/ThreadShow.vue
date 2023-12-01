<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        :to="{ name: 'ThreadEdit', id: this.id }"
        class="btn-green btn-small"
        tag="button"
        >Edit Thread</router-link
      >
    </h1>
    <p>
      By
      <a href="#" class="link-unstyled"
        >{{ thread.author?.name }}, <AppDate :timestamp="thread.publishedAt" />.
      </a>
      <span style="float: right; margin-top: 2px" class="hide-mobile text-faded text-small">
        {{ thread.repliesCount }} replies by {{ thread.contributorsCount }} contributors
      </span>
    </p>
    <post-list :posts="threadPosts" />

    <post-editor @@save="addPost" />
  </div>
  <!-- <div v-else class="col-full text-center">
    <h1>This thread does not exist</h1>
    <router-link :to="{ name: 'Home' }">Read some cool threads</router-link>
  </div> -->
</template>

<script setup lang="ts">
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import AppDate from '@/components/AppDate.vue'
import { useThreadsStore } from '../stores/ThreadsStore'
import { usePostsStore } from '../stores/PostsStore'
import { useUsersStore } from '../stores/UsersStore'
import { storeToRefs } from 'pinia'

// import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'

const threadsStore = useThreadsStore()
const postsStore = usePostsStore()
const usersStore = useUsersStore()

// const { posts } = storeToRefs(postsStore)
const { fetchThread } = threadsStore
const { fetchUser, fetchUsers } = usersStore
const { fetchPosts } = postsStore

// const route = useRoute()
const { posts } = storeToRefs(postsStore)
const { thread: storeThread } = storeToRefs(threadsStore)
const props = defineProps<{
  id: string
}>()

const { id } = props

const threadPosts = computed(() => posts.value.filter((post) => post.threadId === id))
// aproach with route
// const thread = computed(() => threads.find((t) => t.id === route.params.id))

// aproach with props
const thread = computed(() => storeThread.value(id))

const addPost = (newPost) => {
  const post = { ...newPost, threadId: id }

  postsStore.createPost(post)
}

const getDBData = async () => {
  const dbThread = await fetchThread(id)
  await fetchUser(dbThread.userId)
  const posts = await fetchPosts(dbThread.posts)
  const users = posts.map((post) => post.userId)
  await fetchUsers(users)
  // dbThread.posts.forEach(async (postId) => {
  //   const dbPost = await fetchPost(postId)
  //   await fetchUser(dbPost.userId)
  // })
}

getDBData()
</script>

<style scoped></style>
