import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import ('../views/Home.vue')
  },
  {
    path: '/folder/:id',
    component: () => import ('../views/FolderPage.vue')
  },
  {
    path: '/settings',
    component: () => import ('../views/Settings.vue')
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
