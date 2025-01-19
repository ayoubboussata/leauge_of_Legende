<template>
  <div class="carousel-container">
    <div
      class="carousel"
      :style="{ transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)` }">
      <div
        v-for="champion in randomChamp"
        :key="champion.id"
        class="carousel-item">
        <div class="img">
          <img
            :src="'https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/' + champion.image.full"
            alt="champion" />
        </div>
        <p>{{ champion.name }}</p>
      </div>
    </div>

    <!-- Navigatieknoppen -->
    <button class="prev-button" @click="prevSlide">❮</button>
    <button class="next-button" @click="nextSlide">❯</button>
  </div>
</template>


<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';

const randomChamp = ref([]);
const currentSlide = ref(0);
const itemsPerSlide = 3; // 3 champions par slide
const slideInterval = 5000; // 5 secondes

// function pour récupérer les champions
async function fetchAndSelectRandomChampions() {
  try {
    const response = await axios.get(
      'https://ddragon.leagueoflegends.com/cdn/15.1.1/data/fr_FR/champion.json'
    );
    const allChampions = Object.values(response.data.data);
    randomChamp.value = allChampions.sort(() => 0.5 - Math.random()).slice(0, 60);
  } catch (error) {
    console.error('Error fetching champions:', error);
  }
}

// calcule le nombre total de slides
const totalSlides = computed(() => Math.ceil(randomChamp.value.length / itemsPerSlide));

// fonction pour aller à la slide suivante
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value;
}

// fonction pour aller à la slide précédente
function prevSlide() {
  currentSlide.value =
    (currentSlide.value - 1 + totalSlides.value) % totalSlides.value;
}

// fonction pour démarrer le carrousel
function startCarousel() {
  setInterval(() => {
    nextSlide();
  }, slideInterval);
}

onMounted(() => {
  fetchAndSelectRandomChampions().then(() => {
    startCarousel();
  });
});
</script>


<style scoped>
.carousel-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  height: 300px;
  margin: 70px auto;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel {
  display: flex;
  transition: transform 0.8s ease-in-out;
}

.carousel-item {
  min-width: calc(100% / 3);
  /* Drie items per slide */
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.carousel-item img:hover {
  transform: scale(1.1);
}

.img {
  width: 100px;
  height: 100px;
  border: 3px solid #000;
}

.carousel-item p {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

/* Navigatieknoppen */
.prev-button,
.next-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 24px;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.prev-button {
  left: 10px;
}

.next-button {
  right: 10px;
}

.prev-button:hover,
.next-button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
