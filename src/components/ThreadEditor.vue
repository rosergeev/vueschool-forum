<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input v-model="form.title" type="text" id="thread_title" class="form-input" name="title" />
    </div>
    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea
        v-model="form.text"
        name="content"
        id="thread_content"
        class="form-input"
        rows="8"
        cols="140"
      ></textarea>
    </div>
    <div class="btn-group">
      <button class="btn btn-ghost" @click.prevent="cancel">Cancel:</button>
      <button class="btn btn-blue" type="submit" name="Publish">
        {{ existing ? 'Update' : 'Publish' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const { title, text } = defineProps<{
  title: string
  text: string
}>()

const form = ref({ title: title, text: text })

const emit = defineEmits<{
  (
    e: '@save',
    thread: {
      title: string
      text: string
    }
  )
  (e: '@cancel')
  (e: 'dirty')
  (e: 'clean')
}>()

const save = () => {
  emit('clean')
  emit('@save', { ...form.value })
}

const cancel = () => {
  emit('@cancel')
}

const existing = computed(() => !!title)
const computedFormToBeWatched = computed(() => Object.assign({}, form.value))

watch(
  computedFormToBeWatched,
  (newForm, oldForm) => {
    if (existing && !newForm.text && !newForm.title) {
      emit('clean')
    } else if (newForm.text !== oldForm.text || newForm.title !== oldForm.title) {
      emit('dirty')
    } else {
      emit('clean')
    }
  },
  { deep: true }
)
</script>

<style scoped></style>
