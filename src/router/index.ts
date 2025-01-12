import MainPage from '@/views/MainPage.vue'
import NotFound from '@/views/NotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:sheetId',
      name: 'main',
      component: MainPage,
    },
    {
      path: '/',
      name: 'home',
      component: NotFound,
    },
  ],
})

export default router
