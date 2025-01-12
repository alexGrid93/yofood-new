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
    {
      path: '/:pathMatch(.*)*', // Любой маршрут, который не совпадает с другими
      name: 'not-found',
      component: NotFound,
    },
  ],
})

export default router
