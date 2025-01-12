import MainPage from '@/views/MainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/yofood-new/'),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainPage,
    },
  ],
})

export default router
