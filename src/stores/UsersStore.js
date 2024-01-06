import { defineStore } from 'pinia'
import { usePostsStore } from '@/stores/PostsStore'
import { useThreadsStore } from '@/stores/ThreadsStore'
import { findById, makeAppendChildToParent } from '@/helpers'
import { docToResource, fetchItem, fetchItems, setItem } from '../helpers'
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
  // signInWithRedirect
} from 'firebase/auth'

export const useUsersStore = defineStore('UsersStore', {
  state: () => {
    return {
      users: [],
      authId: 'aOe7DPWjBJaNf3nXKX9dGFg3WEE3',
      authUserUnsubscribe: null
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
          return user.postsCount || 0
          // this.posts.length
        },
        get threads() {
          return useThreadsStore().threads.filter((thread) => thread.userId === user.id)
        },
        get threadsCount() {
          return user.threads?.length || 0
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
    },
    fetchAuthUser(firebaseApp) {
      const auth = getAuth(firebaseApp)
      const userId = auth.currentUser?.uid
      if (!userId) {
        return
      }
      this.authId = userId
      return fetchItem(this, 'users', this.authId, (unsubscribe) => {
        this.setAuthUserUnsubscribe(unsubscribe)
      })
    },
    async createUser({ id, email, name, username, avatar = null }) {
      const registeredAt = serverTimestamp()
      const usernameLower = username.toLowerCase()
      email = email.toLowerCase()
      const user = { avatar, email, name, username, usernameLower, registeredAt }
      const db = getFirestore()
      const userRef = doc(db, 'users', id)
      await setDoc(userRef, user)
      const newUser = await getDoc(userRef)
      setItem(this, 'users', newUser)

      return docToResource(newUser)
    },
    async registerUserWithEmailAndPassword({
      firebaseApp,
      email,
      password,
      name,
      username,
      avatar = null
    }) {
      const auth = getAuth(firebaseApp)
      const result = await createUserWithEmailAndPassword(auth, email, password)

      await this.createUser({ id: result.user.uid, email, name, username, avatar })
    },
    signOut({ firebaseApp }) {
      const auth = getAuth(firebaseApp)
      signOut(auth)
      this.authId = null
    },
    async signInWithEmailAndPassword({ firebaseApp, email, password }) {
      const auth = getAuth(firebaseApp)
      return await signInWithEmailAndPassword(auth, email, password)
    },
    async signInWithGoogle({ firebaseApp }) {
      const auth = getAuth(firebaseApp)
      const provider = new GoogleAuthProvider()
      const response = await signInWithPopup(auth, provider)
      // const response = await signInWithRedirect(auth, provider)
      const user = response.user
      const db = getFirestore()
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        this.createUser({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          username: user.email,
          avatar: user.photoURL
        })
      }
    },
    setAuthUserUnsubscribe(unsubscribe) {
      this.authUserUnsubscribe = unsubscribe
    },
    unsubscribeAuthUser() {
      if (this.authUserUnsubscribe) {
        this.authUserUnsubscribe()
        this.setAuthUserUnsubscribe(null)
      }
    }
  }
})
