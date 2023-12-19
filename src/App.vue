<template>
  <the-navbar></the-navbar>
  <div class="container">
    <Suspense>
      <div class="container">
        <RouterView v-show="showPage" @ready="showPage = true" />
        <AppSpinner v-show="!showPage"/>
        <!-- <div class="push-top" v-show="!showPage">loading...</div> -->
      </div>
    </Suspense>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import { useUsersStore } from '@/stores/UsersStore'
import { ref } from 'vue'
import AppSpinner from '@/components/AppSpinner.vue'

const showPage = ref(false)

const userStore = useUsersStore()
const { fetchAuthUser } = userStore

const initDBData = async () => {
  await fetchAuthUser()
  // showPage.value = true
}

initDBData()

// useRouter().beforeEach(() => {
//   showPage.value = false
// })
</script>

<style>
@import '@/assets/style.css';
</style>
