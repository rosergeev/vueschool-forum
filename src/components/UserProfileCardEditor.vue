<template>
  <div class="profile-card">
    <form @submit.prevent="save">
      <p class="text-center">
        <img
          :src="user.avatar"
          :alt="`${user.name} profile picture`"
          class="avatar-xlarge img-update"
        />
      </p>
      <div class="form-group">
        <input
          v-model="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>
      <div class="form-group">
        <input
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>
      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          v-model="activeUser.bio"
          id="user_bio"
          placeholder="Write a few words about yourself."
          class="form-input"
        ></textarea>
        <div class="stats">
          <span>{{ user.postsCount }} posts</span>
          <span>{{ user.threadsCount }} threads</span>
        </div>
        <hr />
        <div class="form-group">
          <label class="form-label" for="user_website">Website</label>
          <input
            v-model="activeUser.website"
            autocomplete="off"
            class="form-input"
            id="user_website"
          />
        </div>
        <div class="form-group">
          <label class="form-label" for="user_email">Email</label>
          <input v-model="activeUser.email" autocomplete="off" class="form-input" id="user_email" />
        </div>
        <div class="form-group">
          <label for="user_location" class="form-label">Location</label>
          <input
            v-model="activeUser.location"
            autocomplete="off"
            class="form-input"
            id="user_location"
          />
        </div>
        <div class="btn-group space-between">
          <button class="btn-ghost" @click="cancel">Cancel</button>
          <button class="btn-blue" type="submit">Save</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '@/stores/UsersStore'
import { useRouter } from 'vue-router'
import { setItem } from '../helpers'
// const { setUser } = useUsersStore()

const { user } = defineProps<{
  user: {}
}>()
const activeUser = { ...user }
const router = useRouter()
const { updateUser } = useUsersStore()

const save = async () => {
  await updateUser(activeUser)
  router.push({ name: 'Profile' })
}
const cancel = () => {
  router.push({ name: 'Profile' })
}
</script>

<style scoped></style>
