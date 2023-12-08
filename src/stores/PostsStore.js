import { defineStore } from 'pinia'
import { useThreadsStore } from './ThreadsStore'
import { useUsersStore } from './UsersStore'
import { makeAppendChildToParent } from '@/helpers'
import { fetchItem, fetchItems, setItem } from '../helpers'
import { getFirestore, doc, collection, arrayUnion, writeBatch } from 'firebase/firestore'

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
      post.publishedAt = Math.floor(Date.now() / 1000)
      const db = getFirestore()
      const batch = writeBatch(db)
      const postRef = doc(collection(db, 'posts'))
      const threadRef = doc(db, 'threads', post.threadId)
      batch.set(postRef, post)
      batch.update(threadRef, {
        posts: arrayUnion(postRef.id),
        contributors: arrayUnion(userStore.authId)
      })
      await batch.commit()
      // const newPost = await addDoc(collection(db, 'posts'), post)
      // await updateDoc(doc(db, 'threads', post.threadId), {
      //   posts: arrayUnion(newPost.id),
      //   contributors: arrayUnion(userStore.authId)
      // })

      setItem(this, 'posts', { ...post, id: postRef.id })

      const threadsStore = useThreadsStore()
      this.appendPostToThread(threadsStore, { childId: postRef.id, parentId: post.threadId })
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
