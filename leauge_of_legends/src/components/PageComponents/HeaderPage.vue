<template>
  <header class="header-view">
    <div class="pageLogoContainer">
      <div class="pageLogoContainerphoto">
        <router-link to="/" class="pageLogoLink">
          <img src="../PageComponents/assets/logo.webp" alt="Leaugepedia logo" class="pageLogo" height="130px" />
        </router-link>
      </div>
      <div class="tab-container">
        <div class="page">
          <ul class="tabs" ref="tabs">
            <li v-for="tab in tabsData"
              :key="tab.path"
              class="tab"
              :class="{ active: isActive(tab.path) }">
              <router-link class="navTxt" :to="tab.path">{{ tab.name }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const tabs = ref(null);
const movable = ref(null);
const route = useRoute();

const tabsData = [
  { name: 'Accueil', path: '/', index: 0 },
  { name: 'Champions', path: '/champions', index: 1 },
  { name: 'Sorts', path: '/sorts', index: 2 },
  { name: 'Items', path: '/items', index: 3 },
  { name: 'Info', path: '/info', index: 4 },
];

const isActive = (path) => route.path === path;

const updateMovable = () => {
  const activeTab = tabs.value.querySelector('.tab.active');
  if (activeTab && movable.value) {
    const leftPos = activeTab.offsetLeft;
    const width = activeTab.offsetWidth;
    movable.value.style.transition = 'width 0.2s ease-out';
    movable.value.style.left = `${leftPos}px`;
    movable.value.style.width = `${width}px`;
  }
};


onMounted(() =>
  updateMovable()
);

watch(route, () => {
  updateMovable();
});
</script>

<style scoped>
header {
  text-align: center;
}

.header-view {
  margin: 0;
}

.pageLogoContainer {
  margin-bottom: 30px;
  padding: 30px;
}

h1 {
  font-size: 3em;
  color: #52a0e0;
  font-weight: 700;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

p {
  font-size: 1.2em;
  color: #D1D5DB;
  margin-bottom: 30px;
  line-height: 1.5;
}

.pageLogo {
  height: auto;
  width: 70px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(81, 171, 212, 0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.pageLogo:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 140, 255, 0.6);
  border-radius: 10px;
}


.tab {
  padding: 15px 40px;
  cursor: pointer;
  font-size: 1em;
  font-weight: 600;
  color: #EAEAEA;
  text-transform: uppercase;
  transition: background 0.3s ease, color 0.3s ease;
  position: relative;
}



.tab:hover {
  background: rgba(92, 210, 240, 0.2);
}

.tab.active {
  background: rgba(81, 171, 212, 0.8);
  color: #0B0D17;
  font-weight: bold;
  border-radius: 4px;
}

.navTxt {
  text-decoration: none;
  color: inherit;
}

.movable {
  position: absolute;
  height: 4px;
  background: #52a5b9;
  bottom: 0;
  transition: left 0.3s, width 0.3s;
  border-radius: 2px;
  z-index: 1;
}

@media (min-width: 900px) {
  .pageLogoContainer {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }

  .tabs {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 10px 0;
    margin: 0;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    position: relative;
  }
}
</style>
