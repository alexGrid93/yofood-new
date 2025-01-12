import MainPage from '@/views/MainPage.vue'
import NotFound from '@/views/NotFound.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory('/yofood-new/'),
  routes: [
    {
      path: '/:sheetId',
      name: 'main',
      component: MainPage,
    },
  ],
})

export default router
