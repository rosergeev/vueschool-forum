import { defineStore } from 'pinia'
import { usePostsStore } from '@/stores/PostsStore'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { findById, makeAppendChildToParent } from '@/helpers'
import { fetchItem, fetchItems } from '../helpers'

export const useUsersStore = defineStore('UsersStore', {
  state: () => {
    return {
      users: [],
      authId: 'VXjpr2WHa8Ux4Bnggym8QFLdv5C3'
    }
  },
  getters: {
    authUser: (state) => state.user(state.authId),
    user: (state) => (id) => {
      const user = findById(state.users, id)
      if (!user) {
        return null
      }
      return {
        ...user,
        get posts() {
          return usePostsStore().posts.filter((post) => post.userId === user.id)
        },
        get postsCount() {
          return this.posts.length
        },
        get threads() {
          return useThreadsStore().threads.filter((thread) => thread.userId === user.id)
        },
        get threadsCount() {
          return this.threads.length
        }
      }
    }
  },
  actions: {
    // setUser(user) {
    //   setItem(this, 'users', user)
    //   // upsert(this.users, user)
    // },
    appendThreadToUser: makeAppendChildToParent({ parent: 'users', child: 'threads' }),
    fetchUser(id) {
      return fetchItem(this, 'users', id)
    },
    fetchUsers(ids) {
      return fetchItems(this, 'users', ids)
    }
  }
})
