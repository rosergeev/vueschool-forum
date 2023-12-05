<template>
  <the-navbar></the-navbar>
  <div class="container">
    <Suspense>
      <RouterView />
    </Suspense>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue'
import { useUsersStore } from '@/stores/UsersStore'

const userStore = useUsersStore()
const { fetchAuthUser } = userStore

const initDBData = async () => {
  await fetchAuthUser()
}

initDBData()
</script>

<style>
@import '@/assets/style.css';
</style>
