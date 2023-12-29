<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input v-model="form.name" id="name" type="text" class="form-input" />
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="form.username" id="username" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="form.email" id="email" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="form.password" id="password" type="password" class="form-input" />
        </div>
        <div class="form-group">
          <label for="avatar">Avatar</label>
          <input v-model="form.avatar" id="avatar" type="text" class="form-input" />
        </div>

        <div class="form-actions">
          <button class="btn-blue btn-block" type="submit">Register</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUsersStore } from '../stores/UsersStore'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import { FirebaseApp } from 'firebase/app'

const emit = defineEmits<{
  (e: 'ready'): void
}>()

const { registerUserWithEmailAndPassword } = useUsersStore()
const router = useRouter()
const firebaseApp = inject('firebaseApp') as FirebaseApp

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  avatar: ''
})

const register = async () => {
  await registerUserWithEmailAndPassword({ firebaseApp, ...form.value })
  router.push('/')
}

emit('ready')
</script>

<style scoped></style>
