import { defineStore, storeToRefs } from 'pinia'
import { useUsersStore } from '@/stores/UsersStore'
import { usePostsStore } from '@/stores/PostsStore'
import { useForumsStore } from '@/stores/ForumsStore'
import { findById, makeAppendChildToParent } from '@/helpers'
import { docToResource, fetchItem, fetchItems, setItem } from '../helpers'
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/config/firebaseHelpers'

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
          if (!thread?.posts) return 0
          return thread?.posts.length - 1
        },
        get contributorsCount() {
          if (!thread?.contributors) return 0
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
      const userStore = useUsersStore()
      const forumStore = useForumsStore()
      const userId = userStore.authId
      const publishedAt = serverTimestamp()

      const { appendThreadToUser } = userStore
      const { appendThreadToForum } = forumStore

      const batch = writeBatch(db)
      const threadRef = doc(collection(db, 'threads'))
      const thread = { forumId, title, publishedAt, userId, id: threadRef.id }
      const userRef = doc(db, 'users', userId)
      const forumRef = doc(db, 'forums', forumId)

      batch.set(threadRef, thread)
      batch.update(userRef, {
        threads: arrayUnion(threadRef.id)
      })
      batch.update(forumRef, {
        threads: arrayUnion(threadRef.id)
      })

      await batch.commit()
      const newThread = await getDoc(threadRef)

      setItem(this, 'threads', { ...newThread.data(), id: newThread.id })
      appendThreadToUser(userStore, { parentId: userId, childId: threadRef.id })
      appendThreadToForum(forumStore, { parentId: forumId, childId: threadRef.id })

      const postsStore = usePostsStore()
      await postsStore.createPost({ text, threadId: threadRef.id })

      return findById(this.threads, threadRef.id)
    },
    async updateThread({ id, title, text }) {
      const thread = findById(this.threads, id)
      const { posts } = storeToRefs(usePostsStore())
      const post = findById(posts.value, thread.posts[0])
      let newThread = { ...thread, title }
      let newPost = { ...post, text }

      const threadRef = doc(db, 'threads', id)
      const postRef = doc(db, 'posts', post.id)
      const batch = writeBatch(db)
      batch.update(threadRef, newThread)
      batch.update(postRef, newPost)
      await batch.commit()

      newThread = await getDoc(threadRef)
      newPost = await getDoc(postRef)

      setItem(this, 'threads', newThread)
      setItem(usePostsStore(), 'posts', newPost)

      return docToResource(newThread)
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
