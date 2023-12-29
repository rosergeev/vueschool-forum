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
          <router-link :to="{ name: 'Profile' }">
            <img
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`"
            />
            <span>
              {{ authUser.name }}
              <img class="icon-profile" src="../assets/svg/arrow-profile.svg" alt="" />
            </span>
          </router-link>

          <div id="user-dropdown">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item"><a href="profile.html">View profile</a></li>
              <li class="dropdown-menu-item"><a href="#">Log out</a></li>
            </ul>
          </div>
        </li>
        <li v-if="authUser" class="navbar-item">
          <a @click.prevent="signOut(firebaseApp)">Sign Out</a>
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
import { inject } from 'vue'

const firebaseApp = inject('firebaseApp')
const { authUser } = storeToRefs(useUsersStore())
const { signOut } = useUsersStore()
</script>

<style scoped></style>
