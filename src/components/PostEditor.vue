<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea v-model="text" name="" id="" cols="30" rows="10" class="form-input"></textarea>
      </div>
      <div class="form-action">
        <button class="btn-blue">Submit post</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const text = ref('')

const emit = defineEmits<{
  (
    e: '@save',
    post: {
      id: string
      text: string
      publishedAt: number
      userId: string
    }
  ): void
}>()

const save = () => {
  const postId = 'gggg' + Math.random()
  const post = {
    id: postId,
    text: text.value
  }
  emit('@save', post)
  text.value = ''
}
</script>

<style scoped></style>
