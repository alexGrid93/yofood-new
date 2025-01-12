import MainPage from '@/views/MainPage.vue'
import NotFound from '@/views/NotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/:sheetId',
      name: 'main',
      component: MainPage,
    },
  ],
})

export default router
