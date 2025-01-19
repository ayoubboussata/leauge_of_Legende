<script setup>
import { RouterView, useRoute } from 'vue-router';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="parallax-fade" mode="out-in">
      <component :is="Component" :key="useRoute().path" />
    </transition>
  </RouterView>
</template>

<style scoped>
.parallax-fade-enter-active,
.parallax-fade-leave-active {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.7s ease;
}

.parallax-fade-enter {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}

.parallax-fade-leave-to {
  transform: translateY(-30px) scale(1.05);
  opacity: 0;
}
</style>
