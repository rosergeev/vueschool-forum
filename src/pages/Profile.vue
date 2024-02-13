<template>
  <div class="container" style="width: 100%">
    <div class="flex-grid">
      <div class="col-3 push-top">
        <UserProfileCard v-if="!edit" :user="user" />
        <UserProfileCardEditor v-else :user="user" />
      </div>
      <div class="col-7 push-top">
        <div class="profile-header">
          <span class="text-lead"> {{ user.username }} recent activity </span>
          <a href="#">See only started threads?</a>
        </div>
        <hr />
        <PostList :posts="user.posts" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PostList from '@/components/PostList.vue'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import { useUsersStore } from '../stores/UsersStore'
import { storeToRefs } from 'pinia'
import useAsyncDataStatus from '@/composables/useAsyncDataStatus'

const { authUser: user } = storeToRefs(useUsersStore())
const { fetchAuthUsersPosts } = useUsersStore()
const { fetched } = useAsyncDataStatus()

defineProps<{
  edit: {}
}>()

const loadData = async () => {
  await fetchAuthUsersPosts()
  fetched()
}
await loadData()
</script>

<style scoped></style>
