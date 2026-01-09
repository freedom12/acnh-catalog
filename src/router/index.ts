import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/HomePage.vue'),
    children: [
      {
        path: '',
        redirect: '/items',
      },
      {
        path: 'items',
        name: 'Items',
        component: () => import('../views/ItemsView.vue'),
      },
      {
        path: 'recipes',
        name: 'Recipes',
        component: () => import('../views/RecipesView.vue'),
      },
      {
        path: 'creatures',
        name: 'Creatures',
        component: () => import('../views/CreaturesView.vue'),
      },
      {
        path: 'fossils',
        name: 'Fossils',
        component: () => import('../views/FossilsView.vue'),
      },
      {
        path: 'artworks',
        name: 'Artworks',
        component: () => import('../views/ArtworkView.vue'),
      },
      {
        path: 'music',
        name: 'Music',
        component: () => import('../views/MusicView.vue'),
      },
      {
        path: 'villagers',
        name: 'Villagers',
        component: () => import('../views/VillagersView.vue'),
      },
      {
        path: 'npcs',
        name: 'NPCs',
        component: () => import('../views/NPCsView.vue'),
      },
      {
        path: 'reactions',
        name: 'Reactions',
        component: () => import('../views/ReactionsView.vue'),
      },
      {
        path: 'constructions',
        name: 'Constructions',
        component: () => import('../views/ConstructionView.vue'),
      },
      {
        path: 'message-cards',
        name: 'MessageCards',
        component: () => import('../views/MessageCardView.vue'),
      },
      {
        path: 'patterns',
        name: 'Misc',
        component: () => import('../views/MiscView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
