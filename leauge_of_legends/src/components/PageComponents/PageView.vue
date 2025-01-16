<template>
  <div class="pageMain">
    <slot></slot>
  </div>
</template>

<style scoped>
.pageMain {
  background: rgba(17, 24, 39, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin-bottom: 40px;
}
</style>
