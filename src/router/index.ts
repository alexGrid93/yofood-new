import MainPage from '@/views/MainPage.vue'
import NotFound from '@/views/NotFound.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/:sheetId',
      name: 'main',
      component: MainPage,
    },
    {
      path: '*',
      name: 'notFound',
      component: NotFound,
    },
  ],
})

export default router
