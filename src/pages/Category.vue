<template>
  <h1>{{ category.name }}</h1>
  <ForumList :title="category.name" :forums="getForumsForCategory(category)" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ForumList from '../components/ForumList.vue'
import { useCategoriesStore } from '@/stores/CategoriesStore'
import { useForumsStore } from '@/stores/ForumsStore'
import { storeToRefs } from 'pinia'
import { findById } from '@/helpers'

const { id } = defineProps<{
  id: string
}>()

const categoriesStore = useCategoriesStore()
const forumsStore = useForumsStore()

const { categories } = storeToRefs(categoriesStore)
const { forums } = storeToRefs(forumsStore)

const { fetchCategory } = categoriesStore
const { fetchForums } = forumsStore

const category = computed(() => findById(categories.value, id) || {})
const getForumsForCategory = (category) => {
  return forums.value.filter((forum) => forum.categoryId === category.id)
}

const initDBData = async () => {
  const category = await fetchCategory(id)
  await fetchForums(category.forums)
}
await initDBData()
</script>

<style scoped></style>
