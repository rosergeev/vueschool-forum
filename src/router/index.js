import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import Home from '@/pages/Home.vue'
import ThreadShow from '@/pages/ThreadShow.vue'
import ThreadCreate from '@/pages/ThreadCreate.vue'
import ThreadEdit from '@/pages/ThreadEdit.vue'
import NotFound from '@/pages/NotFound.vue'
// import sourceData from '@/data.json'
import Forum from '@/pages/Forum.vue'
import Category from '@/pages/Category.vue'
import Profile from '@/pages/Profile.vue'
import Register from '@/pages/Register.vue'
import SignIn from '@/pages/SignIn.vue'
import { useAppStore } from '@/stores/AppStore'
import { useUsersStore } from '@/stores/UsersStore'
import { useThreadsStore } from '@/stores/ThreadsStore'

import { firebaseApp } from '@/config/firebaseHelpers'
import { storeToRefs } from 'pinia'
import { findById } from '@/helpers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/me',
      name: 'Profile',
      component: Profile,
      props: { edit: false },
      meta: { toTop: true, smoothScroll: true, requiresAuth: true }
    },
    {
      path: '/me/edit',
      name: 'ProfileEdit',
      component: Profile,
      props: { edit: true },
      meta: { requiresAuth: true }
    },
    {
      path: '/category/:id',
      name: 'Category',
      component: Category,
      props: true
    },
    {
      path: '/forum/:id',
      name: 'Forum',
      component: Forum,
      props: true
    },
    {
      path: '/thread/:id',
      name: 'ThreadShow',
      component: ThreadShow,
      props: true,
      async beforeEnter(to, from, next) {
        const { fetchThread } = useThreadsStore()
        const { threads } = storeToRefs(useThreadsStore())
        await fetchThread(to.params.id)
        const threadExists = findById(threads.value, to.params.id)
        console.log(threadExists)
        if (threadExists) {
          return next()
        } else {
          next({
            name: 'NotFound',
            params: { pathMatch: to.path.substring(1).split('/') },
            query: to.query,
            hash: to.hash
          })
        }
      }
    },
    {
      path: '/forum/:forumId/thread/create',
      name: 'ThreadCreate',
      component: ThreadCreate,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/thread/:id/edit',
      name: 'ThreadEdit',
      component: ThreadEdit,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { requiresGuest: true }
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn,
      meta: { requiresGuest: true }
    },
    {
      path: '/logout',
      name: 'SignOut',
      async beforeEnter(to, from) {
        const { signOut } = useUsersStore()
        await signOut({ firebaseApp })
        return { name: 'Home' }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})

router.beforeEach(async (to, from) => {
  const { initAuthentication } = useUsersStore()
  const { authId } = storeToRefs(useUsersStore())
  await initAuthentication({ firebaseApp })
  const { unsubscribeAllSnapshots } = useAppStore()
  unsubscribeAllSnapshots()
  if (to.meta.requiresAuth) {
    if (!authId.value) return { name: 'SignIn', query: { redirectTo: to.path } }
  }
  if (to.meta.requiresGuest && authId.value) {
    return { name: 'Home' }
  }
})
export default router
