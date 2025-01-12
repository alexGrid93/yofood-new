import MainPage from '@/views/MainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/sheet/:sheetId',
      name: 'home',
      component: MainPage,
    },
  ],
})

export default router
