<script setup>
import { RouterView, useRoute } from 'vue-router';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <component :is="Component" :key="useRoute().path" />
    </transition>
  </RouterView>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
