<template>
  <div class="container">
    <h1>My Profile</h1>
    <!-- <div class="flex-grid">
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
    </div> -->
  </div>
</template>

<script setup lang="ts">
// import PostList from '@/components/PostList.vue'
// import UserProfileCard from '@/components/UserProfileCard.vue'
// import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
// import { useUsersStore } from '../stores/UsersStore'
// import { storeToRefs } from 'pinia'

// const { authUser: user } = storeToRefs(useUsersStore())

defineProps<{
  edit: {}
}>()

</script>

<style scoped></style>
