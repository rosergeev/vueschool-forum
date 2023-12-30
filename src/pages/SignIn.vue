<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="form.email" id="email" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="form.password" id="password" type="password" class="form-input" />
        </div>
        <div class="push-top">
          <button class="btn-blue btn-block" type="submit">Log in</button>
        </div>

        <div class="form-actions text-right">
          <RouterLink :to="{ name: 'Register' }">Create an accoutn?</RouterLink>
        </div>
      </form>
      <div class="push-top text-center">
        <button @click.prevent="signInWithGoogleLF" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useUsersStore } from '@/stores/UsersStore'
import { useRouter } from 'vue-router'

const { signInWithEmailAndPassword, signInWithGoogle } = useUsersStore()
const router = useRouter()
const firebaseApp = inject('firebaseApp')

const form = ref({
  email: '',
  password: ''
})

const signIn = async () => {
  try {
    await signInWithEmailAndPassword({ firebaseApp, ...form.value })
    router.push('/')
  } catch (error) {
    alert(error.message)
  }
}

const signInWithGoogleLF = async () => {
  await signInWithGoogle({ firebaseApp })
  router.push('/')
}
</script>

<style scoped></style>
