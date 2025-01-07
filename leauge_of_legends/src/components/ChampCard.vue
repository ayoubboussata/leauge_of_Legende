<template>
  <div>
    <input type="text" v-model="searchQuery" placeholder="chercher un champion" />
  </div>
  <div class="champBox">
    <div class="champion" v-for="champion in filteredChampions" :key="champion.id" @click="openModal(champion)">
      <div class="champImgName">
        <img
          :src="`http://ddragon.leagueoflegends.com/cdn/11.20.1/img/champion/${champion.id}.png`"
          alt="champion" />
        <p>{{ champion.name }}</p>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="isModalVisible" class="modalOverlay" @click.self="closeModal">
      <div class="modalContent">
        <h2 class="championName">{{ selectedChampion.name }}</h2>
        <img
          :src="`http://ddragon.leagueoflegends.com/cdn/11.20.1/img/champion/${selectedChampion.id}.png`"
          alt="champion" />
        <p><span class="details">Surnom:</span> {{ selectedChampion.title }}</p>
        <p><span class="details">Lore:</span> {{ selectedChampion.blurb }}</p>
        <p><span class="details">Rôle:</span> {{ selectedChampion.tags.join(', ') }}</p>
        <button @click="closeModal">Fermer</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const champions = ref([]);
const searchQuery = ref('');
const isModalVisible = ref(false);
const selectedChampion = ref(null);

const filteredChampions = computed(() => {
  return champions.value.filter((champion) =>
    champion.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

async function fetchChampion() {
  try {
    const response = await axios.get(
      'http://ddragon.leagueoflegends.com/cdn/11.20.1/data/fr_FR/champion.json'
    );
    champions.value = Object.values(response.data.data); //  convertir les champions en array
  } catch (error) {
    console.error('Error fetching champion:', error);
  }
}

function openModal(champion) {
  selectedChampion.value = champion;
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
}

fetchChampion();
</script>

<style scoped>
.champBox {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.champion {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.champImgName {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.champImgName img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.champImgName p {
  color: white;
  font-size: 1.2rem;
  margin-top: 10px;
}

.champImgName img:hover {
  transform: scale(1.1);
}

.champImgName img {
  transition: transform 0.3s ease;
}

.champImgName img:hover {
  box-shadow: 0 4px 12px rgba(81, 171, 212, 0.8);
}

.champImgName img {
  box-shadow: 0 4px 12px rgba(81, 171, 212, 0.8);
}

input {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  color: white;
  background-color: #333;
}

input:focus {
  outline: none;
}

input::placeholder {
  color: white;
}

/* Modal overlay */
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

/* Modal content */
.modalContent {
  background: #1c1c1c;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  color: #f8f8f8;
  animation: slideIn 0.3s ease-in-out;
}

/* Champion image */
.modalContent img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 3px solid #00ffea;
}

/* Champion name */
.modalContent h2 {
  margin-bottom: 10px;
  font-size: 2rem;
  color: #00ffea;
}

/* Champion details */
.modalContent p {
  margin-bottom: 15px;
  font-size: 1rem;
  color: #d1d1d1;
  line-height: 1.5;
}

/* Close button */
.modalContent button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #00ffea;
  color: #1c1c1c;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.modalContent button:hover {
  background-color: #00d1b3;
  transform: scale(1.05);
}

/* Champion details */
.details {
  font-weight: bold;
}

/* Animations */
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
    transform: translateY(-20px);
  }

  to {
    transform: translateY(0);
  }
}
</style>
