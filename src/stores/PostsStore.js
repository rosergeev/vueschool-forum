import { defineStore } from 'pinia'
import { useThreadsStore } from './ThreadsStore'
import { useUsersStore } from './UsersStore'
import { makeAppendChildToParent } from '@/helpers'
import { fetchItem, fetchItems, setItem } from '../helpers'
import {
  doc,
  collection,
  arrayUnion,
  writeBatch,
  serverTimestamp,
  getDoc,
  increment,
  updateDoc
} from 'firebase/firestore'
import { db } from '@/config/firebaseHelpers'

export const usePostsStore = defineStore('PostsStore', {
  state: () => {
    return {
      posts: []
    }
  },
  getters: {},
  actions: {
    async createPost(post) {
      const userStore = useUsersStore()
      post.userId = userStore.authId
      post.publishedAt = serverTimestamp()

      const batch = writeBatch(db)
      const postRef = doc(collection(db, 'posts'))
      const threadRef = doc(db, 'threads', post.threadId)
      const userRef = doc(db, 'users', userStore.authId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(userStore.authId)
      })
      batch.update(userRef, {
        postsCount: increment(1)
      })
      await batch.commit()
      const newPost = await getDoc(postRef)

      // const newPost = await addDoc(collection(db, 'posts'), post)
      // await updateDoc(doc(db, 'threads', post.threadId), {
      //   posts: arrayUnion(newPost.id),
      //   contributors: arrayUnion(userStore.authId)
      // })

      setItem(this, 'posts', { ...newPost.data(), id: newPost.id })

      const threadsStore = useThreadsStore()
      this.appendPostToThread(threadsStore, { childId: newPost.id, parentId: post.threadId })
      threadsStore.appendContributorToThread(threadsStore, {
        childId: userStore.authId,
        parentId: post.threadId
      })
    },
    async updatePost({ text, id }) {
      const userStore = useUsersStore()
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: userStore.authId,
          moderated: false
        }
      }
      const postRef = doc(db, 'posts', id)
      await updateDoc(postRef, post)

      const updatedPost = getDoc(postRef)
      setItem(this, 'posts', updatedPost)
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
