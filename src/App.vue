<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from './components/TheNavbar.vue';
</script>

<template>
  <the-navbar></the-navbar>
  <div class="container">
    <RouterView />
  </div>
</template>

<style>
@import '@/assets/style.css';</style>
