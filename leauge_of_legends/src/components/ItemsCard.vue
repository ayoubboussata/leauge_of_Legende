<template>
  <div v-if="loading" class="loading">
    <p>Loading...</p>
  </div>

  <div v-else>
    <div class="ItemsCard">
      <div v-for="(item, id) in items" :key="id" class="item-card">
        <div class="item-card-content">
          <h2>{{ item.name }}</h2>
          <img :src="getItemImageUrl(id)" :alt="item.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';

const loading = ref(true);
const items = ref({});

const fetchItems = async () => {
  try {
    const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/15.1.1/data/fr_FR/item.json');
    items.value = response.data.data;
    console.log("Items fetched:", items.value);
  } catch (error) {
    console.error("Error fetching items:", error);
  } finally {
    loading.value = false;
  }
};

const getItemImageUrl = (id) => {
  return `https://ddragon.leagueoflegends.com/cdn/15.1.1/img/item/${id}.png`;
};

onMounted(fetchItems);
</script>

<style scoped>
.loading {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
  background: linear-gradient(45deg, #0a0a0a, #1e1e1e);
  padding: 20px;
  border-radius: 8px;
}

.ItemsCard {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  background: rgba(20, 20, 20, 0.8);
  border-radius: 12px;
}

.item-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  width: 200px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.item-card::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%);
  opacity: 0.3;
  transition: opacity 0.3s ease-in-out;
}

.item-card:hover::before {
  opacity: 0.6;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.5);
}

.item-card h2 {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 1px 5px rgba(255, 255, 255, 0.2);
  margin-bottom: 10px;
}

.item-card img {
  max-width: 80px;
  height: auto;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
}

.item-card:hover img {
  transform: scale(1.1);
}

.item-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
