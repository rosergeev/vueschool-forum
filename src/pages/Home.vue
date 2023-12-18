<template>
  <div v-if="ready" class="container col-full">
    <h1 class="push-top">Welcome to the Forum</h1>
    <CategoryList :categories="categories" ref="el" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import CategoryList from '../components/CategoryList.vue'
import { useCategoriesStore } from '../stores/CategoriesStore'
import { useForumsStore } from '../stores/ForumsStore'
import { onBeforeMount, onMounted } from 'vue'
import useAsyncDataStatus from '@/composables/useAsyncDataStatus'

const categoriesStore = useCategoriesStore()
const forumsStore = useForumsStore()

const { categories } = storeToRefs(categoriesStore)
const { fetchForums } = forumsStore

const { ready, fetched } = useAsyncDataStatus()
// console.log('before create', categories.value)

const initDBData = async () => {
  const categories = await categoriesStore.fetchAllCategories()
  const forumIds = categories.map((category) => category.forums).flat()
  await fetchForums(forumIds)
}

onBeforeMount(async () => {
  await initDBData()
  fetched()
})

const el = ref()
onMounted(() => {
  console.log('mounted', categories.value, el.value)
})

onBeforeUnmount(() => {
  console.log('before unmount', categories.value, el.value)
})

onUnmounted(() => {
  console.log('unmounted', categories.value)
})
</script>
