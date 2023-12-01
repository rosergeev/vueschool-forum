<template>
  <div class="thread">
    <div>
      <p>
        <RouterLink :to="{ name: 'ThreadShow', params: { id: thread.id } }">{{
          thread.title
        }}</RouterLink>
      </p>
      <p class="text-faded text-xsmall">
        By <a href="#">{{ userById(thread.userId).name }}</a
        >, <app-date :timestamp="thread.publishedAt" />.
      </p>
    </div>

    <div class="activity">
      <p class="replies-count">{{ thread.repliesCount }} replies</p>

      <img class="avatar-medium" :src="userById(thread.userId).avatar" alt="" />

      <div>
        <p class="text-xsmall">
          <a href="#">{{ userById(thread.userId).name }}</a>
        </p>
        <p class="text-xsmall text-faded">
          <app-date :timestamp="thread.publishedAt" />
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsersStore } from '../stores/UsersStore'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { findById } from '@/helpers'

const props = defineProps<{
  thread: {
    id: string
    title: string
    userId: string
    publishedAt: number
    posts: []
  }
}>()
const { thread } = props
const { users } = storeToRefs(useUsersStore())

const userById = (userId) => findById(users.value, userId)
</script>

<style scoped></style>
