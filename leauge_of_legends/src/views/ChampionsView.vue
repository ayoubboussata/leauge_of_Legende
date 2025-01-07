<template>
  <page-view>
    <div class="page">
      <header-view />
      <h1>
        champions
      </h1>
    </div>
    <champ-card></champ-card>
  </page-view>
</template>


<script setup>
import HeaderView from '@/components/PageComponents/HeaderPage.vue';
import PageView from '@/components/PageComponents/PageView.vue';
import ChampCard from '@/components/ChampCard.vue';

</script>


<style scoped>
h1 {
  margin-top: 20px;
  text-align: center;
  color: white;
  font-size: large;
}
</style>
