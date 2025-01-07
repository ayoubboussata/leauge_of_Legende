<template>
  <div class="carousel-container">
    <div
      class="carousel"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
      <div v-for="champion in randomChamp" :key="champion.id" class="carousel-item">
        <img
          :src="'http://ddragon.leagueoflegends.com/cdn/11.20.1/img/champion/' + champion.image.full"
          alt="champion" />
        <p>{{ champion.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const randomChamp = ref([]);
const currentSlide = ref(0);
const slideInterval = 3000; // 3 seconden par slide

// function pour récupérer les champions aléatoires et les afficher
async function fetchAndSelectRandomChampions() {
  try {
    const response = await axios.get(
      'http://ddragon.leagueoflegends.com/cdn/11.20.1/data/fr_FR/champion.json'
    );
    const allChampions = Object.values(response.data.data); //  convertir les champions en array
    randomChamp.value = allChampions.sort(() => 0.5 - Math.random()).slice(0, 30);
  } catch (error) {
    console.error('Error fetching champions:', error);
  }
}

// fonction pour parcourir automatiquement les slides
function startCarousel() {
  setInterval(() => {
    currentSlide.value =
      (currentSlide.value + 1) % randomChamp.value.length;
  }, slideInterval);
}

onMounted(() => {
  fetchAndSelectRandomChampions().then(() => {
    startCarousel();
  });
});
</script>

<style>
.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 300px;
  margin: 20px auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel {
  display: flex;
  transition: transform 0.8s ease-in-out;
}

.carousel-item {
  min-width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.carousel-item img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
  transition: transform 0.3s ease;
}

.carousel-item img:hover {
  transform: scale(1.1);
}

.carousel-item p {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}
</style>
