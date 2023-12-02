import { defineStore, storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/UsersStore'
import { usePostsStore } from '@/stores/PostsStore'
import { useForumsStore } from '@/stores/ForumsStore'
import { findById, makeAppendChildToParent } from '@/helpers'
import { fetchItem, fetchItems } from '../helpers'

export const useThreadsStore = defineStore('ThreadsStore', {
  state: () => {
    return {
      threads: []
    }
  },
  getters: {
    thread: (state) => (id) => {
      const thread = findById(state.threads, id)
      if (!thread) return {}
      const { users } = useUsersStore()
      return {
        ...thread,
        get author() {
          return findById(users, thread?.userId)
        },
        get repliesCount() {
          return thread?.posts.length - 1
        },
        get contributorsCount() {
          return thread?.contributors.length
        }
      }
    }
  },
  actions: {
    userThreads(userId) {
      return this.threads.filter((thread) => thread.userId === userId)
    },
    async createThread({ text, title, forumId }) {
      const id = 'ggqq' + Math.random()
      const userStore = useUsersStore()
      const forumStore = useForumsStore()

      const { appendThreadToUser } = userStore
      const { appendThreadToForum } = forumStore

      const userId = userStore.authId
      const publishedAt = Math.floor(Date.now() / 1000)

      const thread = { forumId, title, publishedAt, userId, id }
      this.threads.push(thread)

      appendThreadToUser(userStore, { parentId: userId, childId: id })
      appendThreadToForum(forumStore, { parentId: forumId, childId: id })

      const postsStore = usePostsStore()
      postsStore.createPost({ text, threadId: id })

      return findById(this.threads, id)
    },
    async updateThread({ id, title, text }) {
      const thread = findById(this.threads, id)
      const { posts } = storeToRefs(usePostsStore())
      const post = findById(posts.value, thread.posts[0])

      thread.title = title
      post.text = text

      return thread
    },
    appendContributorToThread: makeAppendChildToParent({
      parent: 'threads',
      child: 'contributors'
    }),
    fetchThread(id) {
      return fetchItem(this, 'threads', id)
    },
    fetchThreads(ids) {
      return fetchItems(this, 'threads', ids)
    }
  }
})
