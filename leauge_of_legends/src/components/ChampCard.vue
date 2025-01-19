<template>
  <div v-if="loading" class="loading">
    <p>Chargement des champions...</p>
  </div>

  <div v-else>
    <input type="text" v-model="searchQuery" placeholder="Chercher un champion" />

    <div class="champBox">
      <div
        class="champion"
        v-for="champion in filteredChampions"
        :key="champion.id"
        @click="openModal(champion)">
        <div class="champImgName">
          <div class="img">
            <img
              :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/${champion.id}.png`"
              alt="champion" />
          </div>
          <p>{{ champion.name }}</p>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div v-if="isModalVisible" class="modalOverlay" @click.self="closeModal">
      <div class="modalContent">
        <h2 class="championName">{{ selectedChampion.name }}</h2>
        <div class="championsdetailsimgs">
          <img
            :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/champion/${selectedChampion.id}.png`"
            alt="champion" />
          <div class="championDetailsSorts">
            <div class="championDetails">
              <div class="degat_mana">
                <p>⚔️<br> {{ degat }}</p>
                <p>💧<br> {{ mana }}</p>
              </div>
              <div class="pv_shield">
                <p>❤️<br> {{ pv }}</p>
                <p>🛡️<br> {{ shield }}</p>
              </div>
              <div class="as_bot">
                <p>🪓<br> {{ attackspeed }}</p>
                <p>👞<br> {{ boots }}</p>
              </div>
            </div>
          </div>
        </div>
        <p><span class="details">Surnom:</span> {{ selectedChampion.title }}</p>
        <p><span class="details">Lore:</span> {{ selectedChampion.blurb }}</p>
        <p><span class="details">Rôle:</span> {{ selectedChampion.tags.join(', ') }}</p>
        <div class="sortsBtn">
          <button @click="closeModal">Fermer</button>
          <button @click="SortsModal">Sorts</button>

        </div>
      </div>

      <!-- Sorts Modal -->
      <div v-if="isSortsModalVisible" class="modalOverlay" @click.self="closeSortsModal" id="sortsModal">
        <div class="modalContent">
          <div class="modalSortsdiv">
            <h2>Compétences</h2>
            <div class="competences">
              <div>
                <img :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${qspellimg}`"
                  alt="qspell" class="spellimg">
                <p>{{ qspell }}</p>
              </div>
              <div>
                <img :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${wspellimg}`"
                  alt="wspell" class="spellimg">
                <p>{{ wspell }}</p>
              </div>
              <div>
                <img :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${espellimg}`"
                  alt="espell" class="spellimg">
                <p>{{ espell }}</p>
              </div>
              <div>
                <img :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/spell/${rspellimg}`"
                  alt="rspell" class="spellimg">
                <p>{{ rspell }}</p>
              </div>
              <div>
                <img :src="`https://ddragon.leagueoflegends.com/cdn/15.1.1/img/passive/${pspellimg}`"
                  alt="pspell" class="spellimg">
                <p>{{ pspell }}</p>
              </div>
            </div>
            <div class="sortsBtn">
              <button @click="closeSortsModal">Fermer</button>
              <button @click="plusDeDetails">Plus</button>
            </div>
          </div>
        </div>

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
const loading = ref(true);
const degat = ref(0);
const mana = ref(0);
const pv = ref(0);
const shield = ref(0);
const attackspeed = ref(0);
const boots = ref(0);
const isSortsModalVisible = ref(false);
const qspell = ref('');
const qspellimg = ref('');
const wspell = ref('');
const wspellimg = ref('');
const espell = ref('');
const espellimg = ref('');
const rspell = ref('');
const rspellimg = ref('');
const pspell = ref('');
const pspellimg = ref('');



const filteredChampions = computed(() => {
  return champions.value.filter((champion) =>
    champion.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Dynamically fetch version
async function fetchVersion() {
  try {
    const response = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json');
    return response.data[0];
  } catch (error) {
    console.error('Error fetching version:', error);
    return '15.1.1';
  }
}


async function fetchChampion() {
  try {
    const version = await fetchVersion();
    const response = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`
    );

    champions.value = Object.values(response.data.data);
  } catch (error) {
    console.error('Error fetching champion:', error);
  } finally {
    loading.value = false;
  }
}

async function fetchChampionDetails(championName) {
  try {
    const version = await fetchVersion();
    const response = await axios.get(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion/${championName}.json`
    );
    const champData = response.data.data[championName];
    console.log(champData);
    if (champData) {

      degat.value = champData.stats.attackdamage;
      mana.value = champData.stats.mp;
      pv.value = champData.stats.hp;
      shield.value = champData.stats.armor;
      attackspeed.value = champData.stats.attackspeed;
      boots.value = champData.stats.movespeed;


      qspell.value = champData.spells[0].name.split('/')[0];
      qspellimg.value = champData.spells[0].image.full;
      wspell.value = champData.spells[1].name.split('/')[0];
      wspellimg.value = champData.spells[1].image.full;
      espell.value = champData.spells[2].name.split('/')[0];
      espellimg.value = champData.spells[2].image.full;
      rspell.value = champData.spells[3].name.split('/')[0];
      rspellimg.value = champData.spells[3].image.full;
      pspell.value = champData.passive.name.split('/')[0];
      pspellimg.value = champData.passive.image.full;
    }
  } catch (error) {
    console.error('Error fetching champion details:', error);
  }
}

function SortsModal() {
  isSortsModalVisible.value = true;
}

function closeSortsModal() {
  isSortsModalVisible.value = false;
}


function openModal(champion) {
  selectedChampion.value = champion;
  isModalVisible.value = true;
  fetchChampionDetails(champion.id);
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

.img {
  width: 100px;
  height: 100px;
  border: 3px solid #000;
}

.champImgName p {
  color: white;
  font-size: 14px;
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
  font-size: 16px;
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
  font-size: 32px;
  color: #00ffea;
}

/* Champion details */
.modalContent p {
  margin-bottom: 15px;
  font-size: 16px;
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
  font-size: 16px;
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

/*¨details pour les champions */
.championsdetailsimgs {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.championDetails {
  display: flex;
  column-gap: 30px;
}

.degat_mana {
  display: flex;
  column-gap: 20px;
}

.pv_shield {
  display: flex;
  column-gap: 20px;
}

.as_bot {
  display: flex;
  column-gap: 20px;
}

/* Sorts */

.sortBtn {
  margin-top: 20px;
}

.competences {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
}

.competences div {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
}

.competences img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 3px solid #00ffea;
}

.competences p {
  margin-bottom: 15px;
  font-size: 16px;
  color: #d1d1d1;
  line-height: 1;
}

/* Sorts modal */

.modalSortsdiv {
  padding: 10px;
  background: #1c1c1c;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  color: #f8f8f8;
  animation: slideIn 0.3s ease-in-out;
}

/* Sorts button */
.sortsBtn {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  max-width: 261px;
  justify-content: space-between;
}

/* loading */


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

@media (min-width: 600px) {
  .championsdetailsimgs {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 490px;
    align-items: center;
  }

  .degat_mana {
    display: flex;
    justify-content: space-between;
  }

  .pv_shield {
    display: flex;
    justify-content: space-between;
  }

  .as_bot {
    display: flex;
    justify-content: space-between;
  }

  .championDetails {
    display: flex;
    flex-direction: column;
    width: 120px;
  }
}
</style>
