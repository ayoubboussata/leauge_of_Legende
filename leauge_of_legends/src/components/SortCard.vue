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
          <div v-for="(spell, index) in champion.spells" :key="index" @click="openSpellModal(spell)">
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
          <div @click="openPassiveModal(champion.passive)">
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

      <!-- Spell Modal -->
      <div v-if="selectedSpell" class="modalOverlay" @click.self="closeSpellModal">
        <div class="modalContent">
          <div class="modalHeader">
            <button class="modalClose" @click="closeSpellModal">&times;</button>
            <h2>{{ selectedSpell?.name || 'Unknown Spell' }}</h2>
          </div>
          <img
            :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${selectedSpell?.image || 'placeholder.png'}`"
            alt="Spell Image" />
          <p><b>Description:</b> {{ selectedSpell?.description || 'No description available' }}</p>
          <p><b>Cooldown:</b> {{ selectedSpell?.cooldown?.length ? selectedSpell.cooldown.join(' / ') : 'N/A' }} secondes</p>
          <p><b>Coût:</b> {{ selectedSpell?.cost?.length ? selectedSpell.cost.join(' / ') : 'N/A' }}</p>
          <button @click="closeSpellModal">Fermer</button>
        </div>
      </div>

      <!-- Passieve Modal -->
      <div v-if="selectedPassive" class="modalOverlay" @click.self="closePassiveModal">
        <div class="modalContent">
          <div class="modalHeader">
            <button class="modalClose" @click="closePassiveModal">&times;</button>
            <h2>{{ selectedPassive?.name || 'Unknown Passive' }}</h2>
          </div>
          <img
            :src="selectedPassive?.image || 'https://ddragon.leagueoflegends.com/cdn/15.1.1/img/passive/placeholder.png'"
            alt="Passive Image" />
          <p><b>Description:</b> {{ selectedPassive?.description || 'No description available' }}</p>
          <button @click="closePassiveModal">Fermer</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { toRaw } from 'vue';
import { useRoute } from 'vue-router';

const loading = ref(true);
const champions = ref([]);
const championDetails = ref([]);
const loadedImages = ref({});
const searchQuery = ref('');
const route = useRoute();
const selectedSpell = ref(null);
const selectedPassive = ref(null);


function removeHtmlTags(text) {
  if (!text) return "No description available";
  return text.replace(/<\/?[^>]+(>|$)/g, "");
}


function openSpellModal(spell) {
  if (!spell) {
    console.error('Spell data is missing:', spell);
    return;
  }

  selectedSpell.value = {
    name: spell.name || 'Unknown',
    description: removeHtmlTags(spell.description),
    cooldown: spell.cooldown || [],
    cost: spell.cost || [],
    image: spell.image,
  };
}

function openPassiveModal(passive) {
  if (!passive) {
    console.error('Passive data is missing:', passive);
    return;
  }
  selectedPassive.value = {
    name: passive.name || 'Unknown Passive',
    description: removeHtmlTags(passive.description),
    image: `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/passive/${passive.image}`,
  };
}

function closeSpellModal() {
  selectedSpell.value = null;
}

function closePassiveModal() {
  selectedPassive.value = null;
}

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
          name: spell.name,
          image: spell.image.full,
          description: spell.description,
          cooldown: spell.cooldown || [],
          cost: spell.cost || [],
        })),
        passive: {
          name: champData.passive.name,
          image: champData.passive.image.full,
          description: champData.passive.description,
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

    await Promise.all(
      plainChampions.map(champion => fetchChampionDetails(champion.id))
    );

    loading.value = false;
  } catch (error) {
    console.error("Error fetching champion details:", error);
  }
}

fetchAllChampionDetails();
onMounted(() => {
  searchQuery.value = route.query.search || '';
});

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
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

/*input */
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

/* Modal */
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

.modalContent {
  background: linear-gradient(135deg, #2a2a3e, #1e1e2e);
  padding: 30px;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  color: #f0f0f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  text-align: center;
  position: relative;
  animation: slideIn 0.4s ease-in-out;
}

.modalContent img {
  display: block;
  margin: 0 auto 20px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #00ffea;
  box-shadow: 0 4px 12px rgba(0, 255, 234, 0.5);
}

.modalContent h2 {
  font-size: 20px;
  font-weight: bold;
  color: #00ffea;
  margin-bottom: 20px;
  text-align: center;
}

.modalContent p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.modalContent p b {
  color: #00d1b3;
}

.modalContent button {
  display: inline-block;
  margin: 15px auto 0;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: #1e1e2e;
  background-color: #00ffea;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modalContent button:hover {
  background-color: #00d1b3;
  transform: scale(1.05);
}

.modalClose {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  color: #f0f0f0;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.modalContent .modalClose:hover {
  color: #ff5a5a;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (min-width: 600px) {
  .modalContent h2 {
    font-size: 26px;
    font-weight: bold;
    color: #00ffea;
    margin-bottom: 20px;
    text-align: center;
  }
}
</style>
