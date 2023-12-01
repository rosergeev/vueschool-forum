<template>
  <h1 class="push-top">Welcome to the Forum</h1>
  <CategoryList :categories="categories" ref="el"/>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import CategoryList from '../components/CategoryList.vue'
import { useCategoriesStore } from '../stores/CategoriesStore'
import { onBeforeMount, onMounted } from 'vue'

const { categories } = storeToRefs(useCategoriesStore())

console.log('before create', categories.value)

onBeforeMount(() => {
  console.log('before mount', categories.value)
})

const el = ref()
onMounted(() => {
  console.log('mounted', categories.value, el.value)
})

onBeforeUnmount(()=>{
  console.log('before unmount', categories.value, el.value)
})

onUnmounted(()=>{
  console.log('unmounted', categories.value)
})
</script>
