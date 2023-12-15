<template>
  <div class="col-full">
    <form @submit.prevent="save">
      <div class="form-group">
        <textarea
          v-model="postCopy.text"
          name=""
          id=""
          cols="30"
          rows="10"
          class="form-input"
        ></textarea>
      </div>
      <div class="form-action">
        <button class="btn-blue">{{ post.id ? 'Update Post' : 'Submit Post' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  post: {}
}>()

const postCopy = { ...props.post }
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
  emit('@save', postCopy)
  postCopy.text.value = ''
}
</script>

<style scoped></style>
