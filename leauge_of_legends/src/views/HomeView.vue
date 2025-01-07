<template>
  <div>
    <page-view>
      <header-view />
      <div class="hero-section">
        <h1>Bienvenue sur Leaugepedia, votre source ultime pour tout ce qui concerne League of Legends !</h1>
        <button class="explore-btn" @click="exploreBtn">Commencer l'exploration</button>
      </div>
      <div class="carousel-champ">
        <carousel-champ />
      </div>
      <section class="stats-section">
        <h2>Statistiques rapides</h2>
        <div class="stats-cards">
          <div class="stat-card">
            <h3 class="manyChamp"> {{ manyChamp }}</h3>
            <p>Champions</p>
          </div>
          <div class="stat-card">
            <h3 class="manyItems">{{ manyItems }}</h3>
            <p>Objets</p>
          </div>
          <div class="stat-card">
            <h3 class="patch">{{ patch }}</h3>
            <p>Dernier patch</p>
          </div>
        </div>
      </section>
    </page-view>
  </div>
</template>


<script setup>
import HeaderView from '@/components/PageComponents/HeaderPage.vue';
import PageView from '@/components/PageComponents/PageView.vue';
import CarouselChamp from '@/components/CarrouselChamp.vue';
import axios from 'axios';
import { ref } from 'vue';

const manyChamp = ref("");
const manyItems = ref("");
const patch = ref("");


const exploreBtn = () => {
  window.location.href = '/champions';
};

// fonction pour récupérer tous les champions
async function fetchAllPlayer() {
  try {
    const response = await axios.get(
      'http://ddragon.leagueoflegends.com/cdn/11.20.1/data/fr_FR/champion.json'
    );
    const allChampions = Object.values(response.data.data);
    manyChamp.value = allChampions.length;
  } catch (error) {
    console.error('Error fetching champions:', error);
  }
}

// fonction pour recupere les items & le version

async function fetchAllItemsAndVersion() {
  try {
    const response = await axios.get(
      'https://ddragon.leagueoflegends.com/cdn/14.24.1/data/fr_FR/item.json');
    const allItems = Object.values(response.data.data);
    manyItems.value = allItems.length;
    patch.value = response.data.version;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
}




fetchAllItemsAndVersion();
fetchAllPlayer();
</script>

<style scoped>
.hero-section {
  text-align: center;
  padding: 50px 20px;
  background: rgba(17, 24, 39, 0.8);
  border-radius: 10px;
  margin: 20px auto;
  max-width: 800px;
  color: #F8F9FA;
}

.hero-section h1 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #ffffff;
}

.hero-section p {
  font-size: 1.2em;
  margin-bottom: 30px;
  line-height: 1.5;
}

.explore-btn {
  padding: 15px 30px;
  font-size: 1em;
  font-weight: bold;
  color: #0B0D17;
  background-color: #00ffea;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.explore-btn:hover {
  background-color: #FFC107;
  transform: scale(1.05);
}


/* style pour les stats */
.stats-section {
  text-align: center;
  padding: 40px 20px;
  margin: 50px auto;
  color: #F8F9FA;
}

.stats-section h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #FFD700;
}

.stats-cards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  width: 150px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
}

.stat-card h3 {
  font-size: 2em;
  margin-bottom: 10px;
  color: #00ffea;
}

.stat-card p {
  font-size: 1.2em;
}
</style>
