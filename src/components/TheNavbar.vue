<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="../assets/svg/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger">
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <nav class="navbar">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a @click.prevent="userDropdownOpen = !userDropdownOpen">
            <img
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`"
            />
            <span>
              {{ authUser.name }}
              <img class="icon-profile" src="../assets/svg/arrow-profile.svg" alt="" />
            </span>
          </a>

          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{ name: 'Profile' }">View profile</router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="signOut(firebaseApp)">Sign Out</a>
              </li>
            </ul>
          </div>
        </li>

        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'SignIn' }">Sign In</router-link>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUsersStore } from '../stores/UsersStore'
import { inject, ref } from 'vue'

const firebaseApp = inject('firebaseApp')
const { authUser } = storeToRefs(useUsersStore())
const { signOut } = useUsersStore()

const userDropdownOpen = ref(false)
</script>

<style scoped></style>
