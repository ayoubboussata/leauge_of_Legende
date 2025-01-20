import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ChampionsView from '../views/ChampionsView.vue';
import ItemView from '../views/ItemsView.vue';
import InfoView from '@/views/InfoView.vue';
import SortsView from '@/views/SortsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/champions',
      name: 'champions',
      component: ChampionsView,
    },
    {
      path: '/sorts',
      name: 'sorts',
      component: SortsView,
    },
    {
      path: '/items',
      name: 'items',
      component: ItemView,
    },
    {
      path: '/info',
      name: 'info',
      component: InfoView,
    },
  ],
});

export default router;
