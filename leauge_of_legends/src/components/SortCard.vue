<template>

  <div>
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Chargement...</p>
    </div>

    <div v-else class="sorts">
      <input type="text" v-model="searchQuery" placeholder="Chercher un Sort ..." class="search-input" />

      <div v-for="champion in filteredChampions" :key="champion.name" class="champion-card">
        <h3>{{ champion.name }}</h3>
        <div class="competences">
          <div v-for="(spell, index) in champion.spells" :key="index">
            <div v-if="!loadedImages[spell.image]" class="spinner"></div>
            <img
              :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${spell.image}`"
              :alt="spell.name"
              class="spellimg"
              @load="markImageAsLoaded(spell.image)"
              :class="{ hidden: !loadedImages[spell.image] }" />
            <p>{{ spell.name }}</p>
          </div>
          <!-- Passieve -->
          <div>
            <div v-if="!loadedImages[champion.passive.image]" class="spinner"></div>
            <img
              :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/passive/${champion.passive.image}`"
              :alt="champion.passive.name"
              class="spellimg"
              @load="markImageAsLoaded(champion.passive.image)"
              :class="{ hidden: !loadedImages[champion.passive.image] }" />
            <p>{{ champion.passive.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { toRaw } from 'vue';

const loading = ref(true);
const champions = ref([]);
const championDetails = ref([]);
const loadedImages = ref({});
const searchQuery = ref('');

const filteredChampions = computed(() => {
  return championDetails.value.filter(champion =>
    champion.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const markImageAsLoaded = (spellImg) => {
  loadedImages.value[spellImg] = true;
};

async function fetchVersion() {
  try {
    const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    return response.data[0];
  } catch (error) {
    console.error('Error fetching version:', error);
    return '15.1.1';
  }
}

async function fetchChampions() {
  try {
    const version = await fetchVersion();
    const response = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`
    );

    champions.value = Object.values(response.data.data);
  } catch (error) {
    console.error('Error fetching champion:', error);
  }
}

async function fetchChampionDetails(championName) {
  try {
    const version = await fetchVersion();
    const response = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion/${championName}.json`
    );
    const champData = response.data.data[championName];

    if (champData) {
      championDetails.value.push({
        name: champData.name,
        spells: champData.spells.map(spell => ({
          name: spell.name.split('/')[0],
          image: spell.image.full,
        })),
        passive: {
          name: champData.passive.name.split('/')[0],
          image: champData.passive.image.full,
        },
      });
    }
  } catch (error) {
    console.error(`Error fetching details for ${championName}:`, error);
  }
}

async function fetchAllChampionDetails() {
  try {
    await fetchChampions();
    const plainChampions = toRaw(champions.value);

    await Promise.all(plainChampions.map(champion => fetchChampionDetails(champion.id)));

    loading.value = false;
  } catch (error) {
    console.error("Fout bij het ophalen van kampioendetails:", error);
  }
}

fetchAllChampionDetails();
</script>


<style scoped>
/* general container */
.competences {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;

}

.sorts {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 80px;
}

/* style pour chaque champion */
.champion-card {
  background: linear-gradient(135deg, #1e1e2e, #252542);
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  width: 350px;
}

.champion-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.5);
}

/* Spells grid */
.competences {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 10px;
}

/* Spell-container */
.competences div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Spell img */
.spellimg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid #00ffea;
  box-shadow: 0 4px 12px rgba(0, 255, 234, 0.5);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.spellimg:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 255, 234, 0.8);
  cursor: pointer;
}

/* loading */
.hidden {
  display: none;
}

/* Spinner (animation de chargement pour img) */
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #00ffea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}

/* Animation pour le spinner */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* champ nom */
h3 {
  color: #fff;
  font-size: 22px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

/* Spell nom */
.competences p {
  font-size: 14px;
  color: #d1d1d1;
  margin-top: 5px;
  text-align: center;
  max-width: 80px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* loading txt */
.loading {
  color: white;
  font-size: 18px;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
}

/* input */
input {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  background-color: #333;
}

input:focus {
  outline: none;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.8);
  font-weight: bold;
  opacity: 0.5;
}

/* loading container */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  /* Volledige hoogte */
  text-align: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

/* Loading Spinner */
.loading-spinner {
  width: 50px;
  height: 50px;
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top: 6px solid #00ffea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

/* Loading Animation */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
