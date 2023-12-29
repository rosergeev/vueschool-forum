<template>
  <the-navbar></the-navbar>
  <div class="container">
    <Suspense>
      <div class="container">
        <RouterView v-show="showPage" @ready="onPageReady" />
        <AppSpinner v-show="!showPage" />
        <!-- <div class="push-top" v-show="!showPage">loading...</div> -->
      </div>
    </Suspense>
  </div>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import { useUsersStore } from '@/stores/UsersStore'
import { ref, inject } from 'vue'
import AppSpinner from '@/components/AppSpinner.vue'
import NProgress from 'nprogress'

const showPage = ref(false)

const userStore = useUsersStore()
const { fetchAuthUser } = userStore
const firebaseApp = inject('firebaseApp')

const initDBData = async () => {
  NProgress.configure({
    speed: 200,
    showSpinner: false
  })
  await fetchAuthUser(firebaseApp)
  // showPage.value = true
}

initDBData()

useRouter().beforeEach(() => {
  NProgress.start()
})

const onPageReady = () => {
  showPage.value = true
  NProgress.done()
}
</script>

<style>
@import '@/assets/style.css';
@import '/node_modules/nprogress/nprogress.css';

#nprogress .bar {
  background-color: #57ad8d !important;
}
</style>
