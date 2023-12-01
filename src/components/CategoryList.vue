<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :category-id="category.id"
  />
</template>

<script setup lang="ts">
import ForumList from './ForumList.vue'
import { useForumsStore } from '../stores/ForumsStore'
import { storeToRefs } from 'pinia'

const { forums } = storeToRefs(useForumsStore())

defineProps<{
  categories: []
}>()

const getForumsForCategory = (category) => {
  return forums.value.filter((forum) => forum.categoryId === category.id)
}
</script>

<style scoped></style>
