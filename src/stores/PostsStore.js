import { defineStore } from 'pinia'
import { useThreadsStore } from './ThreadsStore'
import { useUsersStore } from './UsersStore'
import { makeAppendChildToParent } from '@/helpers'
import { fetchItem, fetchItems } from '../helpers'

export const usePostsStore = defineStore('PostsStore', {
  state: () => {
    return {
      posts: []
    }
  },
  getters: {},
  actions: {
    createPost(post) {
      post.id = 'ggqq' + Math.random()
      const userStore = useUsersStore()
      post.userId = userStore.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      this.posts.push(post)
      const threadsStore = useThreadsStore()
      this.appendPostToThread(threadsStore, { childId: post.id, parentId: post.threadId })
      threadsStore.appendContributorToThread(threadsStore, {
        childId: userStore.authId,
        parentId: post.threadId
      })
    },
    appendPostToThread: makeAppendChildToParent({ parent: 'threads', child: 'posts' }),
    fetchPost(id) {
      return fetchItem(this, 'posts', id)
    },
    fetchPosts(ids) {
      return fetchItems(this, 'posts', ids)
    }
  }
})
