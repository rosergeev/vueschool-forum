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

const { categories } = storeToRefs(useCategoriesStore())
const { forums } = storeToRefs(useForumsStore())

const category = computed(() => findById(categories.value, id))
const getForumsForCategory = (category) => {
  return forums.value.filter((forum) => forum.categoryId === category.id)
}
</script>

<style scoped></style>
